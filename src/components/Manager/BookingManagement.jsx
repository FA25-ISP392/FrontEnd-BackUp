import { Trash2 } from "lucide-react";
import { useState } from "react";
import { fmtVNDateTime } from "../../lib/datetimeBooking";
import TableLayout from "./TableLayout";
import TableBookingsModal from "./TableBookingsModal";
import ConfirmCancelModal from "../Home/ConfirmCancelModal";
import { listBookingsByTableDate, cancelBooking } from "../../lib/apiBooking";

export default function BookingManagement({
  bookings = [],
  setBookings,
  loading = false,
  page = 1,
  pageInfo = { page: 1, size: 6, totalPages: 1, totalElements: 0 },
  onPageChange = () => {},
  tables = [],
  statusFilter = "ALL",
  onStatusChange = () => {},
}) {
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [showTableBookings, setShowTableBookings] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const { totalPages, totalElements, size: pageSize } = pageInfo;
  const [tableBookings, setTableBookings] = useState([]);
  const [tableBookingsDate, setTableBookingsDate] = useState(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [loadingTableBookings, setLoadingTableBookings] = useState(false);

  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  //===== Lấy ra danh sách đặt bàn ứng theo từng bàn =====
  async function fetchTableBookings(tableId, dateStr) {
    setLoadingTableBookings(true);
    try {
      const items = await listBookingsByTableDate(tableId, dateStr);
      setTableBookings(items);
    } catch (e) {
      console.error(e);
      setTableBookings([]);
    } finally {
      setLoadingTableBookings(false);
    }
  }

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

  //===== Ấn Vào từng Bàn để xem đơn Đặt Bàn =====
  const handleTableClick = (tableId) => {
    setSelectedTableId(tableId);
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      setSelectedTable(table);
      setShowTableBookings(true);
      fetchTableBookings(table.id, tableBookingsDate);
    }
  };

  const handleOpenCancelModal = (booking) => {
    setBookingToCancel(booking);
  };

  const handleCloseCancelModal = () => {
    if (isCancelling) return;
    setBookingToCancel(null);
  };

  //===== Xử lý việc Hủy Đơn =====
  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      //===== Gọi hàm hủy đơn Đặt Bàn =====
      await cancelBooking(bookingToCancel.id);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingToCancel.id ? { ...b, status: "CANCELLED" } : b
        )
      );
      handleCloseCancelModal();
    } catch (error) {
      console.error("Lỗi khi hủy đơn đặt:", error);
      alert(
        error.response?.data?.message || error.message || "Không thể hủy đơn."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const tableNameById = (id) => {
    if (!id && id !== 0) return "-";
    const t = tables.find((x) => String(x.id) === String(id));
    const name = t?.name || `Bàn ${id}`;
    return String(name).replace(/^Table\s*/i, "Bàn ");
  };

  const filterOptions = [
    {
      value: "ALL",
      label: "Tất Cả",
      color: "text-neutral-200 bg-white/10 border-white/20 hover:bg-white/20",
      activeColor: "bg-neutral-600 text-white",
    },
    {
      value: "PENDING",
      label: "Chờ Duyệt",
      color:
        "text-yellow-200 bg-yellow-900/20 border-yellow-500/20 hover:bg-yellow-900/40",
      activeColor: "bg-yellow-500 text-white",
    },
    {
      value: "APPROVED",
      label: "Chấp Nhận",
      color:
        "text-green-200 bg-green-900/20 border-green-500/20 hover:bg-green-900/40",
      activeColor: "bg-green-500 text-white",
    },
    {
      value: "REJECTED",
      label: "Từ Chối",
      color: "text-red-200 bg-red-900/20 border-red-500/20 hover:bg-red-900/40",
      activeColor: "bg-red-500 text-white",
    },
    {
      value: "CANCELLED",
      label: "Đã Hủy",
      color:
        "text-gray-300 bg-gray-900/20 border-gray-500/20 hover:bg-gray-900/40",
      activeColor: "bg-gray-500 text-white",
    },
  ];

  return (
    <div className="space-y-6">
      <TableLayout
        tables={tables}
        onTableClick={handleTableClick}
        selectedTableId={selectedTableId}
      />

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              Danh sách đơn đặt bàn
            </h3>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm font-medium text-indigo-200">
                  Lọc theo trạng thái:
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm border ${
                    statusFilter === option.value
                      ? option.activeColor
                      : option.color
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-indigo-200">
            <div className="col-span-3">Tên Khách Hàng</div>
            <div className="col-span-2">Số Điện Thoại</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-1">Số Người</div>
            <div className="col-span-2">Thời gian tới</div>
            <div className="col-span-1">Bàn Đặt</div>
            <div className="col-span-1">Hành Động</div>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {loading ? (
            <div className="p-6 text-indigo-200">Đang tải danh sách...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-indigo-200">
              Chưa có yêu cầu đặt bàn nào.
            </div>
          ) : (
            bookings.map((b) => {
              const status = String(b.status || "PENDING").toUpperCase();

              return (
                <div key={b.id} className="px-6 py-4 hover:bg-white/5">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3 font-medium text-white truncate text-sm">
                      {b.customerName}
                    </div>

                    <div className="col-span-2 text-neutral-300 truncate text-sm">
                      {b.phone || "-"}
                    </div>

                    <div className="col-span-2 text-neutral-300 truncate text-sm">
                      {b.email || "-"}
                    </div>

                    <div className="col-span-1 text-neutral-300 text-center text-sm">
                      <span className="font-medium">{b.seat}</span>
                    </div>

                    <div className="col-span-2 text-neutral-300">
                      <div className="text-xs">
                        {fmtVNDateTime(b.bookingDate)}
                      </div>
                      <div className="mt-1">
                        {status === "PENDING" && (
                          <span className="px-1 py-0.5 rounded-full text-xs bg-yellow-900/50 text-yellow-300">
                            Chờ duyệt
                          </span>
                        )}
                        {status === "APPROVED" && (
                          <span className="px-1 py-0.5 rounded-full text-xs bg-green-900/50 text-green-300">
                            Đã duyệt
                          </span>
                        )}
                        {(status === "REJECTED" || status === "REJECT") && (
                          <span className="px-1 py-0.5 rounded-full text-xs bg-red-900/50 text-red-300">
                            Từ chối
                          </span>
                        )}
                        {status === "CANCELLED" && (
                          <span className="px-1 py-0.5 rounded-full text-xs bg-gray-900/50 text-gray-300">
                            Đã hủy
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-1 text-neutral-300 text-center">
                      <span
                        className={`px-1 py-0.5 rounded-full text-xs ${
                          b.assignedTableId
                            ? "bg-blue-900/50 text-blue-300 font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        {tableNameById(b.assignedTableId)}
                      </span>
                    </div>

                    <div className="col-span-1 flex gap-1 items-center justify-center">
                      {(status === "PENDING" || status === "APPROVED") && (
                        <button
                          //===== Gọi hàm để Hủy Đơn =====
                          onClick={() => handleOpenCancelModal(b)}
                          className="p-1.5 text-red-400 hover:bg-red-900/50 rounded-lg transition"
                          title="Hủy đơn"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <svg
                  className="h-4 w-4 text-orange-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-sm text-neutral-300">
                {totalElements > 0 ? (
                  <span>
                    Hiển thị{" "}
                    <span className="font-semibold text-orange-300">
                      {from}
                    </span>{" "}
                    đến{" "}
                    <span className="font-semibold text-orange-300">{to}</span>{" "}
                    trong tổng số{" "}
                    <span className="font-semibold text-orange-300">
                      {totalElements}
                    </span>{" "}
                    đơn đặt bàn
                  </span>
                ) : (
                  <span className="text-neutral-400">Không có dữ liệu</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  page <= 1
                    ? "text-neutral-500 bg-black/20 cursor-not-allowed"
                    : "text-neutral-200 bg-white/10 border border-white/20 hover:bg-white/20 hover:text-white shadow-sm"
                }`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Trước
              </button>

              <div className="flex items-center gap-1">
                {buildPages().map((p, i) => {
                  if (p === "…") {
                    return (
                      <span
                        key={`e-${i}`}
                        className="px-3 py-2 text-neutral-400 font-medium"
                      >
                        …
                      </span>
                    );
                  }

                  const baseClass =
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200";
                  const activeClass =
                    "bg-orange-500 text-white shadow-lg transform scale-105";
                  const inactiveClass =
                    "text-neutral-200 bg-white/10 border border-white/20 hover:bg-white/20 hover:text-white shadow-sm";
                  const btnClass = `${baseClass} ${
                    p === page ? activeClass : inactiveClass
                  }`;

                  return (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={btnClass}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  onPageChange(Math.min(pageInfo.totalPages || 1, page + 1))
                }
                disabled={page >= (pageInfo.totalPages || 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  page >= (pageInfo.totalPages || 1)
                    ? "text-neutral-500 bg-black/20 cursor-not-allowed"
                    : "text-neutral-200 bg-white/10 border border-white/20 hover:bg-white/20 hover:text-white shadow-sm"
                }`}
              >
                Sau
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <TableBookingsModal
        isOpen={showTableBookings}
        onClose={() => {
          setShowTableBookings(false);
          setSelectedTable(null);
        }}
        table={selectedTable}
        bookings={tableBookings}
        loading={loadingTableBookings}
        selectedDate={tableBookingsDate}
        onChangeDate={async (newDateStr) => {
          setTableBookingsDate(newDateStr);
          if (selectedTable)
            await fetchTableBookings(selectedTable.id, newDateStr);
        }}
      />

      <ConfirmCancelModal
        open={!!bookingToCancel}
        booking={bookingToCancel}
        disabled={isCancelling}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
