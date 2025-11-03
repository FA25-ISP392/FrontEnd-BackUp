import React, { useEffect, useMemo, useState } from "react";
import { X, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import { getOrderHistoryPaged } from "../../lib/apiOrder";

const statusLabel = (paid) => {
  return paid ? "Đã thanh toán" : "Chưa thanh toán";
};

const statusBadge = (paid) => {
  const map = {
    true: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/20",
    false: "bg-amber-100 text-amber-800 ring-1 ring-amber-700/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        map[Boolean(paid)] || "bg-gray-100 text-gray-700"
      }`}
    >
      {statusLabel(paid)}
    </span>
  );
};

const fmtVND = (v = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);

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

export default function OrderHistoryModal({ isOpen, onClose, userInfo }) {
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

  const [expandedId, setExpandedId] = useState(null);

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
        const { items, pageInfo } = await getOrderHistoryPaged({
          customerId,
          page,
          size,
        });
        setItems(items);
        setPageInfo(pageInfo);
      } catch (e) {
        setErr(e.message || "Không thể tải lịch sử gọi món");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, customerId, page, size]);

  const { totalPages, first, last } = pageInfo;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-neutral-700" />
              <h2 className="text-xl font-bold text-neutral-900">
                Lịch sử gọi món
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
                Bạn chưa có lịch sử gọi món nào.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-orange-50 text-neutral-900">
                      <tr>
                        <th className="px-4 py-2 text-left">Mã Đơn Hàng</th>
                        <th className="px-4 py-2 text-center">Bàn Số</th>
                        <th className="px-4 py-2 text-center">Ngày Gọi</th>
                        <th className="px-4 py-2 text-center">Trạng Thái</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {items.map((o) => {
                        const isExpanded = expandedId === o.orderId;
                        return (
                          <React.Fragment key={o.orderId}>
                            <tr
                              className="hover:bg-neutral-50 cursor-pointer"
                              onClick={() =>
                                setExpandedId(isExpanded ? null : o.orderId)
                              }
                            >
                              <td className="px-4 py-2 font-medium">
                                #{o.orderId}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {o.tableId}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {fmtVNDateTime(o.orderDate)}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {statusBadge(o.paid)}
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="bg-neutral-50">
                                <td colSpan="5" className="p-0">
                                  <div className="p-3">
                                    {o.orderDetails.length > 0 ? (
                                      <table className="min-w-full text-xs">
                                        <thead>
                                          <tr className="bg-neutral-200">
                                            <th className="px-3 py-2 text-left">
                                              Tên món
                                            </th>
                                            <th className="px-3 py-2 text-left">
                                              Toppings
                                            </th>
                                            <th className="px-3 py-2 text-left">
                                              Ghi chú
                                            </th>
                                            <th className="px-3 py-2 text-right">
                                              Giá
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {o.orderDetails.map((d) => (
                                            <tr key={d.orderDetailId}>
                                              <td className="px-3 py-2 font-medium">
                                                {d.dishName}
                                              </td>
                                              <td className="px-3 py-2">
                                                {d.toppings?.length > 0
                                                  ? d.toppings
                                                      .map((t) => t.toppingName)
                                                      .join(", ")
                                                  : "Không"}
                                              </td>
                                              <td className="px-3 py-2 text-neutral-600">
                                                {d.note || "Không"}
                                              </td>
                                              <td className="px-3 py-2 text-right">
                                                {fmtVND(d.totalPrice)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    ) : (
                                      <div className="text-xs text-neutral-500 px-3 py-2">
                                        Đơn hàng này không có chi tiết món ăn.
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
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
    </div>
  );
}
