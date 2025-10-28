// import { useEffect, useMemo, useState } from "react";
// import { listBookingsByTableDate } from "../../lib/apiBooking";

// function parseBookingDate(raw) {
//   if (!raw) return null;
//   const s = String(raw).trim();
//   if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
//   const d = new Date(s);
//   return isNaN(d.getTime()) ? null : d;
// }

// function buildDateTime(dateStr, timeStr) {
//   if (!dateStr || !timeStr) return null;
//   const [y, mo, d] = dateStr.split("-").map(Number);
//   const [hh, mm] = timeStr.split(":").map(Number);
//   const dt = new Date(y, (mo || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
//   return isNaN(dt.getTime()) ? null : dt;
// }

// function isOverlap2Hours(aStart, bStart) {
//   if (!aStart || !bStart) return false;
//   const A = aStart.getTime();
//   const B = bStart.getTime();
//   const TWO = 2 * 60 * 60 * 1000;
//   return Math.max(A, B) < Math.min(A + TWO, B + TWO);
// }

// export default function RestaurantTableLayout({
//   date,
//   time,
//   guests = 1,
//   onPick,
//   isLoggedIn = true,
// }) {
//   const tables = [
//     { id: 1, seats: 2 },
//     { id: 2, seats: 2 },
//     { id: 3, seats: 4 },
//     { id: 4, seats: 4 },
//     { id: 5, seats: 6 },
//     { id: 6, seats: 6 },
//     { id: 7, seats: 8 },
//     { id: 8, seats: 8 },
//   ];

//   const [busyMap, setBusyMap] = useState({});
//   const when = useMemo(() => buildDateTime(date, time), [date, time]);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!date || !time || !isLoggedIn) {
//         setBusyMap({});
//         return;
//       }

//       const next = {};
//       await Promise.all(
//         tables.map(async (tb) => {
//           const { ok, items } = await listBookingsByTableDate(tb.id, date);
//           if (!ok) {
//             next[tb.id] = true;
//             return;
//           }

//           next[tb.id] = items.some((b) => {
//             const st = String(b.status || "").toUpperCase();
//             if (st === "CANCELLED" || st === "REJECTED") return false;
//             const bookedTableId = Number(b.tableId || b.wantTable || 0);
//             if (bookedTableId && bookedTableId !== tb.id) return false;
//             const bookedAt = parseBookingDate(b.bookingDate);
//             if (!bookedAt) return false;
//             return isOverlap2Hours(when, bookedAt);
//           });
//         })
//       );
//       if (!cancelled) setBusyMap(next);
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [date, time, isLoggedIn]);

//   const boxBase =
//     "w-16 h-16 border-2 rounded-lg flex items-center justify-center text-sm font-semibold shadow-md transition";
//   const styleByState = (tb) => {
//     const notEnough = (tb.seats || 0) < (Number(guests) || 1);
//     const busy = !!busyMap[tb.id];
//     if (notEnough)
//       return `${boxBase} bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed`;
//     if (busy)
//       return `${boxBase} bg-red-50 border-red-300 text-red-700 cursor-not-allowed`;
//     return `${boxBase} bg-green-50 border-green-300 text-green-700 hover:shadow-lg cursor-pointer`;
//   };

//   return (
//     <div className="mb-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
//         Sơ đồ bàn nhà hàng
//       </h3>

//       <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200 h-80">
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-orange-300 rounded-b-lg" />
//         <div className="absolute inset-4 border-2 border-orange-200 rounded-lg bg-white/30" />

//         {/* Bàn 1 */}
//         <div className="absolute top-12 left-1/2 transform -translate-x-20">
//           <button
//             type="button"
//             disabled={!!busyMap[1] || tables[0].seats < guests || !when}
//             onClick={() => onPick?.(1)}
//             className={styleByState(tables[0])}
//             title={`Bàn 1 - ${tables[0].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">1</div>
//               <div className="text-xs">{tables[0].seats} người</div>
//             </div>
//           </button>
//         </div>

