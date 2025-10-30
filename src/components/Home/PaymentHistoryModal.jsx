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
                        <th className="px-4 py-2 text-left">Mã TT (Payment)</th>
                        <th className="px-4 py-2 text-left">Mã Đơn (Order)</th>
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
                              {p.datetimeTextPlus7 || p.datetimeText}
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

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    Tổng: <b>{pageInfo.totalElements}</b> thanh toán • Trang{" "}
                    <b>{pageInfo.page}</b>/<b>{pageInfo.totalPages}</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={size}
                      onChange={(e) => {
                        setPage(1);
                        setSize(Number(e.target.value) || 6);
                      }}
                      className="border rounded-lg px-2 py-1 text-sm"
                      title="Số dòng / trang"
                    >
                      <option value={6}>6 / trang</option>
                      <option value={10}>10 / trang</option>
                      <option value={20}>20 / trang</option>
                    </select>
                    <button
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageInfo.first}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
                      onClick={() =>
                        setPage((p) => Math.min(pageInfo.totalPages, p + 1))
                      }
                      disabled={pageInfo.last}
                    >
                      <ChevronRight className="w-4 h-4" />
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
