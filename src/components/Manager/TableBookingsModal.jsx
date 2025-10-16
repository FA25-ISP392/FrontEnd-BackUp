import { X, Calendar, Users, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { fmtVNDateTime, normalizeISOFromAPI } from "../../lib/datetimeBooking";

export default function TableBookingsModal({
  isOpen,
  onClose,
  table,
  bookings = [],
  loading = false,
  selectedDate = "",
  onChangeDate,
}) {
  const [sortedBookings, setSortedBookings] = useState([]);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (table) {
      const sorted = [...bookings].sort((a, b) => {
        const dateA = new Date(a.bookingDate);
        const dateB = new Date(b.bookingDate);
        if (sortBy === "date") {
          const dateCompare = dateA
            .toDateString()
            .localeCompare(dateB.toDateString());
          if (dateCompare !== 0) return dateCompare;
          return dateA.getTime() - dateB.getTime();
        } else {
          // Sắp xếp theo thời gian
          return dateA.getTime() - dateB.getTime();
        }
      });
      setSortedBookings(sorted);
    } else setSortedBookings([]);
  }, [table, bookings, sortBy]);

  if (!isOpen || !table) return null;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
      case "REJECT":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-neutral-200 text-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
      case "REJECT":
        return "Từ chối";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  function addHoursToDate(isoString, hours = 2) {
    if (!isoString) return "";
    const date = new Date(normalizeISOFromAPI(isoString));
    date.setHours(date.getHours() + hours);
    return date.toISOString();
  }

  function formatHourMinute(isoString) {
    if (!isoString) return "-";
    const d = new Date(normalizeISOFromAPI(isoString));
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-orange-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Thông tin bàn {table.number || table.tableNumber || table.id}
              </h2>
              <p className="text-orange-100">
                Sức chứa:{" "}
                {table.capacity || table.seatTable || table.seats || table.seat}{" "}
                chỗ ngồi
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-r from-neutral-50 to-orange-50 px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-neutral-700">
                  Lọc theo ngày:
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onChangeDate?.(e.target.value)}
                  className="border border-orange-300 rounded-lg px-3 py-1 text-sm bg-white shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-orange-500"
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
                <span className="text-sm font-medium text-neutral-700">
                  Sắp xếp:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-orange-300 rounded-lg px-3 py-1 text-sm bg-white shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="date">Theo ngày</option>
                  <option value="time">Theo thời gian</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-neutral-600">
              {sortedBookings.length > 0 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                  {sortedBookings.length} đơn đặt bàn
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-neutral-500">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : sortedBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <svg
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Chưa có đơn đặt bàn nào
              </h3>
              <p className="text-neutral-500">
                Bàn này chưa có đơn đặt bàn nào trong hệ thống.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-neutral-700">
                  <div className="flex items-center gap-2 text-left">
                    <svg
                      className="h-4 w-4 text-orange-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Tên Khách Hàng</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <svg
                      className="h-4 w-4 text-orange-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>Số Điện Thoại</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <svg
                      className="h-4 w-4 text-orange-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Email</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 text-orange-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Số Người</span>
                  </div>
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 text-orange-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Thời Gian</span>
                    </div>
                </div>
              </div>

              {/* Danh sách booking */}
              <div className="space-y-3">
                {sortedBookings.map((booking, index) => {
                  return (
                    <div
                      key={booking.id}
                      className="bg-gradient-to-r from-white to-orange-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-200 hover:border-orange-300"
                    >
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="font-medium text-neutral-900 text-sm text-left truncate">
                          {booking.customerName}
                        </div>
                        <div className="text-neutral-600 text-sm text-left truncate">
                          {booking.phone || "-"}
                        </div>
                        <div className="text-neutral-600 text-sm text-left truncate">
                          {booking.email || "-"}
                        </div>
                        <div className="flex justify-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                            {booking.seat} người
                          </span>
                        </div>
                        <div className="text-neutral-600 text-sm font-medium flex justify-center">
                          {formatHourMinute(booking.bookingDate)} -{" "}
                          {formatHourMinute(
                            addHoursToDate(booking.bookingDate, 2)
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
