export const TZ_VN = "Asia/Ho_Chi_Minh";

export function buildISOFromVN(dateStr, timeStr = "00:00") {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
  const local = new Date(Date.UTC(y, m - 1, d, hh - 7, mm, 0));
  return local.toISOString().slice(0, 19);
}

export function normalizeISOFromAPI(isoLike) {
  if (!isoLike) return null;
  const raw = String(isoLike);
  if (/Z$|[+-]\d{2}:\d{2}$/.test(raw)) return raw;
  const d = new Date(raw.replace(" ", "T"));
  d.setHours(d.getHours() + 7);
  return d.toISOString();
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
  const normalized = normalizeISOFromAPI(iso);
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
