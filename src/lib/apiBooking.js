import apiConfig from "../api/apiConfig";

function toISOZ(dateStr, timeStr = "00:00") {
  const [y, m, d] = String(dateStr || "")
    .split("-")
    .map(Number);
  const [hh, mm] = String(timeStr || "00:00")
    .split(":")
    .map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  return dt.toISOString();
}

function toISOZMidnight(dateStr) {
  const [y, m, d] = String(dateStr || "")
    .split("-")
    .map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
  return dt.toISOString();
}

export async function createBooking({ date, time, guests }) {
  const payload = {
    bookingTime: toISOZ(date, time),
    bookingDate: toISOZMidnight(date),
    seat: Number(guests) || 1,
  };
  console.log("POST /booking payload:", payload);
  return apiConfig.post("/booking", payload);
}
