import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import MenuHeader from "../components/Menu/MenuHeader";
import MenuContent from "../components/Menu/MenuContent";
import MenuFooter from "../components/Menu/MenuFooter";
import PersonalizationModal from "../components/Menu/PersonalizationModal";
import CartSidebar from "../components/Menu/CartSidebar";
import PaymentSidebar from "../components/Menu/PaymentSidebar";
import DishOptionsModal from "../components/Menu/DishOptionsModal";
import OrderStatusSidebar from "../components/Menu/OrderStatusSidebar";
import { getSuggestedMenu } from "../lib/apiSuggestion";
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
import ConfirmDialog from "../common/ConfirmDialog";

// --- Hằng số và Hàm Helper ---
const PERSONAL_KEY = (cid) => `personalization:${cid}`;
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

// ====================================================================
// ✅ HÀM GIẢ LẬP API LẤY GỢI Ý MENU (CẦN THAY THẾ BẰNG API THẬT CỦA BẠN)
// ====================================================================
const getMenuSuggestions = async (payload) => {
  // Console log để kiểm tra payload gửi đi
  console.log("[API Call Mock] POST /suggestions/menu with payload:", payload);

  // Giả lập độ trễ mạng và phản hồi thành công
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockGoalType = payload.goal;
  // Giả lập cấu trúc response List<MenuSuggestion> từ BE
  return [
    {
      // Giả định cấu trúc DishResponse tương thích với FE
      drink: {
        dishId: 101,
        dishName: `Nước (for ${mockGoalType})`,
        calo: 50,
        price: 10000,
        remainingQuantity: 10,
        type: mockGoalType,
        categoryEnum: "DRINKS",
      },
      salad: {
        dishId: 201,
        dishName: `Salad (for ${mockGoalType})`,
        calo: 150,
        price: 40000,
        remainingQuantity: 5,
        type: mockGoalType,
        categoryEnum: "SALAD",
      },
      mainCourse: {
        dishId: 301,
        dishName: `Món chính (for ${mockGoalType})`,
        calo: 450,
        price: 100000,
        remainingQuantity: 15,
        type: mockGoalType,
        categoryEnum: "PIZZA",
      },
      dessert: {
        dishId: 401,
        dishName: `Tráng miệng (for ${mockGoalType})`,
        calo: 100,
        price: 30000,
        remainingQuantity: 8,
        type: mockGoalType,
        categoryEnum: "DESSERT",
      },
    },
  ];
};
// ====================================================================

