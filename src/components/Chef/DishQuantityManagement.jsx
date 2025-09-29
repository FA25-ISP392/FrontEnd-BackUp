import { useState } from "react";
import { 
  Plus, 
  Minus, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  UtensilsCrossed,
  Calendar
} from "lucide-react";

export default function DishQuantityManagement({ dishes, onSubmitRequest }) {
  const [quantities, setQuantities] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const handleQuantityChange = (dishId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta)
    }));
  };

  const handleSubmitRequest = (dishId) => {
    setLoadingId(dishId);
    // Simulate API call
    setTimeout(() => {
      const request = {
        dishId,
        dishName: dishes.find(d => d.id === dishId)?.name,
        requestedQuantity: quantities[dishId] || 0,
        status: "pending",
        date: new Date().toISOString().split('T')[0],
        chefName: "Chef User"
      };
      onSubmitRequest(request);
      setQuantities(prev => ({ ...prev, [dishId]: 0 }));
      setLoadingId(null);
    }, 1000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <UtensilsCrossed className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Quản Lý Số Lượng Món Ăn
          </h3>
          <p className="text-sm text-neutral-600">
            Thiết lập số lượng món ăn có thể bán trong ngày
          </p>
        </div>
      </div>

      {/* Date Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900">Đơn đặt hàng cho ngày</h4>
            <p className="text-sm text-neutral-600">{new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:shadow-md transition-all duration-300 group"
          >
            {/* Dish Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors duration-300">
                  {dish.name}
                </h4>
                <p className="text-sm text-neutral-600">{dish.category}</p>
                <p className="text-sm font-medium text-green-600">${dish.price}</p>
              </div>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-neutral-700">Số lượng:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(dish.id, -1)}
                  className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  disabled={quantities[dish.id] <= 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-bold text-neutral-900 min-w-[40px] text-center">
                  {quantities[dish.id] || 0}
                </span>
                <button
                  onClick={() => handleQuantityChange(dish.id, 1)}
                  className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Submit Request */}
            <button
              onClick={() => handleSubmitRequest(dish.id)}
              disabled={!quantities[dish.id] || loadingId === dish.id}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-neutral-300 disabled:to-neutral-400 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 hover:scale-105 disabled:hover:scale-100"
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

            {/* Status Indicator */}
            {quantities[dish.id] > 0 && (
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Clock className="h-4 w-4" />
                  <span>Chờ phê duyệt từ Manager</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Send className="h-3 w-3 text-white" />
          </div>
          <div>
            <h5 className="font-medium text-neutral-900 mb-1">Hướng dẫn sử dụng</h5>
            <p className="text-sm text-neutral-600">
              • Thiết lập số lượng món ăn bạn muốn chuẩn bị cho ngày hôm nay<br/>
              • Nhấn "Gửi Yêu Cầu" để gửi đến Manager để phê duyệt<br/>
              • Chỉ sau khi Manager phê duyệt, món ăn mới được phục vụ cho khách hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
