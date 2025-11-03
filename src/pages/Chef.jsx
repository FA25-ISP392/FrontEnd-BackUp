import { useState, useEffect } from "react";
import ChefSidebar from "../components/Chef/ChefSidebar";
import OrdersManagement from "../components/Chef/OrdersManagement";
import DishQuantityManagement from "../components/Chef/DishQuantityManagement";
import { mockChefDishes } from "../lib/chefData";
import { getCurrentUser } from "../lib/auth";
import ChefDailyPlan from "../components/Chef/ChefDailyPlan";
import ChefDailyDishes from "../components/Chef/ChefDailyDishes";
import ChefRejectedDishes from "../components/Chef/ChefRejectedDishes";
import ChefDailyPlanTopping from "../components/Chef/ChefDailyPlanTopping";
import ChefDailyToppings from "../components/Chef/ChefDailyToppings";
import { History } from "lucide-react";

import {
  getOrderDetailsByStatus,
  updateOrderDetailStatus,
} from "../lib/apiOrderDetail";

export default function Chef() {
  const [chefName, setChefName] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [dishes, setDishes] = useState(mockChefDishes);
  const [dishRequests, setDishRequests] = useState([]);
  const [pending, setPending] = useState([]);
  const [preparing, setPreparing] = useState([]);
  const [readyToday, setReadyToday] = useState([]);
  const [historicalReady, setHistoricalReady] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subTab, setSubTab] = useState("dish");

  useEffect(() => {
    const u = getCurrentUser();
    const name =
      u?.staff_name ||
      u?.staffName ||
      u?.fullName ||
      u?.name ||
      u?.displayName ||
      u?.username;
    setChefName(name || "Chef");
  }, []);

  const fetchAllOrders = async () => {
    setError(null);
    try {
      const [pendingData, preparingData, doneData, servedData] =
        await Promise.all([
          getOrderDetailsByStatus("PENDING"),
          getOrderDetailsByStatus("PREPARING"),
          getOrderDetailsByStatus("DONE"),
          getOrderDetailsByStatus("SERVED"),
        ]);

      const today = new Date().toISOString().split("T")[0];
      const readyForToday = [];
      const readyForPast = [];

      const byId = new Map();
      [...(doneData || []), ...(servedData || [])].forEach((it) =>
        byId.set(it.orderDetailId, it)
      );
      const allReadyAndServed = Array.from(byId.values());

      for (const od of allReadyAndServed) {
        if (od.orderDate && od.orderDate.startsWith(today)) {
          readyForToday.push(od);
        } else {
          readyForPast.push(od);
        }
      }

      setPending(pendingData);
      setPreparing(preparingData);
      setReadyToday(readyForToday);
      setHistoricalReady(readyForPast);
    } catch (err) {
      console.error("Lỗi fetch đơn hàng:", err);
      setError(err.message || "Không thể tải danh sách đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const intervalId = setInterval(fetchAllOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateStatus = async (orderDetailId, newStatus) => {
    try {
      const itemToMove =
        pending.find((o) => o.orderDetailId === orderDetailId) ||
        preparing.find((o) => o.orderDetailId === orderDetailId);
      if (!itemToMove) return;
      setPending((prev) =>
        prev.filter((o) => o.orderDetailId !== orderDetailId)
      );
      setPreparing((prev) =>
        prev.filter((o) => o.orderDetailId !== orderDetailId)
      );
      const updatedItem = { ...itemToMove, status: newStatus };
      if (newStatus === "PREPARING") {
        setPreparing((prev) => [updatedItem, ...prev]);
      } else if (newStatus === "DONE" || newStatus === "SERVED") {
        setReadyToday((prev) => [updatedItem, ...prev]);
      }
      await updateOrderDetailStatus(orderDetailId, itemToMove, newStatus);
    } catch (err) {
      console.error(`Lỗi cập nhật món ${orderDetailId}:`, err);
      alert(`Cập nhật thất bại: ${err.message}. Đang tải lại danh sách...`);
      setIsLoading(true);
      fetchAllOrders();
    }
  };

  const submitDishRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      createdAt: Date.now(),
      status: "pending",
    };
    setDishRequests((prev) => [...prev, newRequest]);
    console.log("Dish request submitted:", newRequest);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
      case "orders":
        return (
          <OrdersManagement
            pendingOrders={pending}
            preparingOrders={preparing}
            readyOrders={readyToday}
            onUpdateStatus={handleUpdateStatus}
            isLoading={isLoading}
            error={error}
          />
        );

      case "orderHistory":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                <History className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  Lịch Sử Đơn Món
                </h3>
                <p className="text-sm text-neutral-600">
                  Các món đã nấu xong từ những ngày trước
                </p>
              </div>
            </div>

            {isLoading ? (
              <p>Đang tải lịch sử...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : historicalReady.length === 0 ? (
              <p className="text-center py-8 text-neutral-500">
                Chưa có lịch sử món ăn.
              </p>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
                {historicalReady.map((od) => (
                  <div
                    key={od.orderDetailId}
                    className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-neutral-800">
                          {od.dishName}
                        </span>
                        <span className="text-sm text-neutral-600 ml-2">
                          (ID: {od.orderDetailId})
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-500">
                        {od.orderDate
                          ? new Date(od.orderDate).toLocaleDateString("vi-VN")
                          : "Không rõ ngày"}
                      </span>
                    </div>

                    {/* === KHỐI ĐÃ SỬA === */}
                    {Array.isArray(od.toppings) && od.toppings.length > 0 && (
                      <div className="text-xs text-neutral-500 mt-1 pt-1 border-t border-neutral-200/60">
                        <span className="font-medium text-neutral-700">
                          Topping:{" "}
                        </span>
                        {od.toppings
                          .map((t) =>
                            t.quantity > 1
                              ? `${t.toppingName} x${t.quantity}`
                              : t.toppingName
                          )
                          .join(", ")}
                      </div>
                    )}
                    {od.note && (
                      <p className="text-xs italic text-neutral-500 mt-1">
                        Ghi chú: {od.note}
                      </p>
                    )}
                    {/* === HẾT KHỐI ĐÃ SỬA === */}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "dishes":
        return (
          <DishQuantityManagement
            dishes={dishes}
            onSubmitRequest={submitDishRequest}
          />
        );

      case "dailyPlan":
        return (
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setSubTab("dish")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  subTab === "dish" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                Món ăn
              </button>
              <button
                onClick={() => setSubTab("topping")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  subTab === "topping"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                Topping
              </button>
            </div>

            {subTab === "dish" ? <ChefDailyPlan /> : <ChefDailyPlanTopping />}
          </div>
        );

      case "dailyDishes":
        return (
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setSubTab("dish")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  subTab === "dish" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                Món ăn
              </button>
              <button
                onClick={() => setSubTab("topping")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  subTab === "topping"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                Topping
              </button>
            </div>

            {subTab === "dish" ? <ChefDailyDishes /> : <ChefDailyToppings />}
          </div>
        );

      case "rejectedDishes":
        return <ChefRejectedDishes />;

      case "invoices":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Quản Lý Hóa Đơn
            </h3>
            <p className="text-neutral-600">
              Chức năng quản lý hóa đơn sẽ được phát triển...
            </p>
          </div>
        );

      case "settings":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Cài Đặt</h3>
            <p className="text-neutral-600">
              Chức năng cài đặt sẽ được phát triển...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      <div className="flex">
        <ChefSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Chào mừng trở lại, {chefName}!
            </h1>
            <p className="text-neutral-600 text-lg">
              Quản lý bếp hiệu quả với dashboard thông minh
            </p>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
