import { useState } from "react";
import {
  Plus,
  Minus,
  Send,
  Clock,
  UtensilsCrossed,
  Calendar,
} from "lucide-react";

export default function DishQuantityManagement({ dishes, onSubmitRequest }) {
  const [quantities, setQuantities] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const handleQuantityChange = (dishId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
    }));
  };

  const handleSubmitRequest = (dishId) => {
    setLoadingId(dishId);
    setTimeout(() => {
      const request = {
        dishId,
        dishName: dishes.find((d) => d.id === dishId)?.name,
        requestedQuantity: quantities[dishId] || 0,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        chefName: "Chef User",
      };
      onSubmitRequest(request);
      setQuantities((prev) => ({ ...prev, [dishId]: 0 }));
      setLoadingId(null);
    }, 1000);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <UtensilsCrossed className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Quản Lý Số Lượng Món Ăn
          </h3>
          <p className="text-sm text-indigo-200">
            Thiết lập số lượng món ăn có thể bán trong ngày
          </p>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-4 mb-6 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Đơn đặt hàng cho ngày</h4>
            <p className="text-sm text-neutral-300">
              {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">
                  {dish.name}
                </h4>
                <p className="text-sm text-neutral-400">{dish.category}</p>
                <p className="text-sm font-medium text-green-400">
                  ${dish.price}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-neutral-300">
                Số lượng:
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(dish.id, -1)}
                  className="w-8 h-8 bg-red-900/30 text-red-300 hover:bg-red-900/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  disabled={quantities[dish.id] <= 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-bold text-white min-w-[40px] text-center">
                  {quantities[dish.id] || 0}
                </span>
                <button
                  onClick={() => handleQuantityChange(dish.id, 1)}
                  className="w-8 h-8 bg-green-900/30 text-green-300 hover:bg-green-900/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => handleSubmitRequest(dish.id)}
              disabled={!quantities[dish.id] || loadingId === dish.id}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 hover:scale-105 disabled:hover:scale-100"
            >
              {loadingId === dish.id ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Gửi Yêu Cầu</span>
                </>
              )}
            </button>

            {quantities[dish.id] > 0 && (
              <div className="mt-3 bg-blue-900/20 border border-blue-500/30 rounded-lg p-2">
                <div className="flex items-center gap-2 text-sm text-blue-300">
                  <Clock className="h-4 w-4" />
                  <span>Chờ phê duyệt từ Manager</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-black/20 rounded-xl p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Send className="h-3 w-3 text-white" />
          </div>
          <div>
            <h5 className="font-medium text-white mb-1">Hướng dẫn sử dụng</h5>
            <p className="text-sm text-neutral-300">
              • Thiết lập số lượng món ăn bạn muốn chuẩn bị cho ngày hôm nay
              <br />
              • Nhấn "Gửi Yêu Cầu" để gửi đến Manager để phê duyệt
              <br />• Chỉ sau khi Manager phê duyệt, món ăn mới được phục vụ cho
              khách hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
