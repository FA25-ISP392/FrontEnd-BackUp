import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

import MenuHeader from "../components/Menu/MenuHeader";
import MenuContent from "../components/Menu/MenuContent";
import MenuFooter from "../components/Menu/MenuFooter";
import PersonalizationModal from "../components/Menu/PersonalizationModal";
import CartSidebar from "../components/Menu/CartSidebar";
import PaymentSidebar from "../components/Menu/PaymentSidebar";
import DishOptionsModal from "../components/Menu/DishOptionsModal";
import OrderStatusSidebar from "../components/Menu/OrderStatusSidebar";

import { createOrder } from "../lib/apiOrder";
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
} from "../lib/apiOrderDetail";
import { getOrderDetailsByOrderId } from "../lib/apiOrder";
import EditOrderDetailModal from "../components/Menu/EditOrderDetailModal";

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
    () => sessionStorage.getItem("orderId") || null
  );

  const [baseCalories, setBaseCalories] = useState(null);
  const [estimatedCalories, setEstimatedCalories] = useState(null);

  const [menuDishes, setMenuDishes] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  const [paymentItems, setPaymentItems] = useState([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);

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
        setMenuDishes(data);
      } catch (err) {
        console.error("❌ Lỗi khi load món ăn:", err);
      }
    })();
  }, []);

  const filteredDishes = menuDishes.filter(
    (dish) => dish.isAvailable && !hiddenNames.includes(dish.name)
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
          setPersonalizationForm((prev) => ({ ...prev, ...data }));

          if (typeof cached.perWorkout === "number") {
            setBaseCalories(cached.perWorkout);
            setEstimatedCalories(applyGoal(cached.perWorkout, data.goal));
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
          JSON.stringify({ data: toForm, updatedAt: Date.now() })
        );
      } catch (e) {
        console.warn("Không lấy được personalization từ BE:", e?.message || e);
      }
    })();
  }, [customerId]);

  const addToCart = (dish, notes = "") => {
    const existingItem = cart.find(
      (item) => item.id === dish.id && item.notes === notes
    );
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === dish.id && item.notes === notes
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...dish, quantity: 1, notes }]);
    }
    setCaloriesConsumed((prev) => prev + (dish.totalCalories || dish.calories));
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

  const handleOrderFood = async () => {
    try {
      if (!orderId) throw new Error("Chưa có mã đơn (orderId).");
      if (!cart.length) throw new Error("Giỏ hàng đang trống.");

      const saved = await createOrderDetailsFromCart(orderId, cart);
      console.log("✅ Đã lưu order-details:", saved);

      setIsCartOpen(false);
      setCart([]);
      setCaloriesConsumed(0);

      setIsStatusOpen(true);
      alert("Đã gửi món thành công!");
    } catch (err) {
      console.error("❌ Gửi món thất bại:", err);
      alert(`Gọi món thất bại: ${err?.message || "Vui lòng thử lại."}`);
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
    const g = { pending: [], preparing: [], served: [], cancelled: [] };
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

  const groupPaymentItems = (details = []) => {
    const map = new Map();
    details.forEach((d) => {
      const name = d.dishName ?? d.name;
      const unit = Number(d.totalPrice ?? d.price ?? 0);
      const key = `${name}|${unit}`;
      const cur = map.get(key) || {
        id: key,
        name,
        price: unit,
        quantity: 0,
        totalPrice: 0,
      };
      cur.quantity += 1;
      cur.totalPrice = cur.price * cur.quantity;
      map.set(key, cur);
    });
    return [...map.values()];
  };

  const handleOpenPayment = async () => {
    try {
      if (!orderId) throw new Error("Chưa có mã đơn (orderId).");
      if (cart.length) {
        await createOrderDetailsFromCart(orderId, cart);
      }
      const details = await getOrderDetailsByOrderId(orderId);
      const items = groupPaymentItems(details);
      setPaymentItems(items);
      setIsPaymentOpen(true);
      if (cart.length) {
        setCart([]);
        setCaloriesConsumed(0);
      }
    } catch (err) {
      console.error("❌ Mở thanh toán thất bại:", err);
      alert(err?.message || "Không mở được thanh toán. Vui lòng thử lại.");
    }
  };

  const handleOpenEdit = (detail) => {
    setEditingDetail(detail);
    setIsEditOpen(true);
  };

  const handleDeleteDetail = async (detail) => {
    if (!detail?.orderDetailId) return;
    if (!confirm("Xoá món này khỏi đơn?")) return;
    try {
      await deleteOrderDetail(detail.orderDetailId);
      await fetchOrderDetailsFromOrder();
    } catch (e) {
      alert(e?.message || "Xoá món thất bại.");
    }
  };

  const handleEdited = async () => {
    await fetchOrderDetailsFromOrder();
  };

  const handlePayment = () => {
    setIsPaymentOpen(false);
    setIsCallStaffOpen(true);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      <MenuHeader
        cartItemCount={cartItemCount}
        onPersonalize={() => setIsPersonalizationOpen(true)}
        onViewOrders={() => setIsCartOpen(true)}
        onCallStaff={() => {
          setIsCallStaffOpen(true);
          setTimeout(() => {
            setCart([]);
            setCaloriesConsumed(0);
          }, 2000);
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

      <MenuContent
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        filteredDishes={filteredDishes}
        personalizedMenu={personalizedDishes}
        onDishSelect={async (dish) => {
          try {
            let fullDish = await getDish(dish.id);
            if (!fullDish.optionalToppings?.length) {
              const toppings = await getToppingsByDishId(dish.id);
              fullDish = { ...fullDish, optionalToppings: toppings };
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
        onPayment={handlePayment}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
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
    </div>
  );
}
