import { X, Table, Users } from "lucide-react";
import { getTableStatusBadge, getTableStatusText } from "./staffUtils";

export default function StaffTableDetailModal({
  table,
  onClose,
  onOpenPayment,
}) {
  if (!table) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Chi Tiết Bàn {table.number}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getTableStatusBadge(
                  table.status
                )}`}
              >
                {table.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold">Bàn {table.number}</h3>
                <p className="text-neutral-600">
                  {getTableStatusText(table.status)}
                </p>
                {table.guests > 0 && (
                  <p className="text-sm text-neutral-500">
                    {table.guests} khách
                  </p>
                )}
              </div>
            </div>

            {table.status === "empty" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Table className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-800 mb-2">
                  Bàn Trống
                </h4>
                <p className="text-green-600">
                  Bàn sẵn sàng phục vụ khách hàng mới.
                </p>
              </div>
            ) : table.status === "reserved" ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800">
                      Thông Tin Đặt Bàn
                    </h4>
                    <p className="text-orange-600">Khách hàng đã đặt bàn này</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-600 font-medium">
                      Số khách
                    </p>
                    <p className="font-bold text-orange-800 text-lg">
                      {table.guests} người
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-600 font-medium">
                      Thời gian đặt
                    </p>
                    <p className="font-bold text-orange-800">
                      {table.orderTime || "Chưa xác định"}
                    </p>
                  </div>
                </div>
              </div>
            ) : table.status === "serving" ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-800">
                      Đang Phục Vụ
                    </h4>
                    <p className="text-red-600">Khách hàng đang dùng bữa</p>
                  </div>
                </div>
                {table.callStaff && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-800">
                        Khách đang cần hỗ trợ
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">Không rõ trạng thái.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onOpenPayment}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
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
