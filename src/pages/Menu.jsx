import { useState, useEffect, useRef, useMemo } from "react";
import { CheckCircle, AlertTriangle, User, Table, Hash } from "lucide-react";
import MenuHeader from "../components/Menu/MenuHeader";
import MenuContent from "../components/Menu/MenuContent";
import MenuFooter from "../components/Menu/MenuFooter";
import PersonalizationModal from "../components/Menu/PersonalizationModal";
import CartSidebar from "../components/Menu/CartSidebar";
import PaymentSidebar from "../components/Menu/PaymentSidebar";
import DishOptionsModal from "../components/Menu/DishOptionsModal";
import OrderStatusSidebar from "../components/Menu/OrderStatusSidebar";
import { getSuggestedMenu } from "../lib/apiSuggestion";
import AIChatBubble from "../components/Menu/AIChatBubble";
import {
  createOrder,
  getOrderById,
  getOrderDetailsByOrderId,
} from "../lib/apiOrder";
import { useMenuPersonalization } from "../hooks";
import { listDish, getDish, normalizeDish } from "../lib/apiDish";
import { updateCustomerPersonalization } from "../lib/apiCustomer";
import { getToppingsByDishId } from "../lib/apiDishTopping";
import {
  createOrderDetailsFromCart,
  deleteOrderDetail,
  createOrderDetail,
} from "../lib/apiOrderDetail";
import EditOrderDetailModal from "../components/Menu/EditOrderDetailModal";
import { createPayment, getPaymentById } from "../lib/apiPayment";
import ConfirmDialog from "../common/ConfirmDialog";
import usePersistedState from "../hooks/usePersistedState";

const MODE_KEY = "menuMode";
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
const sumTotal = (items = []) =>
  items.reduce((s, it) => s + Number(it.totalPrice ?? it.price ?? 0), 0);

const getCaloriesFromDetail = (detail) => {
  if (!detail) return 0;

  const baseCals = detail.calories || detail.calo || 0;

  const toppingCals = (detail.toppings || []).reduce((sum, topping) => {
    const toppingCal = topping.calories || topping.calo || 0;
    const quantity = topping.quantity || 1;
    return sum + toppingCal * quantity;
  }, 0);

  return baseCals + toppingCals;
};

