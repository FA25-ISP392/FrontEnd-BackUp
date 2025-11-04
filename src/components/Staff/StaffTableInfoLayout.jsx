import { Users } from "lucide-react";
import { getTableStatusBadge, getTableStatusText } from "./staffUtils";

export default function StaffTableInfoLayout({
  tables,
  onTableClick,
  selectedTable,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h2 className="text-xl font-bold text-white mb-4">Danh Sách Bàn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onTableClick(table)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200
              ${
                selectedTable?.id === table.id
                  ? "ring-4 ring-blue-400 shadow-blue-500/30 ring-offset-2 ring-offset-gray-900 scale-105 shadow-xl"
                  : "hover:shadow-md hover:scale-[1.02] hover:border-white/20"
              }
              ${
                table.status === "serving"
                  ? "bg-red-900/30 border-red-500/30"
                  : table.status === "empty"
                  ? "bg-green-900/30 border-green-500/30"
                  : table.status === "reserved"
                  ? "bg-yellow-900/30 border-orange-500/30"
                  : "bg-gray-900/30 border-gray-500/30"
              }
              ${
                table.callStaff || table.callPayment
                  ? "animate-pulse-strong ring-4 ring-red-500"
                  : ""
              }
            `}
          >
            {table.callPayment && (
              <span className="absolute top-2 right-2 flex items-center justify-center h-6 w-6 bg-green-500 text-white text-xs font-bold rounded-full border-2 border-white shadow-sm">
                VND
              </span>
            )}

            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg text-white">
                Bàn {table.number}
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium text-white rounded-full ${getTableStatusBadge(
                  table.status
                )}`}
              >
                {getTableStatusText(table.status)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Users className="h-4 w-4" />
              <span>
                {table.status === "empty"
                  ? "Chưa có khách"
                  : table.guests > 0
                  ? `${table.guests} khách`
                  : "Đang có khách"}
              </span>
            </div>
            {table.status === "reserved" && table.orderTime && (
              <div className="text-left text-sm text-orange-300 font-medium mt-2">
                Đặt lúc: {table.orderTime}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