//         {/* Bàn 2 */}
//         <div className="absolute top-12 left-1/2 transform translate-x-4">
//           <button
//             type="button"
//             disabled={!!busyMap[2] || tables[1].seats < guests || !when}
//             onClick={() => onPick?.(2)}
//             className={styleByState(tables[1])}
//             title={`Bàn 2 - ${tables[1].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">2</div>
//               <div className="text-xs">{tables[1].seats} người</div>
//             </div>
//           </button>
//         </div>

//         {/* Bàn 3 */}
//         <div className="absolute bottom-12 left-1/2 transform -translate-x-20">
//           <button
//             type="button"
//             disabled={!!busyMap[3] || tables[2].seats < guests || !when}
//             onClick={() => onPick?.(3)}
//             className={styleByState(tables[2])}
//             title={`Bàn 3 - ${tables[2].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">3</div>
//               <div className="text-xs">{tables[2].seats} người</div>
//             </div>
//           </button>
//         </div>

//         {/* Bàn 4 */}
//         <div className="absolute bottom-12 left-1/2 transform translate-x-4">
//           <button
//             type="button"
//             disabled={!!busyMap[4] || tables[3].seats < guests || !when}
//             onClick={() => onPick?.(4)}
//             className={styleByState(tables[3])}
//             title={`Bàn 4 - ${tables[3].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">4</div>
//               <div className="text-xs">{tables[3].seats} người</div>
//             </div>
//           </button>
//         </div>

//         {/* Bàn 5 */}
//         <div className="absolute top-1/2 left-8 transform -translate-y-12">
//           <button
//             type="button"
//             disabled={!!busyMap[5] || tables[4].seats < guests || !when}
//             onClick={() => onPick?.(5)}
//             className={styleByState(tables[4])}
//             title={`Bàn 5 - ${tables[4].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">5</div>
//               <div className="text-xs">{tables[4].seats} người</div>
//             </div>
//           </button>
//         </div>

//         {/* Bàn 6 */}
//         <div className="absolute top-1/2 left-8 transform translate-y-8">
//           <button
//             type="button"
//             disabled={!!busyMap[6] || tables[5].seats < guests || !when}
//             onClick={() => onPick?.(6)}
//             className={styleByState(tables[5])}
//             title={`Bàn 6 - ${tables[5].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">6</div>
//               <div className="text-xs">{tables[5].seats} người</div>
//             </div>
//           </button>
//         </div>

//         {/* Bàn 7 */}
//         <div className="absolute top-1/2 right-8 transform -translate-y-12">
//           <button
//             type="button"
//             disabled={!!busyMap[7] || tables[6].seats < guests || !when}
//             onClick={() => onPick?.(7)}
//             className={styleByState(tables[6])}
//             title={`Bàn 7 - ${tables[6].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">7</div>
//               <div className="text-xs">{tables[6].seats} người</div>
//             </div>
//           </button>
//         </div>

//         {/* Bàn 8 */}
//         <div className="absolute top-1/2 right-8 transform translate-y-8">
//           <button
//             type="button"
//             disabled={!!busyMap[8] || tables[7].seats < guests || !when}
//             onClick={() => onPick?.(8)}
//             className={styleByState(tables[7])}
//             title={`Bàn 8 - ${tables[7].seats} người`}
//           >
//             <div className="text-center">
//               <div className="text-xs font-bold">8</div>
//               <div className="text-xs">{tables[7].seats} người</div>
//             </div>
//           </button>
//         </div>

//         <div className="absolute bottom-2 left-2 text-xs text-orange-700 space-y-1">
//           <div className="flex items-center gap-1">
//             <div className="w-3 h-3 bg-green-50 border border-green-300 rounded" />
//             <span>Trống</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <div className="w-3 h-3 bg-red-50 border border-red-300 rounded" />
//             <span>Đã có khách</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded" />
//             <span>Không đủ chỗ</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { listBookingsByTableDate } from "../../lib/apiBooking";

// build Date từ input (coi giờ người dùng chọn là local)
function buildDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = String(timeStr)
    .split(":")
    .map((x) => Number(x || 0));
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

