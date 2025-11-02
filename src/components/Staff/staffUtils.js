// =======================
// Staff Utilities (pure)
// =======================

// --- Constants / flags ---
export const RESERVE_WINDOW_MINUTES = 10;
export const RESERVE_PAST_WINDOW_MINUTES = 15;
export const DEBUG_LOG = import.meta.env.DEV;

// --- Time & formatting ---
export function isWithinWindow(
  bookingISO,
  now = new Date(),
  minsBefore = RESERVE_WINDOW_MINUTES
) {
  if (!bookingISO) return false;
  const b = new Date(bookingISO);
  const diffMins = (b.getTime() - now.getTime()) / 60000;
  return diffMins <= minsBefore && diffMins >= -RESERVE_PAST_WINDOW_MINUTES;
}

export function hhmm(d) {
  if (!d) return "-";
  const t = new Date(d);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function VND(n = 0) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  } catch {
    return `${Number(n || 0).toLocaleString("vi-VN")} ₫`;
  }
}

export function parseNumber(s) {
  const num = Number(String(s ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

// --- Table status mapping ---
export function getTableStatusBadge(status) {
  switch (status) {
    case "serving":
      return "bg-red-500";
    case "empty":
      return "bg-green-500";
    case "reserved":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

export function getTableStatusText(status) {
  switch (status) {
    case "serving":
      return "Đang phục vụ";
    case "empty":
      return "Trống";
    case "reserved":
      return "Đã đặt";
    default:
      return "Không rõ";
  }
}

export function getTableStatusClass(status) {
  switch (status) {
    case "serving":
      return "bg-red-500 border-red-700";
    case "empty":
      return "bg-green-500 border-green-700";
    case "reserved":
      return "bg-yellow-500 border-yellow-700";
    default:
      return "bg-gray-400 border-gray-600";
  }
}

// --- Capacity label theo số bàn (quy ước của bạn) ---
export function getCapacityLabel(tableNumber) {
  const n = Number(tableNumber || 0);
  if (n >= 1 && n <= 2) return "2 khách";
  if (n >= 3 && n <= 4) return "4 khách";
  if (n >= 5 && n <= 6) return "6 khách";
  if (n >= 7 && n <= 8) return "8 khách";
  return null;
}

// --- RNG & math helpers ---
export function seedRand01(seed) {
  // deterministic 0..1
  const x = Math.sin(Number(seed) || 0) * 10000;
  return x - Math.floor(x);
}
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const pctToNum = (s) => Number(String(s).replace("%", ""));

// --- Bố trí bàn tự động (trả ra list style {left, top, transform}) ---
/**
 * buildPositions(count, options?)
 * options:
 *  - margin (default 12)
 *  - bottomReserved (default 18)
 *  - jitter (default 2)  // dao động nhẹ cho tự nhiên
 */
export function buildPositions(count, options = {}) {
  const margin = options.margin ?? 12;
  const bottomReserved = options.bottomReserved ?? 18;
  const jitter = options.jitter ?? 2;

  const topY = margin;
  const bottomY = 100 - bottomReserved - margin;
  const leftX = margin;
  const rightX = 100 - margin;

  let nTop = Math.max(1, Math.floor(count * 0.3));
  let nBottom = Math.max(1, Math.floor(count * 0.3));
  let remaining = Math.max(0, count - (nTop + nBottom));
  let nLeft = Math.floor(remaining / 2);
  let nRight = remaining - nLeft;

  const totalSides = nTop + nRight + nBottom + nLeft;
  if (totalSides < count) nBottom += count - totalSides;

  const spread = (n, from, to) =>
    Array.from(
      { length: Math.max(1, n) },
      (_, i) => from + ((i + 1) / (n + 1)) * (to - from)
    );

  const edgeSpread = (n, from, to) => {
    if (n <= 0) return [];
    if (n === 1) return [from + (to - from) / 2];
    return Array.from(
      { length: n },
      (_, i) => from + (i / (n - 1)) * (to - from)
    );
  };

  const xSpanFrom = margin + 8;
  const xSpanTo = 100 - margin - 8;
  const ySpanFrom = margin + 14;
  const ySpanTo = 100 - bottomReserved - margin - 14;

  const topXs = spread(nTop, xSpanFrom, xSpanTo);
  const botXs = spread(nBottom, xSpanFrom, xSpanTo);
  const leftYs = edgeSpread(nLeft, ySpanFrom, ySpanTo);
  const rightYs = edgeSpread(nRight, ySpanFrom, ySpanTo);

  const pos = [];
  let iTop = 0,
    iRight = 0,
    iBottom = 0,
    iLeft = 0;
  while (pos.length < count) {
    if (iTop < nTop) pos.push({ left: `${topXs[iTop++]}%`, top: `${topY}%` });
    if (pos.length >= count) break;
    if (iRight < nRight)
      pos.push({ left: `${rightX}%`, top: `${rightYs[iRight++]}%` });
    if (pos.length >= count) break;
    if (iBottom < nBottom)
      pos.push({ left: `${botXs[iBottom++]}%`, top: `${bottomY}%` });
    if (pos.length >= count) break;
    if (iLeft < nLeft)
      pos.push({ left: `${leftX}%`, top: `${leftYs[iLeft++]}%` });
  }

  return pos.map((p, idx) => {
    const jx = (seedRand01((idx + 1) * 137) - 0.5) * 2 * jitter;
    const jy = (seedRand01((idx + 1) * 257) - 0.5) * 2 * jitter;
    const x = clamp(pctToNum(p.left) + jx, margin + 3, 100 - margin - 3);
    const y = clamp(pctToNum(p.top) + jy, margin + 3, 100 - bottomReserved - 3);
    return { left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" };
  });
}

// --- Phân loại món đã phục vụ theo "hôm nay" (hỗ trợ ServeBoard/History) ---
export function splitServedByToday(list = [], tz = "vi-VN") {
  const today = new Date().toISOString().split("T")[0];
  const servedToday = [];
  const servedPast = [];
  for (const od of Array.isArray(list) ? list : []) {
    if (od?.orderDate && String(od.orderDate).startsWith(today)) {
      servedToday.push(od);
    } else {
      servedPast.push(od);
    }
  }
  return { servedToday, servedPast };
}
