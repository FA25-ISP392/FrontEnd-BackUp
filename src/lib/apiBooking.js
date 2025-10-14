import apiConfig from "../api/apiConfig";

function toBookingISO(dateStr, timeStr = "00:00") {
  if (!dateStr) return new Date().toISOString();
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(
    year,
    (month || 1) - 1,
    day || 1,
    hours || 0,
    minutes || 0,
    0,
    0
  );
  return date.toISOString();
}

export async function createBooking({ date, time, guests }) {
  if (!localStorage.getItem("token")) {
    throw new Error("Bạn cần đăng nhập trước khi đặt bàn.");
  }
  const payload = {
    seat: Number(guests) || 1,
    bookingDate: toBookingISO(date, time),
  };

  if (import.meta.env.DEV) {
    console.log("POST /booking payload: ", JSON.stringify(payload));
  }
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

export async function listBookingsPaging({ page = 1, size = 6 } = {}) {
  const res = await apiConfig.get("/booking");
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
      (a, b) =>
        new Date(b.createdAt || b.bookingDate) -
        new Date(a.createdAt || a.bookingDate)
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
  const body = Object.fromEntries(
    Object.entries(payload).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  );
  const res = await apiConfig.put(`/booking/${id}`, body);
  return normalizeBooking(res?.result ?? res);
}

export const approveBooking = (id) => updateBooking(id, { status: "APPROVED" });
export const rejectBooking = (id) => updateBooking(id, { status: "REJECTED" });