// backend đang trả "yyyy-MM-ddTHH:mm:ss" (không TZ) -> coi là local
function parseBookingLocal(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return null; // không giờ → bỏ qua
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function isOverlap2Hours(a, b) {
  if (!a || !b) return false;
  const A = a.getTime(),
    B = b.getTime();
  const TWO_H = 2 * 60 * 60 * 1000;
  return Math.max(A, B) < Math.min(A + TWO_H, B + TWO_H);
}

export default function RestaurantTableLayout({
  date,
  time,
  guests = 1,
  onPick,
}) {
  const tables = [
    { id: 1, seats: 2 },
    { id: 2, seats: 2 },
    { id: 3, seats: 4 },
    { id: 4, seats: 4 },
    { id: 5, seats: 6 },
    { id: 6, seats: 6 },
    { id: 7, seats: 8 },
    { id: 8, seats: 8 },
  ];

  const [busyMap, setBusyMap] = useState({});
  const when = useMemo(() => buildDateTime(date, time), [date, time]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Chưa chọn ngày/giờ -> tất cả coi như trống
      if (!date || !time) {
        if (!cancelled) setBusyMap({});
        return;
      }

      const next = {};
      // chạy tuần tự để tránh spam proxy/ngắt mạch
      for (const tb of tables) {
        const arr = await listBookingsByTableDate(tb.id, date); // luôn là mảng (đã catch ở API)
        // chỉ bận nếu có booking trùng giờ và trùng bàn
        next[tb.id] = arr.some((b) => {
          const st = String(b.status || "").toUpperCase();
          if (st === "CANCELLED" || st === "REJECTED") return false;

          // Ưu tiên tableId (đã được assign). Nếu chưa có thì mới dùng wantTable.
          const bookedTableId = Number(b.tableId || b.wantTable || 0);
          if (bookedTableId && bookedTableId !== tb.id) return false;

          const bookedAt = parseBookingLocal(b.bookingDate);
          if (!bookedAt) return false;

          return isOverlap2Hours(when, bookedAt);
        });
      }

      if (!cancelled) setBusyMap(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [date, time]); // đổi ngày/giờ mới kiểm lại

  const boxBase =
    "w-16 h-16 border-2 rounded-lg flex items-center justify-center text-sm font-semibold shadow-md transition";
  const styleByState = (tb) => {
    const notEnough = (tb.seats || 0) < (Number(guests) || 1);
    const busy = !!busyMap[tb.id];
    if (notEnough)
      return `${boxBase} bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed`;
    if (busy)
      return `${boxBase} bg-red-50 border-red-300 text-red-700 cursor-not-allowed`;
    return `${boxBase} bg-green-50 border-green-300 text-green-700 hover:shadow-lg cursor-pointer`;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Sơ đồ bàn nhà hàng
      </h3>

      <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200 h-80">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-orange-300 rounded-b-lg" />
        <div className="absolute inset-4 border-2 border-orange-200 rounded-lg bg-white/30" />

        {/* 8 cái nút bàn */}
        {tables.map((tb, idx) => {
          // vị trí cũ giữ nguyên – thay vì code lặp, bạn có thể giữ layout như trước
          const positions = [
            "absolute top-12 left-1/2 -translate-x-20",
            "absolute top-12 left-1/2 translate-x-4",
            "absolute bottom-12 left-1/2 -translate-x-20",
            "absolute bottom-12 left-1/2 translate-x-4",
            "absolute top-1/2 left-8 -translate-y-12",
            "absolute top-1/2 left-8 translate-y-8",
            "absolute top-1/2 right-8 -translate-y-12",
            "absolute top-1/2 right-8 translate-y-8",
          ];
          return (
            <div key={tb.id} className={positions[idx]}>
              <button
                type="button"
                disabled={!!busyMap[tb.id] || tb.seats < guests || !when}
                onClick={() => onPick?.(tb.id)}
                className={styleByState(tb)}
                title={`Bàn ${tb.id} - ${tb.seats} người`}
              >
                <div className="text-center">
                  <div className="text-xs font-bold">{tb.id}</div>
                  <div className="text-xs">{tb.seats} người</div>
                </div>
              </button>
            </div>
          );
        })}

        <div className="absolute bottom-2 left-2 text-xs text-orange-700 space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-50 border border-green-300 rounded" />
            <span>Trống</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-50 border border-red-300 rounded" />
            <span>Đã có khách</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded" />
            <span>Không đủ chỗ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
