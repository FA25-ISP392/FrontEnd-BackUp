import { Table, Eye, Clock, CheckCircle, XCircle } from "lucide-react";

export default function TablesManagement({
  tables,
  selectedTable,
  setSelectedTable,
  updateOrderStatus,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Table className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Quản Lý Bàn
            </h3>
            <p className="text-sm text-neutral-600">
              Theo dõi trạng thái và đơn hàng của các bàn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group cursor-pointer ${
              selectedTable?.id === table.id ? "ring-2 ring-orange-500" : ""
            }`}
            onClick={() => setSelectedTable(table)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Table className="h-5 w-5 text-orange-600" />
                <span className="font-bold text-neutral-900">
                  Bàn {table.number}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.status === "occupied"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {table.status === "occupied" ? "Có khách" : "Trống"}
              </span>
            </div>

            {table.status === "occupied" && table.currentOrder ? (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Đơn hiện tại
                </h4>
                <div className="space-y-2">
                  {table.currentOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-neutral-700">{item.name}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "preparing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.status === "pending"
                          ? "Chờ"
                          : item.status === "preparing"
                          ? "Chuẩn bị"
                          : "Xong"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-900">
                    Tổng: ${table.currentOrder.total}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTable(table);
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Table className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-neutral-500 font-medium">Bàn trống</p>
                <p className="text-sm text-neutral-400">Chưa có đơn hàng</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
