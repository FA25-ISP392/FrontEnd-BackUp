import React from "react";
import { Table, Phone } from "lucide-react";

export default function StaffTableInfoLayout({
  tables,
  onTableClick,
  selectedTable,
  orders = [],
}) {
  const VND = (n = 0) =>
    Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

  const getTableStatusColor = (table) => {
    if (table.callStaff) return "border-red-500 bg-red-50";
    if (table.callPayment) return "border-green-500 bg-green-50";

    switch (table.status) {
      case "serving":
        return "border-red-500 bg-red-50";
      case "empty":
        return "border-green-500 bg-green-50";
      case "reserved":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getTableStatusText = (status) => {
    switch (status) {
      case "serving":
        return "Đang phục vụ";
      case "empty":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      default:
        return "Không rõ";
    }
  };

  const getTableTopClasses = (table) => {
    const pulse = table.status === "serving" ? "animate-pulse" : "";
    switch (table.status) {
      case "serving":
        return `from-red-50 to-red-100 border-red-400 text-red-700 ${pulse}`;
      case "reserved":
        return `from-yellow-50 to-yellow-100 border-yellow-400 text-yellow-700`;
      default:
        return `from-green-50 to-green-100 border-green-400 text-green-700`;
    }
  };

  const getTableTopLabel = (table) => {
    if (table.status === "serving") return "Có khách";
    if (table.status === "reserved") return "Đã đặt";
    return "Trống";
  };

  const getTableTopLabelText = (table) => {
    if (table.status === "serving") return "text-red-700";
    if (table.status === "reserved") return "text-yellow-700";
    return "text-green-700";
  };

  const getOrderForTable = (num) =>
    orders.find((o) => Number(o.table) === Number(num));

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Sơ đồ bàn nhà hàng
        </h3>
        <p className="text-sm text-neutral-600">
          Nhấp vào bàn để xem thông tin chi tiết
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {tables.map((table) => {
          const order = getOrderForTable(table.number);
          const isSelected = selectedTable && selectedTable.id === table.id;

          return (
            <div
              key={table.id}
              className={`bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer transform hover:scale-105 relative ${getTableStatusColor(
                table
              )} ${
                isSelected ? "ring-2 ring-orange-500 shadow-orange-200" : ""
              }`}
              onClick={() => onTableClick?.(table)}
            >
              {table.callStaff && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-white" />
                </div>
              )}
              {table.callPayment && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[11px] leading-none font-bold">
                    VND
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Table className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="font-bold text-neutral-900 text-lg">
                    Bàn {table.number}
                  </span>
                </div>

                <div
                  className={`relative rounded-2xl border-2 bg-gradient-to-br shadow-inner
              ${getTableTopClasses(table)} min-h-28`}
                  title={`Bàn ${table.number} - ${getTableStatusText(
                    table.status
                  )}`}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/40" />
                  <span
                    className={`absolute inset-0 flex items-center justify-center 
                    font-extrabold tracking-wide uppercase text-sm md:text-base
                    ${getTableTopLabelText(table)}`}
                  >
                    {getTableTopLabel(table)}
                  </span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full bg-black/10" />
                </div>

                <div className="mt-3">
                  <span className="text-xs font-medium text-neutral-600">
                    {getTableStatusText(table.status)}
                  </span>
                </div>

                {table.callPayment && (
                  <div className="mt-2 text-xs font-semibold text-green-700">
                    Đang yêu cầu thanh toán
                  </div>
                )}

                {order && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs font-medium text-blue-800">
                      Đơn #{order.id ?? order.orderId}
                    </div>
                    <div className="text-xs text-blue-600">
                      {order.total ? VND(order.total) : ""}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-center text-sm font-semibold text-gray-800 mb-3">
          Chú thích:
        </h3>

        <div className="flex justify-center items-center gap-8 flex-wrap">
          {/* Trống */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 border-2 border-green-500 rounded-md"></div>
            <span className="text-green-700 text-sm font-medium">Trống</span>
          </div>

          {/* Đang phục vụ */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 border-2 border-red-500 rounded-md"></div>
            <span className="text-red-700 text-sm font-medium">
              Đang phục vụ
            </span>
          </div>

          {/* Đã đặt */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 border-2 border-yellow-500 rounded-md"></div>
            <span className="text-yellow-700 text-sm font-medium">Đã đặt</span>
          </div>

          {/* Gọi thanh toán */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 border-2 border-green-500 rounded-md relative flex items-center justify-center">
              <span className="text-[10px] text-green-700 font-bold leading-none">
                VND
              </span>
            </div>
            <span className="text-green-700 text-sm font-medium">
              Gọi thanh toán
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
