import { Users } from "lucide-react";
import { getTableStatusBadge, getTableStatusText } from "./staffUtils";

export default function StaffTableInfoLayout({
  tables,
  onTableClick,
  selectedTable,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-xl font-semibold mb-4">Danh Sách Bàn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onTableClick(table)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200
              ${
                selectedTable?.id === table.id
                  ? "ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-xl"
                  : "hover:shadow-md hover:scale-[1.02]"
              }
              ${
                table.status === "serving"
                  ? "bg-red-50 border-red-200"
                  : table.status === "empty"
                  ? "bg-green-50 border-green-200"
                  : table.status === "reserved"
                  ? "bg-yellow-50 border-orange-200"
                  : "bg-gray-50 border-gray-200"
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
              <span className="font-bold text-lg text-neutral-800">
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
            <div className="flex items-center gap-2 text-sm text-neutral-600">
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
              <div className="text-left text-sm text-orange-600 font-medium mt-2">
                Đặt lúc: {table.orderTime}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
