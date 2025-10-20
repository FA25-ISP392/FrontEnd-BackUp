import { Clock, ChefHat, CheckCircle } from "lucide-react";

export default function OrdersManagement({ orders, updateOrderStatus }) {
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const preparingOrders = orders.filter(
    (order) => order.status === "preparing",
  );
  const readyOrders = orders.filter((order) => order.status === "ready");

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <ChefHat className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Quản Lý Đơn Hàng
          </h3>
          <p className="text-sm text-neutral-600">
            Theo dõi và cập nhật trạng thái đơn hàng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-yellow-700">Đơn Chờ</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-yellow-600" />
                      <span className="font-bold text-neutral-900">
                        Bàn {order.table}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.priority === "high"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : order.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {order.priority === "high"
                        ? "Ưu tiên cao"
                        : order.priority === "medium"
                        ? "Ưu tiên trung bình"
                        : "Ưu tiên thấp"}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      {order.dish}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="h-4 w-4" />
                      <span>{order.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Bắt Đầu Chuẩn Bị
                  </button>
                </div>
              ))}
              {pendingOrders.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-neutral-500 font-medium">
                    Không có đơn chờ
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Tất cả đơn đã được xử lý
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preparing Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <ChefHat className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-700">Đang Chuẩn Bị</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-neutral-900">
                        Bàn {order.table}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      Đang chuẩn bị
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      {order.dish}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="h-4 w-4" />
                      <span>{order.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Hoàn Thành
                  </button>
                </div>
              ))}
              {preparingOrders.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-neutral-500 font-medium">
                    Không có đơn đang chuẩn bị
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Tất cả đơn đã hoàn thành
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ready Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-700">Sẵn Sàng</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-neutral-900">
                        Bàn {order.table}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Sẵn sàng
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      {order.dish}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="h-4 w-4" />
                      <span>{order.time}</span>
                    </div>
                  </div>
                  <div className="text-center py-2">
                    <span className="text-sm text-green-600 font-medium">
                      Đã hoàn thành
                    </span>
                  </div>
                </div>
              ))}
              {readyOrders.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-neutral-500 font-medium">
                    Không có đơn sẵn sàng
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Chờ đơn hàng mới
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
