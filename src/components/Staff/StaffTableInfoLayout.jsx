import React from "react";
import { Table, Phone, DollarSign } from "lucide-react";

export default function StaffTableInfoLayout({ 
  tables, 
  onTableClick, 
  selectedTable,
  orders = [] 
}) {
  const getTableStatusColor = (table) => {
    // Kiểm tra nếu khách hàng gọi nhân viên
    if (table.callStaff) {
      return "border-red-500 bg-red-50";
    }
    // Kiểm tra nếu khách hàng gọi thanh toán (giả sử có thuộc tính callPayment)
    if (table.callPayment) {
      return "border-green-500 bg-green-50";
    }
    
    // Màu sắc theo trạng thái bàn
    switch (table.status) {
      case "occupied":
        return "border-blue-500 bg-blue-50";
      case "available":
        return "border-green-500 bg-green-50";
      case "reserved":
        return "border-yellow-500 bg-yellow-50";
      case "cleaning":
        return "border-purple-500 bg-purple-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getTableStatusText = (status) => {
    switch (status) {
      case "occupied":
        return "Đang phục vụ";
      case "available":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      case "cleaning":
        return "Đang dọn";
      default:
        return status;
    }
  };

  const getOrderForTable = (tableNumber) => {
    return orders.find(order => order.table === tableNumber);
  };

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
              className={`bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer transform hover:scale-105 relative ${getTableStatusColor(table)} ${
                isSelected
                  ? "ring-2 ring-orange-500 shadow-orange-200"
                  : ""
              }`}
              onClick={() => onTableClick?.(table)}
            >
              {/* Icon gọi nhân viên */}
              {table.callStaff && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-white" />
                </div>
              )}
              
              {/* Icon gọi thanh toán */}
              {table.callPayment && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
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

                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 border border-orange-300">
                  <div className="text-3xl font-bold text-orange-800 mb-1">
                    {table.guests || 0}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">
                    khách
                  </div>
                </div>

                {/* Hiển thị trạng thái */}
                <div className="mt-3">
                  <span className="text-xs font-medium text-neutral-600">
                    {getTableStatusText(table.status)}
                  </span>
                </div>

                {/* Hiển thị thông tin order nếu có */}
                {order && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs font-medium text-blue-800">
                      Đơn #{order.id}
                    </div>
                    <div className="text-xs text-blue-600">
                      ${order.total}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chú thích */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="text-sm font-semibold text-gray-800 mb-3">Chú thích:</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span className="text-green-800 font-medium">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span className="text-blue-800 font-medium">Đang phục vụ</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded relative">
                <Phone className="h-3 w-3 text-red-500 absolute top-0.5 right-0.5" />
              </div>
              <span className="text-red-800 font-medium">Gọi nhân viên</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded relative">
                <DollarSign className="h-3 w-3 text-green-500 absolute top-0.5 right-0.5" />
              </div>
              <span className="text-green-800 font-medium">Gọi thanh toán</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
