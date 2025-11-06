import { Coins, Banknote, CreditCard, Users, FileText } from "lucide-react";

export default function AdminStatsCards({
  loading,
  totalRevenue,
  cashRevenueToday = 0,
  bankRevenueToday = 0,
  totalAccounts,
  totalInvoices,
}) {
  const fmtVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-blue-200">
            Doanh Thu Hôm Nay
          </p>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
            <Coins className="h-5 w-5 text-white" />
          </div>
        </div>

        {loading ? (
          <p className="text-3xl font-extrabold text-white animate-pulse">
            Đang tải...
          </p>
        ) : (
          <>
            <p className="text-4xl font-extrabold text-white mb-3">
              {fmtVND(totalRevenue)}
            </p>

            <div className="flex flex-col gap-1 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-yellow-400" />
                <span>
                  <strong>Tiền mặt:</strong> {fmtVND(cashRevenueToday)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-400" />
                <span>
                  <strong>Chuyển khoản:</strong> {fmtVND(bankRevenueToday)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-purple-200">
            Tổng Tài Khoản
          </p>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
        </div>

        {loading ? (
          <p className="text-3xl font-extrabold text-white animate-pulse">
            ...
          </p>
        ) : (
          <p className="text-4xl font-extrabold text-white shadow-text">
            {totalAccounts}
          </p>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-emerald-200">Tổng Hóa Đơn</p>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
        </div>

        {loading ? (
          <p className="text-3xl font-extrabold text-white animate-pulse">
            ...
          </p>
        ) : (
          <p className="text-4xl font-extrabold text-white shadow-text">
            {totalInvoices}
          </p>
        )}
      </div>
    </div>
  );
}
