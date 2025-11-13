import { X, Table, Users } from "lucide-react";
import { getTableStatusBadge, getTableStatusText } from "./staffUtils";

export default function StaffTableDetailModal({
  table,
  onClose,
  onOpenPayment,
}) {
  if (!table) return null;

  //--------------------------

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            Chi Tiết Bàn {table.number}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition text-neutral-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${getTableStatusBadge(
                  table.status
                )}`}
              >
                {table.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Bàn {table.number}
                </h3>
                <p className="text-neutral-300">
                  {getTableStatusText(table.status)}
                </p>
                {table.guests > 0 && (
                  <p className="text-sm text-neutral-400">
                    {table.guests} khách
                  </p>
                )}
              </div>
            </div>

            {table.status === "empty" ? (
              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Table className="h-8 w-8 text-green-300" />
                </div>
                <h4 className="text-lg font-semibold text-green-200 mb-2">
                  Bàn Trống
                </h4>
                <p className="text-green-300">
                  Bàn sẵn sàng phục vụ khách hàng mới.
                </p>
              </div>
            ) : table.status === "reserved" ? (
              <div className="bg-yellow-900/30 border border-orange-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-orange-200">
                      Thông Tin Đặt Bàn
                    </h4>
                    <p className="text-orange-300">Khách hàng đã đặt bàn này</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                    <p className="text-sm text-orange-300 font-medium">
                      Khách hàng
                    </p>
                    <p className="font-bold text-orange-200 text-lg truncate">
                      {table.bookingInfo?.customerName || "Đang tải..."}
                    </p>
                  </div>

                  <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                    <p className="text-sm text-orange-300 font-medium">
                      Số điện thoại
                    </p>
                    <p className="font-bold text-orange-200 text-lg">
                      {table.bookingInfo?.customerPhone || "Không rõ"}
                    </p>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                    <p className="text-sm text-orange-300 font-medium">
                      Số khách
                    </p>
                    <p className="font-bold text-orange-200 text-lg">
                      {table.guests} người
                    </p>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                    <p className="text-sm text-orange-300 font-medium">
                      Thời gian đặt
                    </p>
                    <p className="font-bold text-orange-200">
                      {table.orderTime || "Chưa xác định"}
                    </p>
                  </div>
                </div>
              </div>
            ) : table.status === "serving" ? (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-red-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-200">
                      Đang Phục Vụ
                    </h4>
                    <p className="text-red-300">Khách hàng đang dùng bữa</p>
                  </div>
                </div>
                {table.callStaff && (
                  <div className="mt-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-200">
                        Khách đang cần hỗ trợ
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-700/30 border border-gray-500/30 rounded-lg p-6 text-center">
                <p className="text-gray-300">Không rõ trạng thái.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3 p-4 border-t border-white/10">
            <button
              onClick={onOpenPayment}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <span className="font-bold text-sm">VND</span>
              Xử Lý Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
