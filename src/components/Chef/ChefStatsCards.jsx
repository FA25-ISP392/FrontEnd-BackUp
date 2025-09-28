import { Clock, ChefHat, Package, DollarSign } from "lucide-react";

export default function ChefStatsCards({
  pendingOrders,
  preparingOrders,
  availableDishes,
  totalRevenue,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Pending Orders Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">Đơn Chờ</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {pendingOrders}
            </p>
            <p className="text-xs text-yellow-600 mt-1">Cần xử lý ngay</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Preparing Orders Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">
              Đang Chuẩn Bị
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {preparingOrders}
            </p>
            <p className="text-xs text-blue-600 mt-1">Đang trong quá trình</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Available Dishes Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">
              Món Ăn Có Sẵn
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {availableDishes}
            </p>
            <p className="text-xs text-green-600 mt-1">Có thể phục vụ</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">
              Tổng Doanh Thu
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-purple-600 mt-1">Hôm nay</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
