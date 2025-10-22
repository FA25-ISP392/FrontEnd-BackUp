import {
  Clock,
  ChefHat,
  CheckCircle,
  Loader,
  AlertTriangle,
  Package, // Icon cho Topping
} from "lucide-react";

export default function OrdersManagement({
  pendingOrders,
  preparingOrders,
  readyOrders,
  onUpdateStatus,
  isLoading,
  error,
}) {
  if (isLoading && !pendingOrders.length && !preparingOrders.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/50 rounded-2xl shadow-lg h-96">
        <Loader className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-neutral-700">
          Đang tải đơn hàng...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-2xl shadow-lg border border-red-200 h-96">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg font-bold text-red-700">Đã xảy ra lỗi</p>
        <p className="text-neutral-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Tải lại
        </button>
      </div>
    );
  }

  // Một component con để render card, tránh lặp code
  const OrderCard = ({ order, statusType }) => {
    const colors = {
      pending: {
        bg: "from-yellow-50 to-orange-50",
        border: "border-yellow-200",
        icon: <ChefHat className="h-5 w-5 text-yellow-600" />,
        toppingBorder: "border-yellow-200",
      },
      preparing: {
        bg: "from-blue-50 to-cyan-50",
        border: "border-blue-200",
        icon: <ChefHat className="h-5 w-5 text-blue-600" />,
        toppingBorder: "border-blue-200",
      },
      ready: {
        bg: "from-green-50 to-emerald-50",
        border: "border-green-200",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        toppingBorder: "border-green-200",
      },
    };
    const c = colors[statusType];

    return (
      <div
        key={order.orderDetailId}
        className={`bg-gradient-to-r ${c.bg} rounded-xl p-4 border ${c.border} hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
      >
        <div>
          {/* HÀNG 1: TÊN MÓN + ID */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {c.icon}
              <span className="font-bold text-neutral-900">
                {order.dishName}
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              #{order.orderDetailId}
            </span>
          </div>

          {/* HÀNG 2: GHI CHÚ */}
          <div className="mb-3">
            <h4 className="font-semibold text-neutral-900 text-sm truncate">
              Ghi chú: {order.note || "Không có"}
            </h4>
          </div>

          {/* HÀNG 3: TOPPINGS */}
          {order.toppings && order.toppings.length > 0 && (
            <div className={`mt-2 pt-2 border-t ${c.toppingBorder} mb-4`}>
              <h5 className="text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                <Package className="h-3 w-3" />
                Toppings:
              </h5>
              <ul className="list-disc list-inside space-y-0.5 pl-1">
                {order.toppings.map((topping) => (
                  <li
                    key={topping.toppingId}
                    className="text-xs text-neutral-600"
                  >
                    {topping.toppingName} (x{topping.quantity})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* HÀNG 4: NÚT BẤM */}
        <div className="mt-auto">
          {statusType === "pending" && (
            <button
              onClick={() => onUpdateStatus(order.orderDetailId, "PREPARING")}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Bắt Đầu Chuẩn Bị
            </button>
          )}
          {statusType === "preparing" && (
            <button
              onClick={() => onUpdateStatus(order.orderDetailId, "SERVED")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Hoàn Thành
            </button>
          )}
          {statusType === "ready" && (
            <div className="text-center py-2">
              <span className="text-sm text-green-600 font-medium">
                Đã hoàn thành
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      {/* Header "Quản Lý Đơn Hàng" */}
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
        {/* =================== CỘT ĐƠN CHỜ =================== */}
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
                <OrderCard
                  key={order.orderDetailId}
                  order={order}
                  statusType="pending"
                />
              ))}
              {pendingOrders.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-neutral-500 font-medium">
                    Không có đơn chờ
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================== CỘT ĐANG CHUẨN BỊ =================== */}
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
                <OrderCard
                  key={order.orderDetailId}
                  order={order}
                  statusType="preparing"
                />
              ))}
              {preparingOrders.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-neutral-500 font-medium">
                    Không có đơn đang chuẩn bị
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================== CỘT SẴN SÀNG =================== */}
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
                <OrderCard
                  key={order.orderDetailId}
                  order={order}
                  statusType="ready"
                />
              ))}
              {readyOrders.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-neutral-500 font-medium">
                    Không có đơn sẵn sàng
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
