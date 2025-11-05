import { useState, useEffect } from "react";
import ChefSidebar from "../components/Chef/ChefSidebar";
import OrdersManagement from "../components/Chef/OrdersManagement";
import DishQuantityManagement from "../components/Chef/DishQuantityManagement";
import { mockChefDishes } from "../lib/chefData";
import { getCurrentUser } from "../lib/auth";
import ChefDailyPlan from "../components/Chef/ChefDailyPlan";
import ChefDailyDishes from "../components/Chef/ChefDailyDishes";
import ChefDailyPlanTopping from "../components/Chef/ChefDailyPlanTopping";
import ChefDailyToppings from "../components/Chef/ChefDailyToppings";
// 🔽 THÊM MỚI: Import icon
import { History, CheckCircle, AlertTriangle } from "lucide-react";

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
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔽 THÊM MỚI: useEffect để tự động đóng modal
  useEffect(() => {
    let timer;
    if (isSuccessOpen) {
      timer = setTimeout(() => {
        setIsSuccessOpen(false);
        setSuccessMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSuccessOpen]);

  useEffect(() => {
    let timer;
    if (isErrorOpen) {
      timer = setTimeout(() => {
        setIsErrorOpen(false);
        setErrorMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isErrorOpen]);

  // 🔽 THÊM MỚI: Wrapper functions để set state
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setIsErrorOpen(true);
  };
  // (Các useEffect và hàm fetchAllOrders giữ nguyên)
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
      // 🔽 SỬA: Dùng modal lỗi
      showError(`Cập nhật thất bại: ${err.message}. Đang tải lại...`);
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                <History className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Lịch Sử Đơn Món
                </h3>
                <p className="text-sm text-neutral-300">
                  Các món đã nấu xong từ những ngày trước
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="text-indigo-200">Đang tải lịch sử...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : historicalReady.length === 0 ? (
              <p className="text-center py-8 text-neutral-400">
                Chưa có lịch sử món ăn.
              </p>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {historicalReady.map((od) => (
                  <div
                    key={od.orderDetailId}
                    className="bg-black/20 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-white">
                          {od.dishName}
                        </span>
                        <span className="text-sm text-neutral-400 ml-2">
                          (ID: {od.orderDetailId})
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-400">
                        {od.orderDate
                          ? new Date(od.orderDate).toLocaleDateString("vi-VN")
                          : "Không rõ ngày"}
                      </span>
                    </div>

                    {/* === KHỐI ĐÃ SỬA === */}
                    {Array.isArray(od.toppings) && od.toppings.length > 0 && (
                      <div className="text-xs text-neutral-400 mt-1 pt-1 border-t border-white/10">
                        <span className="font-medium text-neutral-200">
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
                      <p className="text-xs italic text-neutral-400 mt-1">
                        Ghi chú: {od.note}
                      </p>
                    )}
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
                  subTab === "dish"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-black/20 text-neutral-300 hover:bg-black/30"
                }`}
              >
                Món ăn
              </button>
              <button
                onClick={() => setSubTab("topping")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  subTab === "topping"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-black/20 text-neutral-300 hover:bg-black/30"
                }`}
              >
                Topping
              </button>
            </div>
            {/* 🔽 SỬA: Truyền props thông báo xuống */}
            {subTab === "dish" ? (
              <ChefDailyPlan
                setSuccessMessage={showSuccess}
                setErrorMessage={showError}
              />
            ) : (
              <ChefDailyPlanTopping
                setSuccessMessage={showSuccess}
                setErrorMessage={showError}
              />
            )}
          </div>
        );

      case "dailyDishes":
        return (
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setSubTab("dish")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  subTab === "dish"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-black/20 text-neutral-300 hover:bg-black/30"
                }`}
              >
                Món ăn
              </button>
              <button
                onClick={() => setSubTab("topping")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  subTab === "topping"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-black/20 text-neutral-300 hover:bg-black/30"
                }`}
              >
                Topping
              </button>
            </div>

            {subTab === "dish" ? <ChefDailyDishes /> : <ChefDailyToppings />}
          </div>
        );

      case "invoices":
        return (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Quản Lý Hóa Đơn
            </h3>
            <p className="text-indigo-200">
              Chức năng quản lý hóa đơn sẽ được phát triển...
            </p>
          </div>
        );

      case "settings":
        return (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Cài Đặt</h3>
            <p className="text-indigo-200">
              Chức năng cài đặt sẽ được phát triển...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-red-900">
      <div className="flex">
        <ChefSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white shadow-text-lg mb-2">
              Chào mừng trở lại, {chefName}!
            </h1>
            <p className="text-red-300 text-lg">
              Quản lý bếp hiệu quả với dashboard thông minh
            </p>
          </div>

          {renderContent()}
        </main>
      </div>

      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-green-500/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-300">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Thành công!</h3>
              <p className="text-neutral-300 mb-6">{successMessage}</p>
              <button
                onClick={() => setIsSuccessOpen(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {isErrorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-500/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-300">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-neutral-300 mb-6">{errorMessage}</p>
              <button
                onClick={() => setIsErrorOpen(false)}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-medium text-sm"
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
