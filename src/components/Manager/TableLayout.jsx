// components/Manager/TableLayout.jsx
import { Table } from "lucide-react";

export default function TableLayout({
  tables = [],
  onTableClick,
  selectedTableId,
}) {
  const list = [...tables].sort(
    (a, b) => (a.number || a.id) - (b.number || b.id)
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Sơ đồ bàn nhà hàng
        </h3>
        <p className="text-sm text-neutral-600">
          Nhấp vào bàn để xem thông tin chi tiết
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {list.map((table) => {
          const number = table.number ?? table.tableNumber ?? table.id;
          const capacity =
            table.capacity ?? table.seatTable ?? table.seats ?? table.seat ?? 0;

          return (
            <div
              key={table.id}
              className={`bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200 group cursor-pointer transform hover:scale-105 ${
                selectedTableId === table.id
                  ? "ring-2 ring-orange-500 shadow-orange-200"
                  : ""
              }`}
              onClick={() => onTableClick?.(table.id)}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Table className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="font-bold text-neutral-900 text-lg">
                    Bàn {number}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 border border-orange-300">
                  <div className="text-3xl font-bold text-orange-800 mb-1">
                    {capacity}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">
                    chỗ ngồi
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
