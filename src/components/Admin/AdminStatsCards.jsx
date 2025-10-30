import { DollarSign } from "lucide-react";

export default function AdminStatsCards({ totalRevenue = 0 }) {
  const fmtVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 flex justify-between items-center hover:shadow-xl transition-all">
        <div>
          <p className="text-neutral-600 text-sm mb-2">
            Tổng Doanh Thu Hôm Nay
          </p>
          <p className="text-3xl font-bold text-neutral-800">
            {fmtVND(totalRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
