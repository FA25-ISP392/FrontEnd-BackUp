// components/Manager/TableLayout.jsx
import { Table, Users, Phone, Calendar } from "lucide-react";

export default function TableLayout({
  tables = [],
  onTableClick,
  selectedTableId,
  bookings = [],
}) {
  const getTableStatus = (table) => {
    const reserved = bookings.some(
      (b) => b.assignedTableId === table.id && b.status === "APPROVED"
    );
    if (reserved) return "reserved";

    const s = String(table.status || "").toLowerCase();
    if (["empty", "reserved", "serving"].includes(s)) return s;

    if (typeof table.isAvailable === "boolean")
      return table.isAvailable ? "empty" : "serving";

    return "empty";
  };

  const getTableBooking = (tableId) =>
    bookings.find(
      (b) => b.assignedTableId === tableId && b.status === "APPROVED"
    );

  const formatDateTime = (v) =>
    v
      ? new Date(v).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const list = [...tables].sort(
    (a, b) => (a.number || a.id) - (b.number || b.id)
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
      <div className="flex items-center gap-6 mb-6 p-4 bg-neutral-50 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-neutral-600">Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-sm text-neutral-600">Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-sm text-neutral-600">Đang phục vụ</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {list.map((table) => {
          const status = getTableStatus(table);
          const booking = getTableBooking(table.id);
          const number = table.number ?? table.tableNumber ?? table.id;
          const capacity =
            table.capacity ?? table.seatTable ?? table.seats ?? table.seat ?? 0;

          const badgeClass =
            status === "serving"
              ? "bg-red-100 text-red-800 border border-red-200"
              : status === "reserved"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : "bg-green-100 text-green-800 border border-green-200";

          const dotWrap =
            status === "serving"
              ? "bg-red-100"
              : status === "reserved"
              ? "bg-yellow-100"
              : "bg-green-100";

          const dot =
            status === "serving"
              ? "bg-red-500"
              : status === "reserved"
              ? "bg-yellow-500"
              : "bg-green-500";

          return (
            <div
              key={table.id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group cursor-pointer ${
                selectedTableId === table.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onTableClick?.(table.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4 text-blue-600" />
                  <span className="font-bold text-neutral-900">
                    Bàn {number}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                >
                  {status === "serving"
                    ? "Đang phục vụ"
                    : status === "reserved"
                    ? "Đã đặt"
                    : "Trống"}
                </span>
              </div>

              <div className="text-center mb-3">
                <div className="text-sm text-neutral-600 mb-1">
                  {capacity} người
                </div>
                <div
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${dotWrap}`}
                >
                  <div className={`w-4 h-4 rounded-full ${dot}`} />
                </div>
              </div>

              {booking ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-1">
                    <Users className="h-3 w-3 text-neutral-500 mt-0.5" />
                    <div className="min-w-0">
                      <div
                        className="text-neutral-700 font-medium break-words"
                        title={booking.customerName}
                      >
                        {booking.customerName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <Calendar className="h-3 w-3 text-neutral-500 mt-0.5" />
                    <div className="min-w-0">
                      <div
                        className="text-neutral-600 break-words"
                        title={formatDateTime(booking.bookingDate)}
                      >
                        {formatDateTime(booking.bookingDate)}
                      </div>
                    </div>
                  </div>
                  {booking.phone && (
                    <div className="flex items-start gap-1">
                      <Phone className="h-3 w-3 text-neutral-500 mt-0.5" />
                      <div className="min-w-0">
                        <div
                          className="text-neutral-500 break-words"
                          title={booking.phone}
                        >
                          {booking.phone}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-neutral-500 text-sm font-medium">
                    {status === "empty" ? "Bàn trống" : "Chưa có thông tin"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