// --- Component Chính ---
export default function Menu() {
  const [suggestedMenu, setSuggestedMenu] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [orderId, setOrderId] = useState(
    () => sessionStorage.getItem("orderId") || null,
  );

  // --- State Menu & Món ăn ---
  const [menuDishes, setMenuDishes] = useState([]);
  const [activeMenuTab, setActiveMenuTab] = useState("all");
  const [selectedDish, setSelectedDish] = useState(null);
  const [isDishOptionsOpen, setIsDishOptionsOpen] = useState(false);

  // --- State Cá nhân hóa (Personalization) ---
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [baseCalories, setBaseCalories] = useState(null);
  const [estimatedCalories, setEstimatedCalories] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);

  // --- State Giỏ hàng (Cart) ---
  const [cart, setCart] = useState([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- State Trạng thái Đơn hàng (Order Status) ---
  const [orderDetails, setOrderDetails] = useState([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);

  // --- State Thanh toán (Payment) ---
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentItems, setPaymentItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // --- State Thông báo & Modal ---
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

  // --- State Thoát sau thanh toán ---
  const [paidSuccessOpen, setPaidSuccessOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const paidLockedRef = useRef(false);
  const pollStopRef = useRef(false);
  const pollTimerRef = useRef(null);
  const thanksTimerRef = useRef(null);

  // === LOGIC CƠ SỞ (AUTH, BÀN, ĐƠN HÀNG) ===
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
  const initialMode = sessionStorage.getItem(MODE_KEY);
  const [mode, setMode] = useState(initialMode); // 'solo' hoặc 'group'
  const [showModeSelection, setShowModeSelection] = useState(!initialMode);

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
    (dish) => dish.isAvailable && !hiddenNames.includes(dish.name),
  );

  const handleDishSelect = async (dish) => {
    if (dish.remainingQuantity <= 0) {
      setErrorMessage("Món này hiện đã hết số lượng trong kế hoạch hôm nay.");
      setIsErrorOpen(true);
      return;
    }

    try {
      let fullDish = await getDish(dish.id);
      if (!Array.isArray(fullDish.optionalToppings)) {
        try {
          const toppings = await getToppingsByDishId(dish.id);
          fullDish = { ...fullDish, optionalToppings: toppings || [] };
        } catch (e) {
          fullDish = { ...fullDish, optionalToppings: [] };
        }
      }
      setSelectedDish(fullDish);
      setIsDishOptionsOpen(true);
    } catch (err) {
      setErrorMessage(err?.message || "Không thể lấy chi tiết món.");
      setIsErrorOpen(true);
    }
  };

  // === LOGIC GIỎ HÀNG (CartSidebar) ===
  const { personalizationForm, setPersonalizationForm, personalizedDishes } =
    useMenuPersonalization(filteredDishes);

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
      await createOrderDetailsFromCart(orderId, cart);
      setIsCartOpen(false);
      setCart([]);
      setCaloriesConsumed(0);
      setIsStatusOpen(true);
      setIsOrderFoodOpen(true);
    } catch (err) {
      setOrderFoodErrorMessage(
        err?.message || "Gọi món thất bại. Vui lòng thử lại.",
      );
      setIsOrderFoodErrorOpen(true);
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // === LOGIC TRẠNG THÁI ĐƠN HÀNG (OrderStatusSidebar) ===
  async function fetchOrderDetailsFromOrder() {
    if (!orderId) return;
    try {
      const data = await getOrderDetailsByOrderId(orderId);
      setOrderDetails(data);
    } catch (err) {}
  }

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
    setEditingDetail(detail);
    setIsEditOpen(true);
  };

  const handleEdited = async () => {
    await fetchOrderDetailsFromOrder();
  };

  // === LOGIC THANH TOÁN (PaymentSidebar) ===
  const handleOpenPayment = async () => {
    try {
      if (!orderId) throw new Error("Chưa có mã đơn (orderId).");
      if (cart.length > 0) {
        setIsNotServedErrorOpen(true);
        return;
      }
      const details = await getOrderDetailsByOrderId(orderId);
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
        err?.message || "Không mở được thanh toán. Vui lòng thử lại.",
      );
      setIsErrorOpen(true);
    }
  };

  const handleGoalChange = (goalId) => {
    setPersonalizationForm((prev) => ({ ...prev, goal: goalId }));
    const base = baseCalories ?? estimatedCalories;
    setEstimatedCalories(applyGoal(base, goalId));
  };

  // ====================================================================
  // ✅ LOGIC XỬ LÝ SUBMIT FORM CÁ NHÂN HÓA MỚI (LƯU HỒ SƠ & LẤY GỢI Ý)
  // ====================================================================
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

    try {
      // 0️⃣ Reset danh sách cũ (xóa các gợi ý cũ khỏi state)
      setSuggestedMenu([]); // 🧹 clear danh sách cũ trước khi gọi API mới

      // 1️⃣ GỌI API 1: Cập nhật hồ sơ khách hàng
      await updateCustomerPersonalization(customerId, customerUpdatePayload);

      // 2️⃣ GỌI API 2: Lấy gợi ý menu mới
      const suggestionsResponse = await getSuggestedMenu(
        suggestionCreationPayload,
      );

      // 3️⃣ Chuẩn hoá & copy dishId -> id
      const flatList = Array.isArray(suggestionsResponse)
        ? suggestionsResponse.flatMap((r) =>
            [r.drink, r.salad, r.mainCourse, r.dessert]
              .filter(Boolean)
              .map((dish) => ({
                ...dish,
                id: dish.dishId ?? dish.id,
                name: dish.dishName ?? dish.name,
              })),
          )
        : [];

      // 🔢 Giới hạn 12 món (nếu BE trả nhiều hơn)
      const limitedList = flatList.slice(0, 12);

      // ✅ Cập nhật state
      setSuggestedMenu(limitedList);
      setEstimatedCalories(dailyCalories);
      setIsPersonalized(true);

      setIsPersonalizationOpen(false);
      setSuccessMessage(
        "Cá nhân hóa thành công! Thực đơn gợi ý mới đã được tạo.",
      );
      setIsSuccessOpen(true);
    } catch (err) {
      console.error("❌ Lỗi cá nhân hóa:", err);
      setErrorMessage(
        err?.response?.data?.message ||
          "Lỗi khi cập nhật hồ sơ hoặc lấy thực đơn gợi ý.",
      );
      setIsErrorOpen(true);
    }
  };

  // ====================================================================

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
      setErrorMessage(error?.message || "Không gửi được yêu cầu thanh toán.");
      setIsErrorOpen(true);
    }
  };

  // === LOGIC GỌI NHÂN VIÊN & TÍN HIỆU (StaffSignal) ===
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

  // === LOGIC POLLING THANH TOÁN & THOÁT ===
  function cleanupAndExit() {
    try {
      pollStopRef.current = true;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      if (thanksTimerRef.current) clearInterval(thanksTimerRef.current);
      pollTimerRef.current = null;
      thanksTimerRef.current = null;
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
        if (k.startsWith("signal:")) {
          try {
            localStorage.removeItem(k);
          } catch {}
        }
      });
    } catch {}
    window.location.replace("/home");
  }

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

  if (showModeSelection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-neutral-900">
            Chào mừng bạn đến với nhà hàng!
          </h2>
          <p className="text-neutral-600 mb-6">
            Vui lòng chọn cách bạn dùng bữa hôm nay:
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                sessionStorage.setItem(MODE_KEY, "group"); // <-- LƯU TRẠNG THÁI
                setMode("group");
                setShowModeSelection(false);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold hover:from-amber-500 hover:to-orange-600 transition"
            >
              🍽️ Tôi đi nhóm
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem(MODE_KEY, "solo"); // <-- LƯU TRẠNG THÁI
                setMode("solo");
                setShowModeSelection(false);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold hover:from-emerald-500 hover:to-green-600 transition"
            >
              🧍‍♂️ Tôi đi một mình
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      <MenuHeader
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onPersonalize={() => {
          if (mode === "group") return; // 🚫 không mở nếu đi nhóm
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
      />

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
      <MenuContent
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        filteredDishes={filteredDishes}
        dishSuggests={suggestedMenu}
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

      {isOrderFoodOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Đã gửi món thành công!
              </h3>
              <p className="text-neutral-600 mb-6">
                Món ăn của bạn đang được chuẩn bị. Vui lòng theo dõi trong tab
                "Trạng thái đơn".
              </p>
              <button
                onClick={() => setIsOrderFoodOpen(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteSuccessOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Xoá món thành công!
              </h3>
              <p className="text-neutral-600 mb-6">
                Món ăn đã được xoá (hoặc gửi yêu cầu huỷ) khỏi đơn hàng của bạn.
              </p>
              <button
                onClick={() => setIsDeleteSuccessOpen(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {isOrderFoodErrorOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Gọi món thất bại!
              </h3>
              <p className="text-neutral-600 mb-6">{orderFoodErrorMessage}</p>
              <button
                onClick={() => setIsOrderFoodErrorOpen(false)}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-medium"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {isNotServedErrorOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Không thể thanh toán!
              </h3>
              <p className="text-neutral-600 mb-6">
                Vẫn còn món ăn chưa được phục vụ. Vui lòng kiểm tra lại trạng
                thái đơn hàng.
              </p>
              <button
                onClick={() => setIsNotServedErrorOpen(false)}
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
              className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
            >
              Thoát ngay
            </button>
          </div>
        </div>
      )}

      {isSuccessOpen && (
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
                {successMessage || "Thao tác đã được thực hiện."}
              </p>
              <button
                onClick={() => setIsSuccessOpen(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {isErrorOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-neutral-600 mb-6">
                {errorMessage || "Thao tác thất bại. Vui lòng thử lại."}
              </p>
              <button
                onClick={() => setIsErrorOpen(false)}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-medium"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
