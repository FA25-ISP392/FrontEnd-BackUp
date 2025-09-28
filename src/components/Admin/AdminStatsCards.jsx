import { DollarSign, Users, Package, TrendingUp, FileText } from "lucide-react";

export default function AdminStatsCards({
  totalRevenue,
  totalAccounts,
  totalDishes,
  totalInvoices,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Revenue Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">
              Tổng Doanh Thu
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Total Accounts Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">
              Tổng Tài Khoản
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {totalAccounts}
            </p>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.2% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Total Dishes Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">
              Tổng Món Ăn
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {totalDishes}
            </p>
            <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +5.1% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Total Invoices Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium mb-2">
              Tổng Hóa Đơn
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {totalInvoices}
            </p>
            <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +15.3% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
