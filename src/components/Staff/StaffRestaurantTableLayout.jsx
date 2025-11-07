import {
  getTableStatusClass,
  getCapacityLabel,
  buildPositions,
} from "./staffUtils";

export default function StaffRestaurantTableLayout({
  tables,
  onTableClick,
  selectedTable,
}) {
  return (
    <div className="relative w-full h-[60vh] bg-black/20 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/10">
      <div className="absolute inset-y-0 left-0 w-6 bg-green-900/50 rounded-r-md shadow-md">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-white font-bold text-sm tracking-wider whitespace-nowrap">
          Cửa Vào
        </span>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/5 h-16 bg-black/30 rounded-t-xl shadow-md flex items-center justify-center border border-white/10">
        <span className="font-semibold text-neutral-300">Khu Vực Bếp</span>
      </div>

      {buildPositions(tables.length).map((stylePos, index) => {
        const table = tables[index];
        if (!table) return null;
        return (
          <button
            key={table.id}
            onClick={() => onTableClick(table)}
            //===== Gọi ra hàm getTableStatusClass để hiển thị màu sắc =====
            className={`absolute w-24 h-24 rounded-xl transform transition-all duration-300 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-2xl
            ${getTableStatusClass(table.status)} 
            ${
              selectedTable?.id === table.id
                ? "ring-4 ring-blue-400 shadow-blue-500/30 ring-offset-2 ring-offset-gray-900 scale-105"
                : "border-2"
            }
            ${
              table.callStaff || table.callPayment
                ? "animate-pulse-strong ring-4 ring-red-500"
                : ""
            }
          `}
            style={stylePos}
          >
            <span className="text-3xl font-bold text-white shadow-text">
              {table.number}
            </span>
            {false && table.guests > 0 && table.status !== "empty" && (
              <span className="text-xs font-medium text-white bg-black/20 px-2 py-0.5 rounded-full mt-1">
                {table.guests} K
              </span>
            )}
            {getCapacityLabel(table.number) && (
              <span className="text-[11px] font-medium text-white/95 bg-black/15 px-2 py-0.5 rounded-full mt-1">
                {getCapacityLabel(table.number)}
              </span>
            )}
          </button>
        );
      })}

      <div className="absolute bottom-3 left-6 px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 shadow-sm text-[12px] text-neutral-300">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-700/60"></span>
            <span>Xanh: bàn trống</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-yellow-700/60"></span>
            <span>Vàng: đã đặt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-700/60"></span>
            <span>Đỏ: có khách</span>
          </div>
        </div>
      </div>
    </div>
  );
}
