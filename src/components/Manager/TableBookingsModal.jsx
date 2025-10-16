import { X, Calendar, Users, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { fmtVNDateTime } from "../../lib/datetimeBooking";

export default function TableBookingsModal({
  isOpen,
  onClose,
  table,
  bookings = [],
}) {
  const [sortedBookings, setSortedBookings] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // "date" hoặc "time"

  useEffect(() => {
    console.log("TableBookingsModal - table:", table);
    console.log("TableBookingsModal - bookings:", bookings);
    
    if (table && bookings.length > 0) {
      // Lọc các booking thuộc bàn này - mở rộng điều kiện lọc
      const tableBookings = bookings.filter(booking => {
        const tableId = table.id;
        const tableNumber = table.number || table.tableNumber;
        
        return (
          booking.assignedTableId === tableId || 
          booking.preferredTable === tableNumber ||
          booking.preferredTable === tableId ||
          booking.tableId === tableId ||
          booking.tableNumber === tableNumber
        );
      });

      console.log("TableBookingsModal - filtered bookings:", tableBookings);

      // Sắp xếp theo ngày hoặc thời gian
      const sorted = [...tableBookings].sort((a, b) => {
        const dateA = new Date(a.bookingDate);
        const dateB = new Date(b.bookingDate);
        
        if (sortBy === "date") {
          // Sắp xếp theo ngày (ngày trước, giờ sau)
          const dateCompare = dateA.toDateString().localeCompare(dateB.toDateString());
          if (dateCompare !== 0) return dateCompare;
          return dateA.getTime() - dateB.getTime();
        } else {
          // Sắp xếp theo thời gian
          return dateA.getTime() - dateB.getTime();
        }
      });

      setSortedBookings(sorted);
    } else {
      setSortedBookings([]);
    }
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-orange-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Thông tin bàn {table.number || table.tableNumber || table.id}
              </h3>
              <p className="text-sm text-neutral-600">
                Sức chứa: {table.capacity || table.seatTable || table.seats || table.seat} chỗ ngồi
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-neutral-300 rounded-lg px-3 py-1 text-sm bg-white shadow-sm hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="date">Theo ngày</option>
                <option value="time">Theo thời gian</option>
              </select>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-0">

          {/* Bookings List */}
          {sortedBookings.length === 0 ? (
            <div className="p-6 text-neutral-500 text-center">
              Chưa có đơn đặt bàn nào cho bàn này.
            </div>
          ) : (
            <div className="bg-white/80 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Header của bảng */}
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-neutral-700">
                  <div>Tên Khách Hàng</div>
                  <div>Số Điện Thoại</div>
                  <div>Email</div>
                  <div>Số Người</div>
                  <div>Thời Gian</div>
                </div>
              </div>

              {/* Danh sách booking */}
              <div className="divide-y divide-neutral-200">
                {sortedBookings.map((booking) => {
                  return (
                    <div key={booking.id} className="px-6 py-4 hover:bg-neutral-50">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="font-medium text-neutral-900 text-sm">
                          {booking.customerName}
                        </div>
                        <div className="text-neutral-600 text-sm">
                          {booking.phone || "-"}
                        </div>
                        <div className="text-neutral-600 text-sm">
                          {booking.email || "-"}
                        </div>
                        <div className="text-neutral-600 text-center text-sm">
                          <span className="font-medium">{booking.seat}</span>
                        </div>
                        <div className="text-neutral-600 text-sm">
                          {fmtVNDateTime(booking.bookingDate)}
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
