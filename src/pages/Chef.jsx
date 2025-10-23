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
  const [ready, setReady] = useState([]);
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
      const [pendingData, preparingData, servedData] = await Promise.all([
        getOrderDetailsByStatus("PENDING"),
        getOrderDetailsByStatus("PREPARING"),
        getOrderDetailsByStatus("SERVED"),
      ]);

      setPending(pendingData);
      setPreparing(preparingData);
      setReady(servedData);
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
        prev.filter((o) => o.orderDetailId !== orderDetailId),
      );
      setPreparing((prev) =>
        prev.filter((o) => o.orderDetailId !== orderDetailId),
      );
      const updatedItem = { ...itemToMove, status: newStatus };
      if (newStatus === "PREPARING") {
        setPreparing((prev) => [updatedItem, ...prev]);
      } else if (newStatus === "SERVED") {
        setReady((prev) => [updatedItem, ...prev]);
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
            readyOrders={ready}
            onUpdateStatus={handleUpdateStatus}
            isLoading={isLoading}
            error={error}
          />
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
