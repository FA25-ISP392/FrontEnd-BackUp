export const TZ_VN = "Asia/Ho_Chi_Minh";

export function normalizeISOFromAPI(isoLike) {
  if (!isoLike) return null;
  let s = String(isoLike).trim().replace(" ", "T");
  if (/Z$|[+-]\d{2}:\d{2}$/.test(s)) return s;
  return `${s}Z`;
}

export function fmtVNDateTime(iso, extra = {}) {
  if (!iso) return "-";
  const d = new Date(normalizeISOFromAPI(iso));
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ_VN,
    ...extra,
  }).format(d);
}

export function isoToVNParts(iso) {
  if (!iso) return { date: "", time: "" };
  const normalized = normalizeISOWithTZ(iso);
  const d = new Date(normalized);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ_VN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function buildISOFromVN(dateStr, timeStr = "00:00") {
  const hhmm = (timeStr || "00:00").padStart(5, "0");
  return new Date(`${dateStr}T${hhmm}:00+07:00`).toISOString();
}
