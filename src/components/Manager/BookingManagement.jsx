import { Check, X, Edit, Calendar } from "lucide-react";
import { useState } from "react";
import { fmtVNDateTime } from "../../lib/datetimeBooking";
import TableLayout from "./TableLayout";
import TableAssignmentModal from "./TableAssignmentModal";
import { approveBookingWithTable } from "../../lib/apiBooking";

export default function BookingManagement({
  bookings = [],
  setBookings,
  setIsEditingBooking,
  setEditingItem,
  loading = false,
  deletingIds = new Set(),
  page = 1,
  pageInfo = { page: 1, size: 6, totalPages: 1, totalElements: 0 },
  onPageChange = () => {},
  onApprove,
  onReject,
  onEdit,
  tables = [],
  onAssignTable,
  statusFilter = "ALL",
  onStatusChange = () => {},
}) {
  const [confirmingId, setConfirmingId] = useState(null);
  const [showTableAssignment, setShowTableAssignment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const { totalPages, totalElements, size: pageSize } = pageInfo;

  const buildPages = () => {
    const maxLength = 5;
    if (totalPages <= maxLength) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const left = Math.max(1, page - 2);
    const right = Math.min(totalPages, page + 2);
    const pages = [];
    if (left > 1) pages.push(1, "...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages) pages.push("...", totalPages);
    return pages;
  };

  const from = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalElements);

  const handleApprove = (booking) => {
    setSelectedBooking(booking);
    setShowTableAssignment(true);
  };

  const handleAssignTable = async (bookingId, tableId) => {
    try {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "APPROVED", assignedTableId: tableId }
            : booking
        )
      );
      await onAssignTable?.(bookingId, tableId);
      setShowTableAssignment(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Lỗi khi gán bàn:", error);
      alert(error.message || "Không thể gán bàn cho đơn đặt.");
    }
  };

  const handleTableClick = (tableId) => {
    setSelectedTableId(tableId);
  };

  const handleReject = async (bookingId) => {
    try {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "REJECT" } : b))
      );
      await onReject?.(bookingId);
    } catch (error) {
      console.error("Lỗi khi từ chối đặt bàn:", error);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "PENDING" } : b))
      );
    }
  };

  const handleEdit = (booking) => {
    setEditingItem?.(booking);
    setIsEditingBooking?.(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-700">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              onStatusChange(e.target.value);
            }}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">Tất Cả</option>
            <option value="PENDING">Chờ Duyệt</option>
            <option value="APPROVED">Chấp Nhận</option>
            <option value="REJECTED">Từ Chối</option>
            <option value="CANCELLED">Đã Hủy</option>
          </select>
        </div>
      </div>

      <TableLayout
        tables={tables}
        onTableClick={handleTableClick}
        selectedTableId={selectedTableId}
        bookings={bookings}
      />

      <div className="bg-white/80 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-neutral-700">
            <div>Tên Khách Hàng</div>
            <div>Số Điện Thoại</div>
            <div>Email</div>
            <div>Số Người</div>
            <div>Thời gian tới</div>
            <div>Bàn được gán</div>
            <div>Ghi nhận</div>
            <div>Hành Động</div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200">
          {loading ? (
            <div className="p-6 text-neutral-500">Đang tải danh sách...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-neutral-500">
              Chưa có yêu cầu đặt bàn nào.
            </div>
          ) : (
            bookings.map((b) => {
              const status = String(b.status || "PENDING").toUpperCase();
              const isLocked = [
                "APPROVED",
                "REJECT",
                "REJECTED",
                "CANCELLED",
              ].includes(status);
              return (
                <div key={b.id} className="px-6 py-4 hover:bg-neutral-50">
                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div className="font-medium text-neutral-900">
                      {b.customerName}
                    </div>
                    <div className="text-neutral-600">{b.phone || "-"}</div>
                    <div className="text-neutral-600">{b.email || "-"}</div>
                    <div className="text-neutral-600">
                      <span className="font-medium">{b.seat}</span> người
                    </div>

                    <div className="text-neutral-600">
                      <div>{fmtVNDateTime(b.bookingDate)}</div>
                      <div className="mt-1">
                        {status === "PENDING" && (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Chờ duyệt
                          </span>
                        )}
                        {status === "APPROVED" && (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Đã duyệt
                          </span>
                        )}
                        {(status === "REJECTED" || status === "REJECT") && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Đã từ chối
                          </span>
                        )}
                        {status === "CANCELLED" && (
                          <span className="px-2 py-1 rounded-full text-xs bg-neutral-200 text-neutral-700">
                            Đã hủy
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-neutral-600">
                      {b.assignedTableId ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                          Bàn {b.assignedTableId}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-sm">
                          Chưa gán
                        </span>
                      )}
                    </div>

                    <div className="text-neutral-600">
                      {fmtVNDateTime(b.createdAt || b.created_at)}
                    </div>

                    <div className="flex gap-2 items-center">
                      {status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(b)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Duyệt"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Từ chối"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(b)}
                        disabled={isLocked}
                        className={`p-2 text-blue-600 rounded-lg transition ${
                          isLocked
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-blue-50"
                        }`}
                        title="Sửa (số người, giờ tới)"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <div className="text-sm text-neutral-600">
            {totalElements > 0
              ? `Hiển thị ${from}–${to} / ${totalElements}`
              : "Không có dữ liệu"}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className={`px-3 py-2 rounded-lg text-sm border ${
                page <= 1
                  ? "text-neutral-400 border-neutral-200"
                  : "hover:bg-neutral-100 border-neutral-300"
              }`}
            >
              Trước
            </button>
            {buildPages().map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="px-2 text-neutral-500">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`px-3 py-2 rounded-lg text-sm border ${
                    p === page
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "hover:bg-neutral-100 border-neutral-300"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() =>
                onPageChange(Math.min(pageInfo.totalPages || 1, page + 1))
              }
              disabled={page >= (pageInfo.totalPages || 1)}
              className={`px-3 py-2 rounded-lg text-sm border ${
                page >= (pageInfo.totalPages || 1)
                  ? "text-neutral-400 border-neutral-200"
                  : "hover:bg-neutral-100 border-neutral-300"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <TableAssignmentModal
        isOpen={showTableAssignment}
        onClose={() => {
          setShowTableAssignment(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        tables={tables}
        onAssignTable={handleAssignTable}
      />
    </div>
  );
}
