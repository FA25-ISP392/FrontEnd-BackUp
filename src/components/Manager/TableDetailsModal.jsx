import { X, Clock, CheckCircle } from "lucide-react";

export default function TableDetailsModal({
  selectedTable,
  setSelectedTable,
  updateOrderStatus,
}) {
  if (!selectedTable) return null;

  const handleStatusChange = (itemIndex, newStatus) => {
    const updatedOrder = {
      ...selectedTable.currentOrder,
      items: selectedTable.currentOrder.items.map((item, index) =>
        index === itemIndex ? { ...item, status: newStatus } : item
      ),
    };

    updateOrderStatus(selectedTable.id, updatedOrder);
    setSelectedTable({ ...selectedTable, currentOrder: updatedOrder });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Chi Tiết Bàn {selectedTable.number}
              </h2>
              <p className="text-orange-100 mt-1">
                Quản lý đơn hàng và trạng thái món ăn
              </p>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {selectedTable.currentOrder && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Đơn Hàng Hiện Tại
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <div className="space-y-4">
                  {selectedTable.currentOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 shadow-sm border border-orange-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-neutral-900">
                          {item.name}
                        </h4>
                        <span className="text-lg font-bold text-orange-600">
                          ${item.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-neutral-600">
                          Số lượng: {item.quantity}
                        </span>
                        <span className="text-sm text-neutral-600">
                          Ghi chú: {item.notes || "Không có"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Trạng thái:
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(index, "pending")}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              item.status === "pending"
                                ? "bg-yellow-500 text-white shadow-md"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            }`}
                          >
                            <Clock className="h-4 w-4 inline mr-1" />
                            Chờ
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(index, "preparing")
                            }
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              item.status === "preparing"
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            <Clock className="h-4 w-4 inline mr-1" />
                            Chuẩn Bị
                          </button>
                          <button
                            onClick={() => handleStatusChange(index, "ready")}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              item.status === "ready"
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            Xong
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-neutral-900">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      ${selectedTable.currentOrder.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Lịch Sử Đơn Hàng
            </h3>
            <div className="space-y-4">
              {selectedTable.orderHistory.map((order, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-neutral-900">
                      Đơn #{order.id} - {order.date}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ${order.total}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {order.items.length} món • {order.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
