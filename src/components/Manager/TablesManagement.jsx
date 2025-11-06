import { Table } from "lucide-react";

export default function TablesManagement({
  tables,
  selectedTable,
  setSelectedTable,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
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
                  table.status === "serving"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : table.status === "reserved"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {table.status === "serving"
                  ? "Đang phục vụ"
                  : table.status === "reserved"
                  ? "Đã đặt"
                  : "Trống"}
              </span>
            </div>

            {table.status === "serving" && table.currentOrder ? (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4"></div>
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
