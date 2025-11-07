import { useEffect, useMemo, useState } from "react";
import { X, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getBookingHistoryPaged, cancelBooking } from "../../lib/apiBooking";
import ConfirmCancelModal from "./ConfirmCancelModal";

const statusLabel = (status) => {
  const s = String(status || "PENDING").toUpperCase();
  if (s === "APPROVED") return "Đã đặt";
  if (s === "PENDING") return "Chờ duyệt";
  if (s === "CANCELLED") return "Đã hủy";
  if (s === "REJECT" || s === "REJECTED") return "Từ chối";
  return s;
};
const statusBadge = (status) => {
  const s = String(status || "PENDING").toUpperCase();
  const map = {
    PENDING: "bg-amber-100 text-amber-800 ring-1 ring-amber-700/20",
    APPROVED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/20",
    REJECT: "bg-red-100 text-red-700 ring-1 ring-red-700/20",
    REJECTED: "bg-red-100 text-red-700 ring-1 ring-red-700/20",
    CANCELLED: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        map[s] || "bg-gray-100 text-gray-700"
      }`}
    >
      {statusLabel(s)}
    </span>
  );
};

const tableName = (id) => (id || id === 0 ? `Bàn ${id}` : "-");
const fmtVNDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const time = d.toLocaleTimeString("vi-VN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = d.toLocaleDateString("vi-VN");
  return `${time} ${date}`;
};

export default function CustomerBookingHistory({ isOpen, onClose, userInfo }) {
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

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
        //===== Gọi ra hàm lấy được lịch sử Đặt Bàn của khách hàng =====
        const { items, pageInfo } = await getBookingHistoryPaged({
          customerId,
          page,
          size,
        });
        setItems(items);
        setPageInfo(pageInfo);
      } catch (e) {
        setErr(e.message || "Không thể tải lịch sử đặt bàn");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, customerId, page, size]);

  const refresh = async () => {
    if (!customerId) return;
    const { items, pageInfo } = await getBookingHistoryPaged({
      customerId,
      page,
      size,
    });
    setItems(items);
    setPageInfo(pageInfo);
  };

  const openConfirm = (booking) => {
    setConfirmItem(booking);
    setConfirmOpen(true);
  };
  const doCancel = async () => {
    if (!confirmItem?.id) return;
    try {
      setConfirmBusy(true);
      await cancelBooking(confirmItem.id);
      setConfirmOpen(false);
      setConfirmItem(null);
      await refresh();
    } catch (e) {
      alert(e.message || "Hủy đơn thất bại.");
    } finally {
      setConfirmBusy(false);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-neutral-900">
              Lịch sử đặt bàn
            </h2>
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
                Bạn chưa có đơn đặt bàn nào.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-orange-50 text-neutral-900">
                      <tr>
                        <th className="px-4 py-2 text-left">STT</th>
                        <th className="px-4 py-2 text-center">Số Người</th>
                        <th className="px-4 py-2 text-center">Thời Gian Tới</th>
                        <th className="px-4 py-2 text-center">Trạng Thái</th>
                        <th className="px-4 py-2 text-center">Bàn Đặt</th>
                        <th className="px-4 py-2 text-center">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((b, i) => {
                        const st = String(b.status || "PENDING").toUpperCase();
                        const cancellable =
                          st === "PENDING" || st === "APPROVED";
                        return (
                          <tr key={b.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-2">
                              {(page - 1) * size + i + 1}
                            </td>
                            <td className="px-4 py-2 text-center">{b.seat}</td>
                            <td className="px-4 py-2 text-center">
                              {fmtVNDateTime(b.bookingDate)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {statusBadge(st)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {b.assignedTableId
                                ? tableName(b.assignedTableId)
                                : "-"}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                disabled={!cancellable}
                                onClick={() => openConfirm(b)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
                                  ${
                                    cancellable
                                      ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow ring-1 ring-rose-700/20"
                                      : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                                  }`}
                                title="Hủy đơn đặt bàn"
                              >
                                //===== Hủy Đơn =====
                                <Trash2 className="w-4 h-4" />
                                Hủy đơn
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

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

      <ConfirmCancelModal
        open={confirmOpen}
        booking={confirmItem}
        disabled={confirmBusy}
        onClose={() => !confirmBusy && setConfirmOpen(false)}
        onConfirm={doCancel}
      />
    </div>
  );
}
