import { useEffect, useMemo, useState } from "react";
import { X, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { getPaymentHistoryPaged } from "../../lib/apiPayment";

const statusLabel = (status) => {
  const s = String(status || "PENDING").toUpperCase();
  if (s === "COMPLETED") return "Thành công";
  if (s === "PENDING") return "Đang chờ";
  if (s === "CANCELLED") return "Đã hủy";
  if (s === "FAILED") return "Thất bại";
  if (s === "EXPIRED") return "Hết hạn";
  return s;
};

const statusBadge = (status, label) => {
  const s = String(status || "PENDING").toUpperCase();
  const map = {
    PENDING: "bg-amber-100 text-amber-800 ring-1 ring-amber-700/20",
    COMPLETED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/20",
    FAILED: "bg-red-100 text-red-700 ring-1 ring-red-700/20",
    CANCELLED: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-500/20",
    EXPIRED: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        map[s] || "bg-gray-100 text-gray-700"
      }`}
    >
      {label || statusLabel(s)}
    </span>
  );
};

const fmtVND = (v = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);

export default function PaymentHistoryModal({ isOpen, onClose, userInfo }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 6,
    totalPages: 1,
    totalElements: 0,
    first: true,
    last: true,
  });

  const customerId = useMemo(() => {
    return (
      userInfo?.id ||
      userInfo?.customerId ||
      userInfo?.customer?.id ||
      userInfo?.userId ||
      null
    );
  }, [userInfo]);

  useEffect(() => {
    if (!isOpen) return;
    if (!customerId) {
      setErr("Thiếu customerId.");
      return;
    }
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { items, pageInfo } = await getPaymentHistoryPaged({
          customerId,
          page,
          size,
        });
        setItems(items);
        setPageInfo(pageInfo);
      } catch (e) {
        setErr(e.message || "Không thể tải lịch sử thanh toán");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, customerId, page, size]);

  // 🔽 HÀM BUILD TRANG MỚI
  const { totalPages, totalElements, first, last } = pageInfo;
  const pageSize = size;

  const buildPages = () => {
    const maxLength = 5;
    if (totalPages <= maxLength) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const left = Math.max(1, page - 2);
    const right = Math.min(totalPages, page + 2);
    const pages = [];
    if (left > 1) pages.push(1, "…");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages) pages.push("…", totalPages);
    return pages;
  };

  const from = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalElements);
  // 🔼 HẾT HÀM BUILD TRANG MỚI

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-neutral-700" />
              <h2 className="text-xl font-bold text-neutral-900">
                Lịch sử thanh toán
              </h2>
            </div>
            <button
              className="p-2 hover:bg-neutral-100 rounded-lg"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-neutral-500">Đang tải...</div>
            ) : err ? (
              <div className="bg-red-50 text-red-700 rounded-lg p-3">{err}</div>
            ) : items.length === 0 ? (
              <div className="text-neutral-500">
                Bạn chưa có thanh toán nào.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-orange-50 text-neutral-900">
                      <tr>
                        <th className="px-4 py-2 text-left">Mã Thanh Toán</th>
                        <th className="px-4 py-2 text-left">Mã Đơn</th>
                        <th className="px-4 py-2 text-right">Tổng Tiền</th>
                        <th className="px-4 py-2 text-center">Thời Gian</th>
                        <th className="px-4 py-2 text-center">Phương Thức</th>
                        <th className="px-4 py-2 text-center">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((p) => {
                        return (
                          <tr key={p.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-2 font-medium">#{p.id}</td>
                            <td className="px-4 py-2">#{p.orderId}</td>
                            <td className="px-4 py-2 text-right font-semibold text-green-700">
                              {fmtVND(p.total)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {p.datetimeText}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {p.methodVi}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {statusBadge(p.status, p.statusVi)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 🔽 PHÂN TRANG MỚI (ĐÃ CĂN GIỮA) */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={first}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        first
                          ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
                          : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </button>

                    <div className="flex items-center gap-1">
                      {buildPages().map((p, i) =>
                        p === "…" ? (
                          <span
                            key={`e-${i}`}
                            className="px-3 py-2 text-neutral-500 font-medium"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              p === page
                                ? "bg-orange-500 text-white shadow-lg transform scale-105"
                                : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setPage(Math.min(totalPages || 1, page + 1))
                      }
                      disabled={last}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        last
                          ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
                          : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
                      }`}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
