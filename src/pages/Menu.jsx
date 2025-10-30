import { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import MenuHeader from "../components/Menu/MenuHeader";
import MenuContent from "../components/Menu/MenuContent";
import MenuFooter from "../components/Menu/MenuFooter";
import PersonalizationModal from "../components/Menu/PersonalizationModal";
import CartSidebar from "../components/Menu/CartSidebar";
import PaymentSidebar from "../components/Menu/PaymentSidebar";
import DishOptionsModal from "../components/Menu/DishOptionsModal";
import OrderStatusSidebar from "../components/Menu/OrderStatusSidebar";
import {
  createOrder,
  getOrderById,
  getOrderDetailsByOrderId,
} from "../lib/apiOrder";
import { useMenuPersonalization } from "../hooks";
import { listDish, getDish } from "../lib/apiDish";
import {
  updateCustomerPersonalization,
  getCustomerDetail,
} from "../lib/apiCustomer";
import { getToppingsByDishId } from "../lib/apiDishTopping";
import {
  createOrderDetailsFromCart,
  deleteOrderDetail,
  createOrderDetail,
} from "../lib/apiOrderDetail";
import EditOrderDetailModal from "../components/Menu/EditOrderDetailModal";
import { createPayment, getPaymentById } from "../lib/apiPayment";
import ToastHost, { showToast } from "../common/ToastHost";
import ConfirmDialog from "../common/ConfirmDialog";
import ToastHost, { showToast } from "../common/ToastHost";
import ConfirmDialog from "../common/ConfirmDialog";

export default function Menu() {
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCallStaffOpen, setIsCallStaffOpen] = useState(false);
  const [isDishOptionsOpen, setIsDishOptionsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState("all");
  const [selectedDish, setSelectedDish] = useState(null);
  const [cart, setCart] = useState([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [tableId, setTableId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [orderId, setOrderId] = useState(
    () => sessionStorage.getItem("orderId") || null,
  );
  const [baseCalories, setBaseCalories] = useState(null);
  const [estimatedCalories, setEstimatedCalories] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [menuDishes, setMenuDishes] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [paymentItems, setPaymentItems] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [paidSuccessOpen, setPaidSuccessOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const paidLockedRef = useRef(false);
  const pollStopRef = useRef(false);
  const pollTimerRef = useRef(null);
  const thanksTimerRef = useRef(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onYes: null,
  });
  const askConfirm = ({ title, message, onYes }) =>
    setConfirmState({ open: true, title, message, onYes });
  const paidLockedRef = useRef(false);
  const pollStopRef = useRef(false);
  const pollTimerRef = useRef(null);
  const thanksTimerRef = useRef(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onYes: null,
  });
  const askConfirm = ({ title, message, onYes }) =>
    setConfirmState({ open: true, title, message, onYes });

  const PERSONAL_KEY = (cid) => `personalization:${cid}`;
  const applyGoal = (cals, goal) => {
    if (typeof cals !== "number" || !isFinite(cals)) return null;
    if (goal === "lose") return Math.max(0, cals - 500);
    if (goal === "gain") return cals + 500;
    return cals;
  };

  const readAuthUser = () => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const getDisplayName = (u) =>
    String(u?.fullName || u?.name || u?.username || "").trim();

  useEffect(() => {
    const storedTableId = sessionStorage.getItem("customerTableId");
    if (storedTableId) setTableId(storedTableId);

    const user = readAuthUser();
    const cid =
      user?.customerId ?? user?.id ?? sessionStorage.getItem("customerId");
    if (cid != null) {
      setCustomerId(String(cid));
      sessionStorage.setItem("customerId", String(cid));
    }
    const name = getDisplayName(user);
    if (name) setCustomerName(name);

    const sync = () => {
      const u = readAuthUser();
      const c = u?.customerId ?? u?.id;
      if (c != null) {
        setCustomerId(String(c));
        sessionStorage.setItem("customerId", String(c));
      }
      const n = getDisplayName(u);
      if (n) setCustomerName(n);
    };
    window.addEventListener("storage", sync);
    window.addEventListener("auth:changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth:changed", sync);
    };
  }, []);

  useEffect(() => {
    const ready = Boolean(customerId) && Boolean(tableId);
    if (!ready) return;

    const existed = sessionStorage.getItem("orderId");
    if (existed) {
      setOrderId(existed);
      return;
    }

    const idemKey = `orderInit_${customerId}_${tableId}`;
    if (sessionStorage.getItem(idemKey) === "1") return;
    sessionStorage.setItem(idemKey, "1");

    (async () => {
      try {
        const order = await createOrder({ customerId, tableId });
        if (order?.orderId) {
          setOrderId(String(order.orderId));
          sessionStorage.setItem("orderId", String(order.orderId));
        }
      } catch (err) {
        console.error("Create order failed:", err?.message || err);
        sessionStorage.removeItem(idemKey);
      }
    })();
  }, [customerId, tableId]);

  const hiddenNames = (() => {
    try {
      return JSON.parse(localStorage.getItem("hidden_dishes")) || [];
    } catch (_) {
      return [];
    }
  })();

  useEffect(() => {
    (async () => {
      try {
        const data = await listDish();
        console.log("📦 Dữ liệu BE trả về:", data);
        setMenuDishes(data);

        // ✅ Chuẩn hóa dữ liệu từ BE
        const normalized = data.map((d) => ({
          ...d,
          // Dùng isInDailyPlan do BE trả về, nếu không có thì default false
          isInDailyPlan: Boolean(d.isInDailyPlan),
          // Một số BE có thể trả về tên field khác như isInPlan hoặc inDailyPlan
          name: d.name ?? d.dishName,
          calo: d.calo ?? d.calories ?? 0,
        }));

        setMenuDishes(normalized);
      } catch (err) {
        console.error("❌ Lỗi khi load món ăn:", err);
      }
    })();
  }, []);

  const filteredDishes = menuDishes.filter(
    (dish) => dish.isAvailable && !hiddenNames.includes(dish.name),
  );

  const { personalizationForm, setPersonalizationForm, personalizedDishes } =
    useMenuPersonalization(filteredDishes);

  useEffect(() => {
    if (!customerId) return;

    const cachedRaw = localStorage.getItem(PERSONAL_KEY(customerId));
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (cached && typeof cached === "object") {
          const data = cached.data || {};
          delete data.goal;
          setPersonalizationForm((prev) => ({ ...prev, ...data }));

          if (typeof cached.perWorkout === "number") {
            const roundedBase = Math.ceil(cached.perWorkout);
            const roundedGoal = Math.ceil(
              applyGoal(cached.perWorkout, data.goal),
            );
            setBaseCalories(roundedBase);
            setEstimatedCalories(roundedGoal);
            setIsPersonalized(true);
          } else setIsPersonalized(true);
        }
      } catch {}
      return;
    }

    (async () => {
      try {
        const cus = await getCustomerDetail(customerId);
        const toForm = {
          height: Number(cus.height ?? 170),
          weight: Number(cus.weight ?? 70),
          gender: cus.sex === true ? "male" : "female",
          age: 25,
          mealsPerDay: Number(cus.portion ?? 3),
          exerciseLevel: "moderate",
          goal: "",
        };
        setPersonalizationForm((prev) => ({ ...prev, ...toForm }));
        localStorage.setItem(
          PERSONAL_KEY(customerId),
          JSON.stringify({ data: toForm, updatedAt: Date.now() }),
        );
      } catch (e) {
        console.warn("Không lấy được personalization từ BE:", e?.message || e);
      }
    })();
  }, [customerId]);

  const addToCart = (item) => {
    const noteKey = item.notes || "";
    const existingItem = cart.find(
      (it) => it.id === item.id && (it.notes || "") === noteKey,
    );
    if (existingItem) {
      setCart((prev) =>
        prev.map((it) =>
          it.id === item.id && (it.notes || "") === noteKey
            ? { ...it, quantity: it.quantity + (item.quantity ?? 1) }
            : it,
        ),
      );
    } else {
      setCart((prev) => [...prev, { ...item }]);
    }
    setCaloriesConsumed(
      (prev) => prev + (item.totalCalories || item.calories || 0),
    );
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const item = cart.find((it) => it.id === itemId);
    if (item) {
      const diff = newQuantity - item.quantity;
      setCart((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, quantity: newQuantity } : it,
        ),
      );
      setCaloriesConsumed(
        (prev) => prev + diff * (item.totalCalories || item.calories),
      );
    }
  };

  const removeFromCart = (itemId) => {
    const item = cart.find((it) => it.id === itemId);
    if (item) {
      setCart((prev) => prev.filter((it) => it.id !== itemId));
      setCaloriesConsumed(
        (prev) => prev - (item.totalCalories || item.calories) * item.quantity,
      );
    }
  };

  const handleOrderFood = async () => {
    try {
      if (!orderId) throw new Error("Chưa có mã đơn (orderId).");
      if (!cart.length) throw new Error("Giỏ hàng đang trống.");
      const saved = await createOrderDetailsFromCart(orderId, cart);
      setIsCartOpen(false);
      setCart([]);
      setCaloriesConsumed(0);
      setIsStatusOpen(true);
      showToast("Đã gửi món thành công!", "success");
      showToast("Đã gửi món thành công!", "success");
    } catch (err) {
      showToast(
        `Gọi món thất bại: ${err?.message || "Vui lòng thử lại."}`,
        "error",
      );
    }
  };

  useEffect(() => {
    if (isStatusOpen) fetchOrderDetailsFromOrder();
  }, [isStatusOpen, orderId]);

  useEffect(() => {
    let timer;
    if (isStatusOpen) {
      fetchOrderDetailsFromOrder();
      timer = setInterval(fetchOrderDetailsFromOrder, 5000);
    }
    return () => clearInterval(timer);
  }, [isStatusOpen, orderId]);

  const groups = (() => {
    const g = {
      pending: [],
      preparing: [],
      served: [],
      cancelled: [],
      done: [],
    };
    for (const od of orderDetails) {
      const key = String(od.status || "").toLowerCase();
      if (g[key]) g[key].push(od);
    }
    return g;
  })();

  const handleGoalChange = (goalId) => {
    setPersonalizationForm((prev) => ({ ...prev, goal: goalId }));
    const base = baseCalories ?? estimatedCalories;
    setEstimatedCalories(applyGoal(base, goalId));
  };

  const handleOpenPayment = async () => {
    try {
      if (!orderId) throw new Error("Chưa có mã đơn (orderId).");
      if (cart.length) {
        await createOrderDetailsFromCart(orderId, cart);
      }
      const details = await getOrderDetailsByOrderId(orderId);
      setPaymentItems(details);
      setIsPaymentOpen(true);
      if (cart.length) {
        setCart([]);
        setCaloriesConsumed(0);
      }
    } catch (err) {
      showToast(
        err?.message || "Không mở được thanh toán. Vui lòng thử lại.",
        "error",
      );
    }
  };

  const handleDeleteDetail = async (detail) => {
    if (!detail?.orderDetailId) return;
    askConfirm({
      title: "Xoá món khỏi đơn?",
      message: `Bạn chắc muốn xoá “${detail.dishName || "món này"}”?`,
      onYes: async () => {
        try {
          await deleteOrderDetail(detail.orderDetailId);
          await fetchOrderDetailsFromOrder();
          showToast("Đã xoá món.", "success");
        } catch (e) {
          showToast(e?.message || "Xoá món thất bại.", "error");
        } finally {
          setConfirmState((s) => ({ ...s, open: false }));
        }
      },
    });
    askConfirm({
      title: "Xoá món khỏi đơn?",
      message: `Bạn chắc muốn xoá “${detail.dishName || "món này"}”?`,
      onYes: async () => {
        try {
          await deleteOrderDetail(detail.orderDetailId);
          await fetchOrderDetailsFromOrder();
          showToast("Đã xoá món.", "success");
        } catch (e) {
          showToast(e?.message || "Xoá món thất bại.", "error");
        } finally {
          setConfirmState((s) => ({ ...s, open: false }));
        }
      },
    });
  };

  const handleEdited = async () => {
    await fetchOrderDetailsFromOrder();
  };

  const sumTotal = (items = []) =>
    items.reduce((s, it) => s + Number(it.totalPrice ?? it.price ?? 0), 0);

  function notifyPaymentStaff({ tableId, orderId, total, paymentId }) {
    const payload = { tableId, orderId, total, paymentId, ts: Date.now() };
    window.dispatchEvent(
      new CustomEvent("table:callPayment", { detail: payload }),
    );
    localStorage.setItem(
      `signal:callPayment:${payload.ts}`,
      JSON.stringify(payload),
    );
  }

  function notifyCallStaff({ tableId, orderId }) {
    const payload = {
      type: "callStaff",
      tableId,
      tableNumber: tableId,
      orderId,
      ts: Date.now(),
    };

    try {
      const bc = new BroadcastChannel("monngon-signals");
      bc.postMessage(payload);
      bc.close?.();
    } catch {}

    localStorage.setItem(
      `signal:callStaff:${payload.ts}`,
      JSON.stringify(payload),
    );
  }

  const handleRequestPayment = async () => {
    try {
      if (!orderId) throw new Error("Chưa có orderId.");
      const total = sumTotal(paymentItems);
      const p = await createPayment({ orderId, method: "BANK_TRANSFER" });
      sessionStorage.setItem("paymentId", String(p.id || ""));
      notifyPaymentStaff({ tableId, orderId, total, paymentId: p.id });
      setIsPaymentOpen(false);
      setIsCallStaffOpen(true);
    } catch (error) {
      showToast(
        error?.message || "Không gửi được yêu cầu thanh toán.",
        "error",
      );
    }
  };

  async function fetchOrderDetailsFromOrder() {
    if (!orderId) return;
    try {
      const data = await getOrderDetailsByOrderId(orderId);
      setOrderDetails(data);
    } catch (err) {
      console.error("❌ Lỗi lấy orderDetails theo orderId:", err);
    }
  }

  const handleIncGroup = async (group) => {
    const st = String(group?.sample?.status || "").toLowerCase();
    if (st !== "pending") {
      showToast(
        "Món đã qua 'Chờ nấu' – thao tác này không khả dụng.",
        "warning",
      );
      return;
    }
    const it = group.sample;
    await createOrderDetail({
      orderId,
      dishId: it.dishId,
      note: it.note || "",
      toppings:
        it.toppings?.map((t) => ({
          toppingId: t.toppingId,
          quantity: t.quantity ?? 1,
        })) || [],
    });
    await fetchOrderDetailsFromOrder();
  };

  const handleDecGroup = async (group) => {
    const st = String(group?.sample?.status || "").toLowerCase();
    if (st !== "pending") {
      showToast(
        "Món đã qua 'Chờ nấu' – thao tác này không khả dụng.",
        "warning",
      );
      return;
    }
    const idToDelete = group.ids[group.ids.length - 1];
    await deleteOrderDetail(idToDelete);
    await fetchOrderDetailsFromOrder();
  };

  const handleOpenEdit = (detail) => {
    const st = String(detail?.status || "").toLowerCase();
    if (st !== "pending") return;
    setEditingDetail(detail);
    setIsEditOpen(true);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePersonalizationSubmit = async (form) => {
    try {
      if (!customerId) throw new Error("Thiếu customerId");
      const bmr =
        form.gender === "male"
          ? 10 * form.weight + 6.25 * form.height - 5 * form.age + 5
          : 10 * form.weight + 6.25 * form.height - 5 * form.age - 161;
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };
      const multiplier = activityMultipliers[form.exerciseLevel] || 1.55;
      const maintenanceCalories = bmr * multiplier;
      const dailyCalories = applyGoal(maintenanceCalories, form.goal);
      localStorage.setItem(
        PERSONAL_KEY(customerId),
        JSON.stringify({
          data: form,
          perWorkout: Math.ceil(maintenanceCalories),
          goalCalories: Math.ceil(dailyCalories),
          updatedAt: Date.now(),
        }),
      );
      await updateCustomerPersonalization(customerId, form);
      setBaseCalories(Math.ceil(maintenanceCalories));
      setEstimatedCalories(Math.ceil(dailyCalories));
      setIsPersonalized(true);

      showToast("Đã lưu và tính toán calo thành công!", "success");
      showToast("Đã lưu và tính toán calo thành công!", "success");
    } catch (err) {
      showToast("Cập nhật thất bại, vui lòng thử lại.", "error");
      showToast("Cập nhật thất bại, vui lòng thử lại.", "error");
    }
  };

  // ==== Logout after paid success ====
  function cleanupAndExit() {
    try {
      // dừng mọi timer trước khi rời trang
      pollStopRef.current = true;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      if (thanksTimerRef.current) {
        clearInterval(thanksTimerRef.current);
        thanksTimerRef.current = null;
      }

      sessionStorage.clear();
      const keysToRemove = [
        "user",
        "accessToken",
        "token",
        "hidden_dishes",
        `personalization:${customerId}`,
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      Object.keys(localStorage).forEach((k) => {
        if (
          k.startsWith("signal:callStaff:") ||
          k.startsWith("signal:callPayment:") ||
          k.startsWith("signal:paymentSuccess:")
        ) {
          try {
            localStorage.removeItem(k);
          } catch {}
        }
      });
    } catch {}
    window.location.replace("/home");
  }

  function handlePaidSuccess() {
    // >>> NEW: khóa không cho kích hoạt lại nếu đã mở
    if (paidLockedRef.current) return;
    paidLockedRef.current = true;

    // dừng polling ngay lập tức
    pollStopRef.current = true;
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    setPaidSuccessOpen(true);
    setCountdown(10);
  }

  // Countdown effect (được khóa bằng paidLockedRef + dừng poll)
  useEffect(() => {
    if (!paidSuccessOpen) return;
    // clear trước khi set để tránh nhân đôi trong StrictMode
    if (thanksTimerRef.current) {
      clearInterval(thanksTimerRef.current);
      thanksTimerRef.current = null;
    }
    thanksTimerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (thanksTimerRef.current) {
            clearInterval(thanksTimerRef.current);
            thanksTimerRef.current = null;
          }
          cleanupAndExit();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (thanksTimerRef.current) {
        clearInterval(thanksTimerRef.current);
        thanksTimerRef.current = null;
      }
    };
  }, [paidSuccessOpen]);

  // OPTIONAL: realtime signal (same-origin tabs)
  useEffect(() => {
    function onStorage(e) {
      if (!e?.key) return;
      if (e.key.startsWith("signal:paymentSuccess:")) {
        try {
          localStorage.removeItem(e.key);
        } catch {}
        handlePaidSuccess();
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Poll both payment(status) and order(status) — dừng hẳn khi success
  useEffect(() => {
    if (!orderId) return;
    pollStopRef.current = false;

    async function checkOnce() {
      if (pollStopRef.current) return;

      try {
        // 1) Payment status
        const pid = sessionStorage.getItem("paymentId");
        if (pid) {
          try {
            const pay = await getPaymentById(pid);
            const pst = String(pay?.status || "").toUpperCase();
            if (["COMPLETED", "PAID", "SUCCESS"].includes(pst)) {
              handlePaidSuccess();
              return; // không schedule nữa (đã khóa)
            }
          } catch {}
        }
        // 2) Order status (cover cash)
        try {
          const o = await getOrderById(orderId);
          const ost = String(o?.status || "").toUpperCase();
          if (["PAID", "COMPLETED", "CLOSED"].includes(ost)) {
            handlePaidSuccess();
            return;
          }
        } catch {}
      } finally {
        // chỉ lặp khi chưa dừng
        if (!pollStopRef.current) {
          pollTimerRef.current = setTimeout(checkOnce, 3000);
        }
      }
    }

    // kick off nhẹ sau 2s
    pollTimerRef.current = setTimeout(checkOnce, 2000);

    return () => {
      pollStopRef.current = true;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      <MenuHeader
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onPersonalize={() => setIsPersonalizationOpen(true)}
        onViewOrders={() => setIsCartOpen(true)}
        onCallStaff={() => {
          setIsCallStaffOpen(true);
          if (tableId) {
            notifyCallStaff({ tableId, orderId });
          }
        }}
        onCheckout={handleOpenPayment}
        onViewStatus={() => setIsStatusOpen(true)}
        tableId={tableId}
        customerId={customerId}
      />

      <OrderStatusSidebar
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        items={orderDetails}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteDetail}
        onIncGroup={handleIncGroup}
        onDecGroup={handleDecGroup}
      />

      {isEditOpen && editingDetail && (
        <EditOrderDetailModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          detail={editingDetail}
          onUpdated={handleEdited}
        />
      )}

      {orderId && tableId && customerId && (
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">Chào Mừng</span>
              <span className="text-blue-800 font-semibold">
                {customerName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-indigo-600 font-medium">Bàn</span>
              <span className="text-indigo-800 font-semibold">{tableId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600 font-medium">Mã Đơn</span>
              <span className="text-purple-800 font-semibold">{orderId}</span>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Xoá"
        cancelText="Huỷ"
        onConfirm={confirmState.onYes}
        onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Xoá"
        cancelText="Huỷ"
        onConfirm={confirmState.onYes}
        onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
      />

      <MenuContent
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        filteredDishes={filteredDishes}
        personalizedMenu={personalizedDishes}
        onDishSelect={async (dish) => {
          // 🚫 Chặn món có remainingQuantity = 0
          if (dish.remainingQuantity <= 0) {
            alert("❌ Món này hiện đã hết số lượng trong kế hoạch hôm nay.");
            return;
          }

          try {
            let fullDish = await getDish(dish.id);

            // ⚙️ Nếu BE đã trả optionalToppings (kể cả rỗng), KHÔNG gọi lại API
            if (!Array.isArray(fullDish.optionalToppings)) {
              try {
                const toppings = await getToppingsByDishId(dish.id);
                fullDish = { ...fullDish, optionalToppings: toppings || [] };
              } catch (e) {
                console.warn(
                  "⚠️ Không lấy được topping, đặt rỗng:",
                  e?.message,
                );
                fullDish = { ...fullDish, optionalToppings: [] };
              }
            }

            setSelectedDish(fullDish);
            setIsDishOptionsOpen(true);
          } catch (err) {
            console.error("Không lấy được chi tiết món:", err);
          }
        }}
        caloriesConsumed={caloriesConsumed}
        estimatedCalories={estimatedCalories}
        onGoalChange={handleGoalChange}
        isPersonalized={isPersonalized}
        currentGoal={personalizationForm.goal}
      />

      <MenuFooter />

      <PersonalizationModal
        isOpen={isPersonalizationOpen}
        onClose={() => setIsPersonalizationOpen(false)}
        personalizationForm={personalizationForm}
        setPersonalizationForm={setPersonalizationForm}
        onSubmit={handlePersonalizationSubmit}
        dailyCalories={dailyCalories}
        setDailyCalories={setDailyCalories}
        caloriesConsumed={caloriesConsumed}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onOrderFood={handleOrderFood}
      />

      <PaymentSidebar
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cart={cart}
        items={paymentItems}
        onRequestPayment={handleRequestPayment}
      />

      <DishOptionsModal
        isOpen={isDishOptionsOpen}
        onClose={() => setIsDishOptionsOpen(false)}
        dish={selectedDish}
        onAddToCart={addToCart}
      />

      {isCallStaffOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Thành công!
              </h3>
              <p className="text-neutral-600 mb-6">
                Nhân viên sẽ đến hỗ trợ bạn ngay! Cảm ơn bạn đã sử dụng dịch vụ.
              </p>
              <button
                onClick={() => setIsCallStaffOpen(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {paidSuccessOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Thanh toán thành công!
            </h3>
            <p className="text-neutral-600">
              Cảm ơn bạn đã đến dùng bữa tại nhà hàng.
            </p>
            <p className="text-neutral-600 mt-2">
              Hệ thống sẽ tự thoát trong <b>{countdown}s</b>…
            </p>
            <button
              onClick={cleanupAndExit}
              className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
            >
              Thoát ngay
            </button>
          </div>
        </div>
      )}

      <ToastHost />
    </div>
  );
}
