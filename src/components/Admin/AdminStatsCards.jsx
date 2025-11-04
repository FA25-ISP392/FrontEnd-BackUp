import { useEffect, useState } from "react";
import { getRevenueSummary } from "../../lib/apiStatistics";
import {
  DollarSign,
  Banknote,
  CreditCard,
  Users,
  FileText,
} from "lucide-react"; // 👈 Thêm icon

export default function AdminStatsCards({
  loading,
  totalRevenue,
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
      {/* Card 1: Doanh Thu Hôm Nay */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-blue-200">
            Doanh Thu Hôm Nay
          </p>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
        </div>
        {loading ? (
          <p className="text-3xl font-extrabold text-white animate-pulse">
            Đang tải...
          </p>
        ) : (
          <p className="text-4xl font-extrabold text-white shadow-text">
            {fmtVND(totalRevenue)}
          </p>
        )}
      </div>

      {/* Card 2: Tổng Tài Khoản */}
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

      {/* Card 3: Tổng Hóa Đơn (Hôm nay) */}
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
