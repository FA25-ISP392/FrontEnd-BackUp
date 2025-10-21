import { useState, useEffect } from "react";
import ChefSidebar from "../components/Chef/ChefSidebar";
import OrdersManagement from "../components/Chef/OrdersManagement";
import DishQuantityManagement from "../components/Chef/DishQuantityManagement";
import { mockChefOrders, mockChefDishes } from "../lib/chefData";
import { getCurrentUser } from "../lib/auth";
import ChefDailyPlan from "../components/Chef/ChefDailyPlan";
import ChefDailyDishes from "../components/Chef/ChefDailyDishes";
import ChefRejectedDishes from "../components/Chef/ChefRejectedDishes"; // 🆕 import thêm

export default function Chef() {
  const [chefName, setChefName] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [orders, setOrders] = useState(mockChefOrders);
  const [dishes, setDishes] = useState(mockChefDishes);
  const [dishRequests, setDishRequests] = useState([]); // Requests sent to Manager

  // 🧩 Lấy tên user để hiển thị welcome
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

  // 🧩 Cập nhật trạng thái order
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  // 🧩 Gửi request món ăn (hiện tại mock)
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

  // 🧩 Điều hướng giữa các mục
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OrdersManagement
            orders={orders}
            updateOrderStatus={updateOrderStatus}
          />
        );

      case "orders":
        return (
          <OrdersManagement
            orders={orders}
            updateOrderStatus={updateOrderStatus}
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
        return <ChefDailyPlan />;

      case "dailyDishes":
        return <ChefDailyDishes />;

      case "rejectedDishes": // 🆕 Tab mới cho món bị từ chối
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

  // 🧩 Giao diện chính
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-red-50">
      <div className="flex">
        {/* Sidebar */}
        <ChefSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Nội dung chính */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Chào mừng trở lại, {chefName}!
            </h1>
            <p className="text-neutral-600 text-lg">
              Quản lý bếp hiệu quả với dashboard thông minh
            </p>
          </div>

          {/* Render nội dung tương ứng */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