export default function Menu() {
  const [suggestedMenu, setSuggestedMenu] = useState(() => {
    try {
      const saved = localStorage.getItem("suggestedMenu");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    try {
      if (Array.isArray(suggestedMenu) && suggestedMenu.length > 0) {
        localStorage.setItem("suggestedMenu", JSON.stringify(suggestedMenu));
      }
    } catch (e) {
      console.error("Không thể lưu suggestedMenu:", e);
    }
  }, [suggestedMenu]);

  const [tableId, setTableId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderId, setOrderId] = usePersistedState("currentOrderId", null);
  const [menuDishes, setMenuDishes] = useState([]);
  const [activeMenuTab, setActiveMenuTab] = useState("all");
  const [selectedDish, setSelectedDish] = useState(null);
  const [isDishOptionsOpen, setIsDishOptionsOpen] = useState(false);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isPersonalized, setIsPersonalized] = usePersistedState(
    "isPersonalized",
    false
  );
  const [estimatedCalories, setEstimatedCalories] = usePersistedState(
    "estimatedCalories",
    null
  );

  const [baseCalories, setBaseCalories] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  //===== Đưa món ăn chọn vào giỏ hàng =====
  const [cart, setCart] = usePersistedState("shoppingCart", []);
  //===== Đưa món ăn vào giỏ hàng rồi cộng calo vào thanh calo luôn =====
  const [caloriesConsumed, setCaloriesConsumed] = usePersistedState(
    "caloriesConsumed",
    0
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [editingDetailCalories, setEditingDetailCalories] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentItems, setPaymentItems] = useState([]);
  const [isCallStaffOpen, setIsCallStaffOpen] = useState(false);
  const [isOrderFoodOpen, setIsOrderFoodOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isNotServedErrorOpen, setIsNotServedErrorOpen] = useState(false);
  const [isOrderFoodErrorOpen, setIsOrderFoodErrorOpen] = useState(false);
  const [orderFoodErrorMessage, setOrderFoodErrorMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onYes: null,
  });
  const askConfirm = ({ title, message, onYes }) =>
    setConfirmState({ open: true, title, message, onYes });
  const [paidSuccessOpen, setPaidSuccessOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const paidLockedRef = useRef(false);
  const pollStopRef = useRef(false);
  const pollTimerRef = useRef(null);
  const thanksTimerRef = useRef(null);
  useEffect(() => {
    const storedTableId = sessionStorage.getItem("customerTableId");
    if (storedTableId) setTableId(storedTableId);
    const user = readAuthUser();
    setIsLoggedIn(!!user);
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
  const initialMode = sessionStorage.getItem(MODE_KEY);
  const [mode, setMode] = useState(initialMode);
  const [showModeSelection, setShowModeSelection] = useState(!initialMode);

  //===== Hàm xử lý orderId đảm bảo có =====
  useEffect(() => {
    const ready = Boolean(customerId) && Boolean(tableId);
    if (!ready) return;
    if (orderId) {
      return;
    }
    const idemKey = `orderInit_${customerId}_${tableId}`;
    if (sessionStorage.getItem(idemKey) === "1") return;
    sessionStorage.setItem(idemKey, "1");
    (async () => {
      try {
        //===== Gọi hàm tạo ra order tổng cho đơn hàng =====
        const order = await createOrder({ customerId, tableId });
        if (order?.orderId) {
          setOrderId(String(order.orderId));
        }
      } catch (err) {
        sessionStorage.removeItem(idemKey);
      }
    })();
  }, [customerId, tableId, orderId, setOrderId]);
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
        setMenuDishes(data);
        const normalized = data.map((d) => ({
          ...d,
          isInDailyPlan: Boolean(d.isInDailyPlan),
          name: d.name ?? d.dishName,
          calo: d.calo ?? d.calories ?? 0,
        }));
        setMenuDishes(normalized);
      } catch (err) {
        setErrorMessage("Không thể tải thực đơn: " + err.message);
        setIsErrorOpen(true);
      }
    })();
  }, []);
  const filteredDishes = menuDishes.filter(
    (dish) => dish.isAvailable && !hiddenNames.includes(dish.name)
  );
  const { personalizationForm, setPersonalizationForm, personalizedDishes } =
    useMenuPersonalization(filteredDishes);
  const addToCart = (item) => {
    const noteKey = item.notes || "";
    const existingItem = cart.find(
      (it) => it.id === item.id && (it.notes || "") === noteKey
    );
    if (existingItem) {
      setCart((prev) =>
        prev.map((it) =>
          it.id === item.id && (it.notes || "") === noteKey
            ? { ...it, quantity: it.quantity + (item.quantity ?? 1) }
            : it
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item }]);
    }
    setCaloriesConsumed(
      (prev) => prev + (item.totalCalories || item.calories || 0)
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
          it.id === itemId ? { ...it, quantity: newQuantity } : it
        )
      );
      setCaloriesConsumed(
        (prev) => prev + diff * (item.totalCalories || item.calories)
      );
    }
  };
  const removeFromCart = (itemId) => {
    const item = cart.find((it) => it.id === itemId);
    if (item) {
      setCart((prev) => prev.filter((it) => it.id !== itemId));
      setCaloriesConsumed(
        (prev) => prev - (item.totalCalories || item.calories) * item.quantity
      );
    }
  };

  //===== Hàm xử lý khi ấn Gọi Món =====
  const handleOrderFood = async () => {
    try {
      if (!orderId) throw new Error("Chưa có mã đơn (orderId).");
      if (!cart.length) throw new Error("Giỏ hàng đang trống.");
      //===== Gọi hàm để tạo ra OrderDetail =====
      await createOrderDetailsFromCart(orderId, cart);
      setIsCartOpen(false);
      setCart([]);
      setIsStatusOpen(true);
      setIsOrderFoodOpen(true);
    } catch (err) {
      setOrderFoodErrorMessage(
        err?.message || "Gọi món thất bại. Vui lòng thử lại."
      );
      setIsOrderFoodErrorOpen(true);
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  //===== Hàm lấy ra tất cả các món ứng theo từng Status =====
  async function fetchOrderDetailsFromOrder() {
    if (!orderId) return;
    try {
      const data = await getOrderDetailsByOrderId(orderId);
      setOrderDetails(data);
    } catch (err) {}
  }

  //===== Hàm lấy ra trạng thái món ứng theo món khách gọi =====
  useEffect(() => {
    if (isStatusOpen) fetchOrderDetailsFromOrder();
  }, [isStatusOpen, orderId]);

  //===== Hàm laasty ra trạng thái món theo mỗi 5 giây =====
  useEffect(() => {
    let timer;
    if (isStatusOpen) {
      fetchOrderDetailsFromOrder();
      timer = setInterval(fetchOrderDetailsFromOrder, 5000);
    }
    return () => clearInterval(timer);
  }, [isStatusOpen, orderId]);

  const { pendingCount, preparingCount } = useMemo(() => {
    let pending = 0;
    let preparing = 0;
    const groups = new Map();
    for (const item of orderDetails) {
      const key = `${item.dishId}|${item.note}|${(item.toppings || [])
        .map((t) => t.toppingId)
        .join(",")}`;
      if (!groups.has(key)) {
        groups.set(key, { status: String(item.status || "").toUpperCase() });
      }
    }
    for (const [key, group] of groups.entries()) {
      if (group.status === "PENDING") pending++;
      if (group.status === "PREPARING") preparing++;
    }
    return { pendingCount: pending, preparingCount: preparing };
  }, [orderDetails]);

  const handleIncGroup = async (group) => {
    const st = String(group?.sample?.status || "").toLowerCase();
    if (st !== "pending") {
      setErrorMessage("Món đã qua 'Chờ nấu' – thao tác này không khả dụng.");
      setIsErrorOpen(true);
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

    const itemCalories = getCaloriesFromDetail(group.sample);
    setCaloriesConsumed((prev) => prev + itemCalories);
    await fetchOrderDetailsFromOrder();
  };
  const handleDecGroup = async (group) => {
    const st = String(group?.sample?.status || "").toLowerCase();
    const dishName = group.sample.dishName || "Món này";
    const idToDelete = group.ids[group.ids.length - 1];
    if (st === "preparing") {
      askConfirm({
        title: "Xác nhận huỷ món?",
        message: `Món "${dishName}" đang được nấu. Bạn có chắc chắn muốn yêu cầu huỷ món này không?`,
        onYes: async () => {
          try {
            await deleteOrderDetail(idToDelete);
            await fetchOrderDetailsFromOrder();
            setIsDeleteSuccessOpen(true);
            const itemCalories = getCaloriesFromDetail(group.sample);
            setCaloriesConsumed((prev) => Math.max(0, prev - itemCalories));
          } catch (e) {
            setErrorMessage(e?.message || "Huỷ món thất bại.");
            setIsErrorOpen(true);
          } finally {
            setConfirmState((s) => ({ ...s, open: false }));
          }
        },
      });
    } else if (st === "pending") {
      try {
        await deleteOrderDetail(idToDelete);
        await fetchOrderDetailsFromOrder();
        setIsDeleteSuccessOpen(true);
        const itemCalories = getCaloriesFromDetail(group.sample);
        setCaloriesConsumed((prev) => Math.max(0, prev - itemCalories));
      } catch (e) {
        setErrorMessage(e?.message || "Xoá món thất bại.");
        setIsErrorOpen(true);
      }
    } else {
      setErrorMessage("Không thể xoá món đã hoàn thành hoặc đã phục vụ.");
      setIsErrorOpen(true);
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
          setIsDeleteSuccessOpen(true);
          const itemCalories = getCaloriesFromDetail(detail);
          setCaloriesConsumed((prev) => Math.max(0, prev - itemCalories));
        } catch (e) {
          setErrorMessage(e?.message || "Xoá món thất bại.");
          setIsErrorOpen(true);
        } finally {
          setConfirmState((s) => ({ ...s, open: false }));
        }
      },
    });
  };

  const handleOpenEdit = (detail) => {
    const st = String(detail?.status || "").toLowerCase();
    if (st !== "pending") return;
    const oldCalories = getCaloriesFromDetail(detail);
    setEditingDetailCalories(oldCalories);
    setEditingDetail(detail);
    setIsEditOpen(true);
  };

  const handleEdited = async () => {
    if (!orderId || !editingDetail) return;

    try {
      const newData = await getOrderDetailsByOrderId(orderId);

      useEffect(() => {
        const updateAuthState = () => {
          const user = readAuthUser();
          const loggedIn = !!user;
          setIsLoggedIn(loggedIn);

          const cid = user?.customerId ?? user?.id;
          if (cid) {
            setCustomerId(String(cid));
            sessionStorage.setItem("customerId", String(cid));
          }

          const name = getDisplayName(user);
          if (name) setCustomerName(name);
        };

        updateAuthState();
        const interval = setInterval(updateAuthState, 1000);
        window.addEventListener("auth:changed", updateAuthState);
        window.addEventListener("storage", updateAuthState);

        return () => {
          clearInterval(interval);
          window.removeEventListener("auth:changed", updateAuthState);
          window.removeEventListener("storage", updateAuthState);
        };
      }, []);
      const editedItem = newData.find(
        (item) => item.orderDetailId === editingDetail.orderDetailId
      );
      const newCalories = getCaloriesFromDetail(editedItem);
      const oldCalories = editingDetailCalories;
      const diff = newCalories - oldCalories;
      setCaloriesConsumed((prev) => Math.max(0, prev + diff));
      setOrderDetails(newData);
      setEditingDetailCalories(0);
      setEditingDetail(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật chi tiết món:", err);
      await fetchOrderDetailsFromOrder();
    }
  };

  //===== Hàm xử lý khi KH mở tab Thanh Toán =====
  const handleOpenPayment = async () => {
    try {
      if (!orderId) throw new Error("Chưa có mã đơn (orderId).");
      if (cart.length > 0) {
        setIsNotServedErrorOpen(true);
        return;
      }
      //===== Gọi hàm để lấy các món ứng với trạng thái =====
      const details = await getOrderDetailsByOrderId(orderId);
      //===== Chỉ khi các món là Served thì mới được mở lên tab Thanh Toán =====
      const notServedItem = details.find((d) => d.status !== "SERVED");
      if (notServedItem) {
        setIsNotServedErrorOpen(true);
        return;
      }
      setPaymentItems(details);
      setIsPaymentOpen(true);
      if (cart.length) {
        setCart([]);
        setCaloriesConsumed(0);
      }
    } catch (err) {
      setErrorMessage(
        err?.message || "Không mở được thanh toán. Vui lòng thử lại."
      );
      setIsErrorOpen(true);
    }
  };
  const handleGoalChange = (goalId) => {
    setPersonalizationForm((prev) => ({ ...prev, goal: goalId }));
    const base = baseCalories ?? estimatedCalories;
    setEstimatedCalories(applyGoal(base, goalId));
  };

  const handlePersonalizationSubmit = async ({
    customerUpdatePayload,
    suggestionCreationPayload,
    dailyCalories,
  }) => {
    if (!customerId) {
      setErrorMessage("Không tìm thấy ID khách hàng. Vui lòng đăng nhập.");
      setIsErrorOpen(true);
      return;
    }

    if (!suggestionCreationPayload.goal) {
      setErrorMessage("Vui lòng chọn 'Mục tiêu cá nhân' của bạn.");
      setIsErrorOpen(true);
      return;
    }

    try {
      setSuggestedMenu([]);
      await updateCustomerPersonalization(customerId, customerUpdatePayload);
      const suggestionsResponse = await getSuggestedMenu(
        suggestionCreationPayload
      );

      const flatList = Array.isArray(suggestionsResponse)
        ? suggestionsResponse.flatMap((r) =>
            [r.drink, r.salad, r.mainCourse, r.dessert]
              .filter(Boolean)
              .map((dish) => normalizeDish(dish))
          )
        : [];

      const limitedList = flatList.slice(0, 12);
      setSuggestedMenu(limitedList);

      setEstimatedCalories(dailyCalories);
      setIsPersonalized(true);
      setIsPersonalizationOpen(false);
      setActiveMenuTab("suggested");
      setSuccessMessage(
        "Cá nhân hóa thành công! Thực đơn gợi ý mới đã được tạo."
      );
      setIsSuccessOpen(true);
    } catch (err) {
      console.error("❌ Lỗi cá nhân hóa:", err);
      setErrorMessage(
        err?.response?.data?.message ||
          "Lỗi khi cập nhật hồ sơ hoặc lấy thực đơn gợi ý."
      );
      setIsErrorOpen(true);
    }
  };

  //===== Hàm xử lý khi KH ấn vào Gọi nhân viên thanh toán =====
  const handleRequestPayment = async () => {
    try {
      if (!orderId) throw new Error("Chưa có orderId.");
      const total = sumTotal(paymentItems);
      //===== Gọi hàm để tạo ra paymentId để tiến hành thanh toán =====
      const p = await createPayment({ orderId, method: "BANK_TRANSFER" });
      sessionStorage.setItem("paymentId", String(p.id || ""));
      //===== Gửi yêu cầu đến giao diện bàn của Staff =====
      //===== Khi gửi kèm theo số bàn, số đơn, tổng tiền và paymentId đã tạo ở trên =====
      notifyPaymentStaff({ tableId, orderId, total, paymentId: p.id });
      setIsPaymentOpen(false);
      setIsCallStaffOpen(true);
    } catch (error) {
      setErrorMessage(error?.message || "Không gửi được yêu cầu thanh toán.");
      setIsErrorOpen(true);
    }
  };

  //===== Hàm xử lý khi gửi thông báo thanh toán đến giao diện bàn của Staff =====
  function notifyPaymentStaff({ tableId, orderId, total, paymentId }) {
    const payload = { tableId, orderId, total, paymentId, ts: Date.now() };
    //===== Gửi một sự kiện trong nội bộ tab trình duyệt =====
    window.dispatchEvent(
      new CustomEvent("table:callPayment", { detail: payload })
    );
    //===== Ghi 1 key vào localStorage và sẽ lắng nghe sự thay đổi này ở các tab của Staff =====
    localStorage.setItem(
      `signal:callPayment:${payload.ts}`,
      JSON.stringify(payload)
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
      JSON.stringify(payload)
    );
  }

  function cleanupAndExit() {
    try {
      pollStopRef.current = true;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      if (thanksTimerRef.current) clearInterval(thanksTimerRef.current);
      setCart([]);
      setOrderId(null);
      setCaloriesConsumed(0);
      setSuggestedMenu([]);
      localStorage.removeItem("suggestedMenu");
      localStorage.removeItem(`personalization:${customerId}`);
      localStorage.removeItem("isPersonalized");
      localStorage.removeItem("estimatedCalories");
      sessionStorage.clear();
      const keysToRemove = ["user", "accessToken", "token", "hidden_dishes"];
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("signal:")) {
          try {
            localStorage.removeItem(k);
          } catch {}
        }
      });
    } catch {}
    window.location.replace("/home");
  }

  //===== Hàm bên Menu.jsx khi KH đã Thanh Toán xong =====
  function handlePaidSuccess() {
    if (paidLockedRef.current) return;
    paidLockedRef.current = true;
    pollStopRef.current = true;
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    pollTimerRef.current = null;
    setPaidSuccessOpen(true);
    setCountdown(10);
  }
  useEffect(() => {
    function onStorage(e) {
      if (e.key?.startsWith("signal:paymentSuccess:")) {
        try {
          localStorage.removeItem(e.key);
        } catch {}
        handlePaidSuccess();
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    if (!paidSuccessOpen) return;
    if (thanksTimerRef.current) clearInterval(thanksTimerRef.current);
    thanksTimerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (thanksTimerRef.current) clearInterval(thanksTimerRef.current);
          thanksTimerRef.current = null;
          cleanupAndExit();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (thanksTimerRef.current) clearInterval(thanksTimerRef.current);
      thanksTimerRef.current = null;
    };
  }, [paidSuccessOpen]);

  useEffect(() => {
    if (!orderId) return;
    pollStopRef.current = false;
    async function checkOnce() {
      if (pollStopRef.current) return;
      try {
        const pid = sessionStorage.getItem("paymentId");
        if (pid) {
          try {
            const pay = await getPaymentById(pid);
            const pst = String(pay?.status || "").toUpperCase();
            if (["COMPLETED", "PAID", "SUCCESS"].includes(pst)) {
              handlePaidSuccess();
              return;
            }
          } catch {}
        }
        try {
          const o = await getOrderById(orderId);
          const ost = String(o?.status || "").toUpperCase();
          if (["PAID", "COMPLETED", "CLOSED"].includes(ost)) {
            handlePaidSuccess();
            return;
          }
        } catch {}
      } finally {
        if (!pollStopRef.current) {
          pollTimerRef.current = setTimeout(checkOnce, 3000);
        }
      }
    }
    pollTimerRef.current = setTimeout(checkOnce, 2000);
    return () => {
      pollStopRef.current = true;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    };
  }, [orderId]);

  useEffect(() => {
    if (mode === "solo" && customerId && !suggestedMenu) {
      setIsPersonalizationOpen(true);
    }
  }, [mode, customerId]);

  useEffect(() => {
    const syncAuth = () => {
      const u = readAuthUser();
      setIsLoggedIn(!!u);
    };

    syncAuth();
    window.addEventListener("auth:changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth:changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      {showModeSelection && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full relative z-10 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4 text-neutral-900">
              Chào mừng bạn đến với nhà hàng!
            </h2>
            <p className="text-neutral-600 mb-6">
              Vui lòng chọn cách bạn dùng bữa hôm nay:
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  sessionStorage.setItem(MODE_KEY, "group");
                  setMode("group");
                  setShowModeSelection(false);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold hover:from-amber-500 hover:to-orange-600 transition transform hover:scale-105"
              >
                Tôi đi nhóm
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem(MODE_KEY, "solo");
                  setMode("solo");
                  setShowModeSelection(false);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold hover:from-emerald-500 hover:to-green-600 transition transform hover:scale-105"
              >
                Tôi đi một mình
              </button>
            </div>
          </div>
        </div>
      )}

      <MenuHeader
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onPersonalize={() => {
          if (mode === "group") return;
          setIsPersonalizationOpen(true);
        }}
        onViewOrders={() => setIsCartOpen(true)}
        onCallStaff={() => {
          setIsCallStaffOpen(true);
          if (tableId) notifyCallStaff({ tableId, orderId });
        }}
        onCheckout={handleOpenPayment}
        onViewStatus={() => setIsStatusOpen(true)}
        tableId={tableId}
        customerId={customerId}
        showPersonalizeButton={mode === "solo"}
        pendingCount={pendingCount}
        preparingCount={preparingCount}
      />

      {orderId && tableId && customerId && (
        <div className="bg-white shadow-md border-b border-neutral-200/80 animate-fade-in-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Chào mừng</div>
                  <div className="text-lg font-bold text-neutral-900">
                    {customerName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-4 py-2">
                  <Table className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-neutral-700">
                    Bàn:
                  </span>
                  <span className="text-sm font-bold text-blue-800">
                    {tableId}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-4 py-2">
                  <Hash className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-neutral-700">
                    Mã Đơn:
                  </span>
                  <span className="text-sm font-bold text-purple-800">
                    #{orderId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <MenuContent
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        filteredDishes={filteredDishes}
        dishSuggests={suggestedMenu}
        personalizedMenu={personalizedDishes}
        onDishSelect={async (dish) => {
          if (dish.remainingQuantity <= 0) {
            alert("❌ Món này hiện đã hết số lượng trong kế hoạch hôm nay.");
            return;
          }
          try {
            let fullDish = await getDish(dish.id);
            if (!Array.isArray(fullDish.optionalToppings)) {
              try {
                const toppings = await getToppingsByDishId(dish.id);
                fullDish = { ...fullDish, optionalToppings: toppings || [] };
              } catch (e) {
                console.warn(
                  "⚠️ Không lấy được topping, đặt rỗng:",
                  e?.message
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
        caloriesConsumed={mode === "solo" ? caloriesConsumed : null}
        estimatedCalories={mode === "solo" ? estimatedCalories : null}
        onGoalChange={handleGoalChange}
        isPersonalized={mode === "solo" && isPersonalized}
        currentGoal={mode === "solo" ? personalizationForm.goal : null}
      />
      <MenuFooter />
      {mode === "solo" && (
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
      )}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        cartItemCount={cartItemCount}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onOrderFood={handleOrderFood}
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
      <PaymentSidebar
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cart={cart}
        items={paymentItems}
        onRequestPayment={handleRequestPayment}
      />
      {isEditOpen && editingDetail && (
        <EditOrderDetailModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          detail={editingDetail}
          onUpdated={handleEdited}
        />
      )}
      <DishOptionsModal
        isOpen={isDishOptionsOpen}
        onClose={() => setIsDishOptionsOpen(false)}
        dish={selectedDish}
        onAddToCart={addToCart}
      />
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Xác nhận"
        cancelText="Huỷ"
        onConfirm={confirmState.onYes}
        onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
      />

      <AIChatBubble customerId={customerId} isLoggedIn={isLoggedIn} />

      {(isSuccessOpen ||
        isCallStaffOpen ||
        isOrderFoodOpen ||
        isDeleteSuccessOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {isCallStaffOpen
                  ? "Đã gửi yêu cầu!"
                  : isOrderFoodOpen
                  ? "Đã gửi món thành công!"
                  : isDeleteSuccessOpen
                  ? "Xoá món thành công!"
                  : successMessage
                  ? "Thành công!"
                  : "Thành công!"}
              </h3>
              <p className="text-neutral-600 mb-6">
                {isCallStaffOpen
                  ? "Nhân viên sẽ đến hỗ trợ bạn ngay!"
                  : isOrderFoodOpen
                  ? "Món ăn của bạn đang được chuẩn bị. Vui lòng theo dõi trong 'Trạng thái đơn'."
                  : isDeleteSuccessOpen
                  ? "Món ăn đã được xoá (hoặc gửi yêu cầu huỷ) khỏi đơn hàng."
                  : successMessage
                  ? successMessage
                  : "Thao tác đã được thực hiện."}
              </p>
              <button
                onClick={() => {
                  setIsCallStaffOpen(false);
                  setIsOrderFoodOpen(false);
                  setIsDeleteSuccessOpen(false);
                  setIsSuccessOpen(false);
                  setSuccessMessage("");
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {(isErrorOpen || isNotServedErrorOpen || isOrderFoodErrorOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {isNotServedErrorOpen
                  ? "Không thể thanh toán!"
                  : isOrderFoodErrorOpen
                  ? "Gọi món thất bại!"
                  : "Đã xảy ra lỗi"}
              </h3>
              <p className="text-neutral-600 mb-6">
                {isNotServedErrorOpen
                  ? "Vẫn còn món ăn chưa được phục vụ. Vui lòng kiểm tra lại trạng thái đơn hàng."
                  : isOrderFoodErrorOpen
                  ? orderFoodErrorMessage
                  : errorMessage
                  ? errorMessage
                  : "Thao tác thất bại. Vui lòng thử lại."}
              </p>
              <button
                onClick={() => {
                  setIsErrorOpen(false);
                  setErrorMessage("");
                  setIsNotServedErrorOpen(false);
                  setIsOrderFoodErrorOpen(false);
                  setOrderFoodErrorMessage("");
                }}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-medium"
              >
                Đã hiểu
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
              className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium"
            >
              Thoát ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
