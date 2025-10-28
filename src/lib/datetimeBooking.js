// export const TZ_VN = "Asia/Ho_Chi_Minh";

// export function buildISOFromVN(dateStr, timeStr = "00:00") {
//   if (!dateStr) return null;
//   const [y, m, d] = dateStr.split("-").map(Number);
//   const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
//   const local = new Date(Date.UTC(y, m - 1, d, hh - 7, mm, 0));
//   return local.toISOString().slice(0, 19);
// }

// export function normalizeISOFromAPI(isoLike) {
//   if (!isoLike) return null;
//   const raw = String(isoLike);
//   if (/Z$|[+-]\d{2}:\d{2}$/.test(raw)) return raw;
//   const d = new Date(raw.replace(" ", "T"));
//   d.setHours(d.getHours() + 7);
//   return d.toISOString();
// }

// export function fmtVNDateTime(iso, extra = {}) {
//   if (!iso) return "-";
//   const d = new Date(normalizeISOFromAPI(iso));
//   return new Intl.DateTimeFormat("vi-VN", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//     timeZone: TZ_VN,
//     ...extra,
//   }).format(d);
// }

// export function isoToVNParts(iso) {
//   if (!iso) return { date: "", time: "" };
//   const normalized = normalizeISOFromAPI(iso);
//   const d = new Date(normalized);
//   const parts = new Intl.DateTimeFormat("en-CA", {
//     timeZone: TZ_VN,
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   }).formatToParts(d);
//   const get = (t) => parts.find((p) => p.type === t)?.value || "";
//   return {
//     date: `${get("year")}-${get("month")}-${get("day")}`,
//     time: `${get("hour")}:${get("minute")}`,
//   };
// }

// datetimeBooking.js — REPLACE

export const TZ_VN = "Asia/Ho_Chi_Minh";

// tạo chuỗi local ISO (không kèm Z) đúng như người dùng nhập
export function buildISOFromVN(dateStr, timeStr = "00:00") {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
  const pad = (n) => String(n).padStart(2, "0");
  return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00`;
}

// chuẩn hoá về dạng 'yyyy-MM-ddTHH:mm:ss' (không cộng/trừ giờ)
export function normalizeISOFromAPI(isoLike) {
  if (!isoLike) return null;
  return String(isoLike).trim().replace(" ", "T").slice(0, 19);
}

// hiển thị theo múi giờ VN
export function fmtVNDateTime(iso, extra = {}) {
  if (!iso) return "-";
  const s = normalizeISOFromAPI(iso);
  const d = new Date(s); // coi là local time
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
  const s = normalizeISOFromAPI(iso);
  const d = new Date(s);
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
