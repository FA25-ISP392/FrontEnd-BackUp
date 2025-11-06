import { useState } from "react";
import { X, Table, Users, Clock, Phone, Mail } from "lucide-react";
import { fmtVNDateTime } from "../../lib/datetimeBooking";

export default function TableAssignmentModal({
  isOpen,
  onClose,
  booking,
  tables,
  onAssignTable,
}) {
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [assigning, setAssigning] = useState(false);

  if (!isOpen || !booking) return null;

  const suitableTables = (tables || [])
    .map((t) => ({
      id: t.id,
      name: t.name || `Bàn ${t.number ?? t.id}`,
      capacity: t.capacity ?? t.seatTable ?? t.seat ?? t.seat_table ?? 0,
      status: String(
        t.status || (t.isAvailable ? "empty" : "serving")
      ).toLowerCase(),
    }))
    .filter(
      (t) =>
        (t.capacity || 0) >= (booking.seat || 1) &&
        !["serving", "occupied", "reserved"].includes(t.status)
    );

  const handleAssign = async () => {
    if (!selectedTableId) return;

    setAssigning(true);
    try {
      await onAssignTable(booking.id, selectedTableId);
      onClose();
    } catch (error) {
      console.error("Lỗi khi gán bàn:", error);
      alert("Có lỗi xảy ra khi gán bàn. Vui lòng thử lại.");
    } finally {
      setAssigning(false);
    }
  };

  const getTableStatus = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    return table?.status || "available";
  };

  const getTableColor = (status) => {
    switch (status) {
      case "occupied":
      case "serving":
        return "bg-red-100 border-red-300 text-red-800";
      case "reserved":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default:
        return "bg-green-100 border-green-300 text-green-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Table className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Gán Bàn Cho Đơn Đặt
              </h2>
              <p className="text-sm text-neutral-600">
                Chọn bàn phù hợp cho khách hàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Thông Tin Đơn Đặt Bàn
          </h3>

          <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-600 mb-1">
                      Tên khách hàng
                    </div>
                    <div className="font-semibold text-neutral-900">
                      {booking.customerName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-600 mb-1">
                      Số điện thoại
                    </div>
                    <div className="font-semibold text-neutral-900">
                      {booking.phone || "Chưa có"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-600 mb-1">Email</div>
                    <div className="font-semibold text-neutral-900">
                      {booking.email || "Chưa có"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-600 mb-1">
                      Thời gian đến
                    </div>
                    <div className="font-semibold text-neutral-900">
                      {fmtVNDateTime(booking.bookingDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">Số người</div>
                <div className="text-2xl font-bold text-blue-900">
                  {booking.seat} người
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Chọn Bàn Phù Hợp
          </h3>

          {suitableTables.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                Không có bàn phù hợp
              </h4>
              <p className="text-neutral-600">
                Hiện tại không có bàn nào phù hợp với số lượng {booking.seat}{" "}
                người.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {suitableTables.map((table) => {
                const status = getTableStatus(table.id);
                const isSelected = selectedTableId === table.id;

                return (
                  <div
                    key={table.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-neutral-200 hover:border-blue-300 hover:bg-blue-25"
                    } ${getTableColor(status)}`}
                    onClick={() => setSelectedTableId(table.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-neutral-900">
                        {table.name}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {table.capacity} người
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-neutral-600">
                        Có thể sử dụng
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-2 text-sm font-medium text-blue-700">
                        ✓ Đã chọn
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            disabled={assigning}
          >
            Hủy
          </button>
          <button
            onClick={handleAssign}
            disabled={
              !selectedTableId || assigning || suitableTables.length === 0
            }
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? "Đang gán..." : "Gán Bàn"}
          </button>
        </div>
      </div>
    </div>
  );
}
