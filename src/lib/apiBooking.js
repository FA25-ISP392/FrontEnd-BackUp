import apiConfig from "../api/apiConfig";
import { buildISOFromVN } from "../lib/datetimeBooking";

export async function createBooking({ date, time, guests }) {
  if (!localStorage.getItem("token")) {
    throw new Error("Bạn cần đăng nhập trước khi đặt bàn.");
  }
  const payload = {
    seat: Number(guests) || 1,
    bookingDate: buildISOFromVN(date, time),
  };
  if (import.meta.env.DEV)
    console.log("POST /booking payload: ", JSON.stringify(payload));
  return apiConfig.post("/booking", payload);
}

export const normalizeBooking = (b = {}) => ({
  id: b.bookingId ?? b.id,
  customerId: b.customerId ?? b.customer?.id ?? null,
  customerName: b.customerName ?? b.customer?.fullName ?? "",
  phone: b.customerPhone ?? b.customer?.phone ?? "",
  email: b.customerEmail ?? b.customer?.email ?? "",
  seat: b.seat ?? b.guestCount ?? 1,
  bookingDate: b.bookingDate,
  createdAt: b.createdAt ?? b.created_at ?? null,
  status: String(b.status || "PENDING").toUpperCase(),
});

function normalizeStatusFilter(status) {
  if (!status) return "ALL";
  const set = String(status).toUpperCase();
  if (set === "REJECT") return "REJECT";
  return set;
}

export async function listBookingsPaging({
  page = 1,
  size = 6,
  status = "ALL",
} = {}) {
  const setStatusPage = normalizeStatusFilter(status);
  const endpoint =
    setStatusPage !== "ALL"
      ? `/booking/status/${encodeURIComponent(setStatusPage)}`
      : "/booking";
  const res = await apiConfig.get(endpoint);
  const list = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];

  const data = list
    .map(normalizeBooking)
    .sort(
      (firstKey, secondKey) =>
        new Date(secondKey.createdAt || secondKey.bookingDate) -
        new Date(firstKey.createdAt || firstKey.bookingDate)
    );

  const totalElements = data.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = (page - 1) * size;
  const end = start + size;

  return {
    items: data.slice(start, end),
    pageInfo: {
      page,
      size,
      totalPages,
      totalElements,
      numberOfElements: Math.min(size, totalElements - start),
      first: page === 1,
      last: page >= totalPages,
    },
  };
}

export async function updateBooking(id, payload) {
  const rawSeat = parseInt(payload.seat, 10) || 1;
  const seat = Math.max(1, Math.min(8, rawSeat));
  const bookingDate =
    payload.bookingDate ||
    (payload.date ? buildISOFromVN(payload.date, payload.time) : null);
  if (!bookingDate) throw new Error("Thiếu bookingDate hoặc date+time.");
  const body = { seat, bookingDate };
  if (import.meta.env.DEV) console.log("PUT /booking/%s body:", id, body);
  const res = await apiConfig.put(`/booking/${id}`, body);
  return normalizeBooking(res?.result ?? res);
}

export const approveBooking = (id) => updateBooking(id, { status: "APPROVED" });

export const rejectBooking = async (id) => {
  const res = await apiConfig.put(`/booking/${id}/reject`, {});
  return normalizeBooking(res?.result ?? res);
};

export async function approveBookingWithTable(bookingId, tableId) {
  if (!bookingId || !tableId)
    throw new Error("Thiếu bookingId hoặc tableId khi duyệt bàn.");

  const res = await apiConfig.put(`/booking/${bookingId}/approved`, {
    tableId: Number(tableId),
  });
  return res;
}
