import { Table, Users, Clock, Phone, Calendar } from "lucide-react";

export default function TableLayout({ tables, onTableClick, selectedTableId, bookings = [] }) {
  // Tạo danh sách 8 bàn cố định theo yêu cầu
  const defaultTables = [
    { id: 1, number: 1, capacity: 2, status: "available" },
    { id: 2, number: 2, capacity: 2, status: "available" },
    { id: 3, number: 3, capacity: 4, status: "available" },
    { id: 4, number: 4, capacity: 4, status: "available" },
    { id: 5, number: 5, capacity: 6, status: "available" },
    { id: 6, number: 6, capacity: 6, status: "available" },
    { id: 7, number: 7, capacity: 8, status: "available" },
    { id: 8, number: 8, capacity: 8, status: "available" },
  ];

  // Merge với dữ liệu từ props nếu có
  const mergedTables = defaultTables.map(defaultTable => {
    const existingTable = tables.find(t => t.id === defaultTable.id);
    return existingTable ? { ...defaultTable, ...existingTable } : defaultTable;
  });

  const getTableStatus = (tableId) => {
    const table = mergedTables.find(t => t.id === tableId);
    if (!table) return "available";
    return table.status || "available";
  };

  const getTableBooking = (tableId) => {
    // Tìm booking đã được gán cho bàn này
    const booking = bookings.find(b => b.assignedTableId === tableId && b.status === "APPROVED");
    return booking;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Table className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sơ Đồ Bàn
          </h3>
          <p className="text-sm text-neutral-600">
            Tổng quan trạng thái các bàn trong nhà hàng (8 bàn)
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-neutral-50 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-neutral-600">Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-neutral-600">Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-neutral-600">Có khách</span>
        </div>
      </div>

      {/* Grid Layout với 8 bàn */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {mergedTables.map((table) => {
          const status = getTableStatus(table.id);
          const booking = getTableBooking(table.id);
          
          return (
            <div
              key={table.id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group cursor-pointer ${
                selectedTableId === table.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onTableClick(table.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4 text-blue-600" />
                  <span className="font-bold text-neutral-900">
                    Bàn {table.number}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === "occupied"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : status === "reserved"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {status === "occupied" ? "Có khách" : status === "reserved" ? "Đã đặt" : "Trống"}
                </span>
              </div>

              <div className="text-center mb-3">
                <div className="text-sm text-neutral-600 mb-1">
                  {table.capacity} người
                </div>
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                  status === "occupied"
                    ? "bg-red-100"
                    : status === "reserved"
                    ? "bg-yellow-100"
                    : "bg-green-100"
                }`}>
                  <div className={`w-4 h-4 rounded-full ${
                    status === "occupied"
                      ? "bg-red-500"
                      : status === "reserved"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}></div>
                </div>
              </div>

              {booking ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-1">
                    <Users className="h-3 w-3 text-neutral-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-neutral-700 font-medium break-words" title={booking.customerName}>
                        {booking.customerName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <Calendar className="h-3 w-3 text-neutral-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-neutral-600 break-words" title={formatDateTime(booking.bookingDate)}>
                        {formatDateTime(booking.bookingDate)}
                      </div>
                    </div>
                  </div>
                  {booking.phone && (
                    <div className="flex items-start gap-1">
                      <Phone className="h-3 w-3 text-neutral-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-neutral-500 break-words" title={booking.phone}>
                          {booking.phone}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                      {booking.seat} người
                    </span>
                  </div>
                  {booking.email && (
                    <div className="text-center">
                      <div className="text-neutral-400 text-xs break-words" title={booking.email}>
                        {booking.email}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-neutral-500 text-sm font-medium">
                    {status === "available" ? "Bàn trống" : "Chưa có thông tin"}
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
