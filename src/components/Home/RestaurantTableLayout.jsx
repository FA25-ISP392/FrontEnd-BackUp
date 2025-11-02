import { useEffect, useMemo, useState } from "react";
import { listBookingsByTableDate } from "../../lib/apiBooking";

function buildDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = String(timeStr)
    .split(":")
    .map((x) => Number(x || 0));
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}
const parseBookingLocal = (s) =>
  s ? new Date(String(s).replace(" ", "T")) : null;
const isOverlap2Hours = (a, b) =>
  a && b && Math.abs(a - b) < 2 * 60 * 60 * 1000;

export default function RestaurantTableLayout({ date, time, guests = 1 }) {
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
      if (!date || !time) {
        if (!cancelled) setBusyMap({});
        return;
      }
      const next = {};
      for (const tb of tables) {
        const arr = await listBookingsByTableDate(tb.id, date);
        next[tb.id] = arr.some((b) => {
          const st = String(b.status || "").toUpperCase();
          if (st === "CANCELLED" || st === "REJECTED") return false;
          const bookedTableId = Number(b.tableId || b.wantTable || 0);
          if (bookedTableId && bookedTableId !== tb.id) return false;
          const bookedAt = parseBookingLocal(b.bookingDate);
          return isOverlap2Hours(when, bookedAt);
        });
      }
      if (!cancelled) setBusyMap(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [date, time]);

  const base =
    "w-16 h-16 border-2 rounded-lg flex items-center justify-center text-sm font-semibold shadow-md";
  const style = (tb) => {
    const notEnough = (tb.seats || 0) < (Number(guests) || 1);
    const busy = !!busyMap[tb.id];
    if (notEnough) return `${base} bg-gray-100 border-gray-300 text-gray-400`;
    if (busy) return `${base} bg-red-50 border-red-300 text-red-700`;
    return `${base} bg-green-50 border-green-300 text-green-700`;
  };

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
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Sơ đồ bàn nhà hàng
      </h3>
      <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200 h-80">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-orange-300 rounded-b-lg" />
        <div className="absolute inset-4 border-2 border-orange-200 rounded-lg bg-white/30" />
        {tables.map((tb, i) => (
          <div
            key={tb.id}
            className={`${positions[i]} pointer-events-none select-none`}
          >
            <div
              className={style(tb)}
              title={`Bàn ${tb.id} - ${tb.seats} người`}
            >
              <div className="text-center">
                <div className="text-xs font-bold">{tb.id}</div>
                <div className="text-xs">{tb.seats} người</div>
              </div>
            </div>
          </div>
        ))}

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
