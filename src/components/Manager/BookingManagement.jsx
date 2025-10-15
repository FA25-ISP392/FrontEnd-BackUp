import { Check, X, Edit, Calendar } from "lucide-react";
import { useState } from "react";
import { fmtVNDateTime } from "../../lib/datetimeBooking";
import TableLayout from "./TableLayout";
import TableAssignmentModal from "./TableAssignmentModal";

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
    console.log("Duyệt đặt bàn:", booking.id);
    setSelectedBooking(booking);
    setShowTableAssignment(true);
  };

  const handleAssignTable = async (bookingId, tableId) => {
    try {
      // Cập nhật booking với bàn được gán
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId 
            ? { ...booking, status: "APPROVED", assignedTableId: tableId }
            : booking
        )
      );
      
      // Gọi API approve trước
      if (onApprove) {
        await onApprove({ id: bookingId });
      }
      
      // Gọi callback để cập nhật trạng thái bàn
      if (onAssignTable) {
        await onAssignTable(bookingId, tableId);
      }
      
      setShowTableAssignment(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Lỗi khi gán bàn:", error);
      // Revert lại trạng thái nếu có lỗi
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId 
            ? { ...booking, status: "PENDING", assignedTableId: null }
            : booking
        )
      );
      throw error;
    }
  };

  const handleTableClick = (tableId) => {
    setSelectedTableId(tableId);
  };

  const handleReject = async (bookingId) => {
    console.log("Từ chối đặt bàn:", bookingId);
    try {
      // Cập nhật trạng thái đặt bàn
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "REJECTED" } : booking
        )
      );
      
      // Gọi API reject
      if (onReject) {
        await onReject({ id: bookingId });
      }
    } catch (error) {
      console.error("Lỗi khi từ chối đặt bàn:", error);
      // Revert lại trạng thái nếu có lỗi
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "PENDING" } : booking
        )
      );
    }
  };

  const handleEdit = (booking) => {
    setEditingItem?.(booking);
    setIsEditingBooking?.(true);
    onEdit?.(booking);
  };

  return (
    <div className="space-y-6">
      {/* Sơ đồ bàn */}
      <TableLayout 
        tables={tables}
        onTableClick={handleTableClick}
        selectedTableId={selectedTableId}
        bookings={bookings}
      />

      {/* Danh sách đặt bàn */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Quản Lý Đặt Bàn
              </h3>
              <p className="text-sm text-neutral-600">
                Quản lý yêu cầu đặt bàn của khách hàng
              </p>
            </div>
          </div>
        </div>
      </div>

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
              return (
                <div key={b.id} className="px-6 py-4 hover:bg-neutral-50">
                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div className="font-medium text-neutral-900">
                      <div className="break-words">{b.customerName}</div>
                    </div>
                    <div className="text-neutral-600">
                      <div className="break-words">{b.phone || "-"}</div>
                    </div>
                    <div className="text-neutral-600">
                      <div className="break-words">{b.email || "-"}</div>
                    </div>
                    <div className="text-neutral-600">
                      <div className="font-medium">{b.seat} người</div>
                    </div>

                    <div className="text-neutral-600">
                      <div className="break-words">{fmtVNDateTime(b.bookingDate)}</div>
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
                        {status === "REJECTED" && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Đã từ chối
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-neutral-600">
                      {b.assignedTableId ? (
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                            Bàn {b.assignedTableId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-sm">Chưa gán</span>
                      )}
                    </div>

                    <div className="text-neutral-600">
                      <div className="break-words">{fmtVNDateTime(b.createdAt || b.created_at)}</div>
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
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
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

      {/* Modal gán bàn */}
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
