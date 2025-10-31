import { getTableStatusClass } from "./staffUtils";

export default function StaffRestaurantTableLayout({
  tables,
  onTableClick,
  selectedTable,
}) {
  const getCapacityLabel = (tableNumber) => {
    if (tableNumber >= 1 && tableNumber <= 2) return "2 khách";
    if (tableNumber >= 3 && tableNumber <= 4) return "4 khách";
    if (tableNumber >= 5 && tableNumber <= 6) return "6 khách";
    if (tableNumber >= 7 && tableNumber <= 8) return "8 khách";
    return null;
  };
  // Build reasonable positions around phòng, tham khảo bố cục ở Home nhưng cho cảm giác ngẫu nhiên có kiểm soát
  const rand01 = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const buildPositions = (count) => {
    const margin = 12; // %
    const bottomReserved = 18; // chừa chỗ cho bếp/ghi chú
    const topY = margin;
    const bottomY = 100 - bottomReserved - margin;
    const leftX = margin;
    const rightX = 100 - margin;

    // Balanced distribution: ~30% top, ~30% bottom, ~20% left, ~20% right
    let nTop = Math.max(1, Math.floor(count * 0.3));
    let nBottom = Math.max(1, Math.floor(count * 0.3));
    let remaining = Math.max(0, count - (nTop + nBottom));
    let nLeft = Math.floor(remaining / 2);
    let nRight = remaining - nLeft;
    // Ensure total equals count
    const totalSides = nTop + nRight + nBottom + nLeft;
    if (totalSides < count) nBottom += count - totalSides;

    const spread = (n, from, to) =>
      Array.from({ length: Math.max(1, n) }, (_, i) => from + ((i + 1) / (n + 1)) * (to - from));
    const edgeSpread = (n, from, to) => {
      if (n <= 0) return [];
      if (n === 1) return [from + (to - from) / 2];
      return Array.from({ length: n }, (_, i) => from + (i / (n - 1)) * (to - from));
    };

    const xSpanFrom = margin + 8;
    const xSpanTo = 100 - margin - 8;
    const ySpanFrom = margin + 14; // đẩy xa nhau hơn ở hai bên
    const ySpanTo = 100 - bottomReserved - margin - 14;

    const topXs = spread(nTop, xSpanFrom, xSpanTo);
    const botXs = spread(nBottom, xSpanFrom, xSpanTo);
    const leftYs = edgeSpread(nLeft, ySpanFrom, ySpanTo);
    const rightYs = edgeSpread(nRight, ySpanFrom, ySpanTo);

    // Interleave: Top -> Right -> Bottom -> Left
    const pos = [];
    let iTop = 0, iRight = 0, iBottom = 0, iLeft = 0;
    while (pos.length < count) {
      if (iTop < nTop) pos.push({ left: `${topXs[iTop++]}%`, top: `${topY}%` });
      if (pos.length >= count) break;
      if (iRight < nRight) pos.push({ left: `${rightX}%`, top: `${rightYs[iRight++]}%` });
      if (pos.length >= count) break;
      if (iBottom < nBottom) pos.push({ left: `${botXs[iBottom++]}%`, top: `${bottomY}%` });
      if (pos.length >= count) break;
      if (iLeft < nLeft) pos.push({ left: `${leftX}%`, top: `${leftYs[iLeft++]}%` });
    }

    // Subtle jitter to look organic but still tidy
    return pos.map((p, idx) => {
      const jitterX = (rand01((idx + 1) * 137) - 0.5) * 2; // +/-1%
      const jitterY = (rand01((idx + 1) * 257) - 0.5) * 2;
      const toNum = (s) => Number(String(s).replace("%", ""));
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const x = clamp(toNum(p.left) + jitterX, margin + 3, 100 - margin - 3);
      const y = clamp(toNum(p.top) + jitterY, margin + 3, 100 - bottomReserved - 3);
      return { left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" };
    });
  };

  return (
    <div className="relative w-full h-[60vh] bg-neutral-50 rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
      <div className="absolute inset-y-0 left-0 w-6 bg-green-700/85 rounded-r-md shadow-md">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-white font-bold text-sm tracking-wider whitespace-nowrap">
          Cửa Vào
        </span>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/5 h-16 bg-neutral-200 rounded-t-xl shadow-md flex items-center justify-center border border-neutral-300/70">
        <span className="font-semibold text-neutral-600">Khu Vực Bếp</span>
      </div>

      {buildPositions(tables.length).map((stylePos, index) => {
        const table = tables[index];
        if (!table) return null;
        return (
        <button
          key={table.id}
          onClick={() => onTableClick(table)}
          className={`absolute w-24 h-24 rounded-xl transform transition-all duration-300 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-2xl
            ${getTableStatusClass(table.status)}
            ${
              selectedTable?.id === table.id
                ? "ring-4 ring-blue-500 ring-offset-2 scale-105"
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

      <div className="absolute bottom-3 left-6 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-neutral-200 shadow-sm text-[12px] text-neutral-700">
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
