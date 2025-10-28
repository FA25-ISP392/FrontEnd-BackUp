import { useEffect, useMemo, useState } from "react";
import { listBookingsByTableDate } from "../../lib/apiBooking";

function buildDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  let h = 0,
    m = 0;
  const t = String(timeStr).trim().toUpperCase();

  if (/AM|PM/.test(t)) {
    const parts = t.replace(/\s*(AM|PM)\s*$/, "").split(":");
    h = Number(parts[0] || 0);
    m = Number(parts[1] || 0);
    const isPM = /PM$/.test(t);
    const isAM = /AM$/.test(t);
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
  } else {
    const [hh, mm] = t.split(":").map((x) => Number(x || 0));
    h = hh;
    m = mm;
  }

  const [y, mo, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, (mo || 1) - 1, d || 1, h || 0, m || 0, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

function isOverlap2Hours(startA, startB) {
  if (!startA || !startB) return false;
  const a = startA.getTime();
  const b = startB.getTime();
  if (!isFinite(a) || !isFinite(b)) return false;

  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const endA = a + TWO_HOURS;
  const endB = b + TWO_HOURS;
  return Math.max(a, b) < Math.min(endA, endB);
}

export default function RestaurantTableLayout({
  date,
  time,
  guests = 1,
  onPick,
}) {
  const tables = [
    { id: 1, seats: 2, key: "table-1" },
    { id: 2, seats: 2, key: "table-2" },
    { id: 3, seats: 4, key: "table-3" },
    { id: 4, seats: 4, key: "table-4" },
    { id: 5, seats: 6, key: "table-5" },
    { id: 6, seats: 6, key: "table-6" },
    { id: 7, seats: 8, key: "table-7" },
    { id: 8, seats: 8, key: "table-8" },
  ];

  const [busyMap, setBusyMap] = useState({});
  const when = useMemo(() => buildDateTime(date, time), [date, time]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!date || !time) {
        setBusyMap({});
        return;
      }
      const next = {};
      await Promise.all(
        tables.map(async (tb) => {
          try {
            const bookings = await listBookingsByTableDate(tb.id, date);
            const list = Array.isArray(bookings)
              ? bookings
              : bookings?.result || [];
            next[tb.id] = list.some((b) => {
              const st = String(b?.status || "").toUpperCase();
              if (st === "CANCELLED" || st === "REJECTED") return false;
              const bStart = new Date(b.bookingDate);
              return isOverlap2Hours(when, bStart);
            });
          } catch (e) {
            next[tb.id] = false;
          }
        })
      );
      if (!cancelled) setBusyMap(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [date, time]);

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

  const getWrapperClass = (pos) => pos;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Sơ đồ bàn nhà hàng
      </h3>

      <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200 h-80">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-orange-300 rounded-b-lg" />
        <div className="absolute inset-4 border-2 border-orange-200 rounded-lg bg-white/30" />
        <div className="absolute top-12 left-1/2 transform -translate-x-20">
          <button
            type="button"
            disabled={!!busyMap[1] || tables[0].seats < guests || !when}
            onClick={() => onPick?.(1)}
            className={styleByState(tables[0])}
            title={`Bàn 1 - ${tables[0].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">1</div>
              <div className="text-xs">{tables[0].seats} người</div>
            </div>
          </button>
        </div>

        <div className="absolute top-12 left-1/2 transform translate-x-4">
          <button
            type="button"
            disabled={!!busyMap[2] || tables[1].seats < guests || !when}
            onClick={() => onPick?.(2)}
            className={styleByState(tables[1])}
            title={`Bàn 2 - ${tables[1].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">2</div>
              <div className="text-xs">{tables[1].seats} người</div>
            </div>
          </button>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-20">
          <button
            type="button"
            disabled={!!busyMap[3] || tables[2].seats < guests || !when}
            onClick={() => onPick?.(3)}
            className={styleByState(tables[2])}
            title={`Bàn 3 - ${tables[2].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">3</div>
              <div className="text-xs">{tables[2].seats} người</div>
            </div>
          </button>
        </div>

        <div className="absolute bottom-12 left-1/2 transform translate-x-4">
          <button
            type="button"
            disabled={!!busyMap[4] || tables[3].seats < guests || !when}
            onClick={() => onPick?.(4)}
            className={styleByState(tables[3])}
            title={`Bàn 4 - ${tables[3].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">4</div>
              <div className="text-xs">{tables[3].seats} người</div>
            </div>
          </button>
        </div>

        <div className="absolute top-1/2 left-8 transform -translate-y-12">
          <button
            type="button"
            disabled={!!busyMap[5] || tables[4].seats < guests || !when}
            onClick={() => onPick?.(5)}
            className={styleByState(tables[4])}
            title={`Bàn 5 - ${tables[4].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">5</div>
              <div className="text-xs">{tables[4].seats} người</div>
            </div>
          </button>
        </div>

        <div className="absolute top-1/2 left-8 transform translate-y-8">
          <button
            type="button"
            disabled={!!busyMap[6] || tables[5].seats < guests || !when}
            onClick={() => onPick?.(6)}
            className={styleByState(tables[5])}
            title={`Bàn 6 - ${tables[5].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">6</div>
              <div className="text-xs">{tables[5].seats} người</div>
            </div>
          </button>
        </div>

        <div className="absolute top-1/2 right-8 transform -translate-y-12">
          <button
            type="button"
            disabled={!!busyMap[7] || tables[6].seats < guests || !when}
            onClick={() => onPick?.(7)}
            className={styleByState(tables[6])}
            title={`Bàn 7 - ${tables[6].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">7</div>
              <div className="text-xs">{tables[6].seats} người</div>
            </div>
          </button>
        </div>

        <div className="absolute top-1/2 right-8 transform translate-y-8">
          <button
            type="button"
            disabled={!!busyMap[8] || tables[7].seats < guests || !when}
            onClick={() => onPick?.(8)}
            className={styleByState(tables[7])}
            title={`Bàn 8 - ${tables[7].seats} người`}
          >
            <div className="text-center">
              <div className="text-xs font-bold">8</div>
              <div className="text-xs">{tables[7].seats} người</div>
            </div>
          </button>
        </div>

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
