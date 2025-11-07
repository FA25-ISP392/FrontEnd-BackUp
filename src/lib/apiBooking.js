import apiConfig from "../api/apiConfig";
import { buildISOFromVN, normalizeISOFromAPI } from "../lib/datetimeBooking";

//==== Khởi Tạo Đơn Đặt Bàn với Trạng Thái là Chờ Duyệt =====
export async function createBooking({ date, time, guests, preferredTable }) {
  if (!localStorage.getItem("token")) {
    throw new Error("Bạn cần đăng nhập trước khi đặt bàn.");
  }
  const bookingDate = buildISOFromVN(date, time);
  if (!bookingDate) throw new Error("Thiếu ngày/giờ đặt bàn.");

  const payload = {
    seat: Number(guests) || 1,
    bookingDate,
    ...(preferredTable ? { wantTable: String(preferredTable) } : {}),
  };

  if (import.meta.env.DEV) console.log("POST /booking payload:", payload);
  //===== Lấy endpoint POST để khởi tạo đơn Đặt Bàn =====
  return apiConfig.post("/booking", payload);
}

export const normalizeBooking = (b = {}) => ({
  id: b.bookingId ?? b.id,
  customerId: b.customerId ?? b.customer?.id ?? null,
  customerName: b.customerName ?? "",
  phone: b.customerPhone ?? "",
  email: b.customerEmail ?? "",
  seat: b.seat ?? 1,
  bookingDate: normalizeISOFromAPI(b.bookingDate),
  createdAt: b.createdAt ?? null,
  preferredTable: b.wantTable ?? "",
  assignedTableId: b.tableId ?? null,
  status: normalizeStatus(b.status),
});

function normalizeStatus(u) {
  const s = String(u || "PENDING").toUpperCase();
  if (s === "REJECT") return "REJECTED";
  if (s === "APPROVE") return "APPROVED";
  if (s === "CANCEL" || s === "CANCELED") return "CANCELLED";
  return s;
}

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
  const res = await apiConfig.get(endpoint, {
    params: { page: page - 1, size },
  });
  const pageData = res;
  if (!pageData) {
    throw new Error("Không nhận được dữ liệu trang (pageData) từ API.");
  }
  const list = Array.isArray(pageData?.content) ? pageData.content : [];
  const data = list.map(normalizeBooking);

  return {
    items: data,
    pageInfo: {
      page: page,
      size: pageData.size,
      totalPages: pageData.totalPages,
      totalElements: pageData.totalElements,
      numberOfElements: pageData.numberOfElements,
      first: pageData.first,
      last: pageData.last,
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

//===== Khi Ghi Nhận về Đơn Đặt Bàn đã được khởi tạo rồi chuyển trạng thái sang Đã Duyệt =====
export async function approveBookingWithTable(bookingId, tableId) {
  if (!bookingId || !tableId)
    throw new Error("Thiếu bookingId hoặc tableId khi duyệt bàn.");

  const id = Number(bookingId);
  const tId = Number(tableId);
  try {
    //===== Lấy endpoint PUT để cập nhật trạng thái đơn Đặt Bàn =====
    return await apiConfig.put(`/booking/${id}/approved`, { tableId: tId });
  } catch (err1) {
    const code = err1?.response?.status;
    if (code !== 400) throw err1;
    try {
      return await apiConfig.put(`/booking/${id}/approved`, { tableID: tId });
    } catch (err2) {
      if (err2?.response?.status !== 400) throw err2;
      return await apiConfig.put(`/booking/${id}/approved`, null, {
        params: { tableId: tId },
      });
    }
  }
}

export async function listBookingsByTableDate(tableId, date) {
  if (!tableId) throw new Error("Thiếu tableId.");
  const dayStr = new Date(date || Date.now()).toISOString().slice(0, 10);
  const mapBooking = (b = {}) => {
    const id = b.bookingId ?? b.id ?? null;
    const name =
      b.customerName ??
      b.name ??
      b.customer?.name ??
      b.customer?.fullName ??
      "";
    const phone =
      b.customerPhone ?? b.phone ?? b.customer?.phone ?? b.phoneNumber ?? "";
    const email = b.customerEmail ?? b.email ?? b.customer?.email ?? "";
    return {
      bookingId: id,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      tableId: b.tableId ?? b.tableID ?? null,
      seat: b.seat ?? 1,
      createdAt: normalizeISOFromAPI(b.createdAt),
      bookingDate: normalizeISOFromAPI(b.bookingDate),
      wantTable: b.wantTable ?? "",
      status: String(b.status || "PENDING").toUpperCase(),
      id,
      name,
      phone,
      email,
    };
  };
  try {
    const res = await apiConfig.get("/booking/by_tableDate", {
      params: { tableId: Number(tableId), date: dayStr },
    });
    const list = Array.isArray(res)
      ? res
      : Array.isArray(res?.result)
      ? res.result
      : [];
    return list.map(mapBooking);
  } catch (e) {
    if (e?.status === 400) {
      try {
        const res2 = await apiConfig.get("/booking/by_tableDate", {
          params: { tableID: Number(tableId), date: dayStr },
        });
        const list2 = Array.isArray(res2)
          ? res2
          : Array.isArray(res2?.result)
          ? res2.result
          : [];
        return list2.map(mapBooking);
      } catch {
        return [];
      }
    }
    return [];
  }
}

//===== Hủy đơn Đặt Bàn (đổi trạng thái) =====
export async function cancelBooking(id) {
  if (!id) throw new Error("Thiếu bookingId.");
  //===== Lấy endpoint PUT để đổi trạng thái đơn Đặt Bàn =====
  const res = await apiConfig.put(`/booking/${id}/cancel`, {});
  return normalizeBooking(res?.result ?? res);
}

export async function updateBooking1(id, payload) {
  const rawSeat = parseInt(payload.guests, 10) || 1;
  const seat = Math.max(1, Math.min(8, rawSeat));
  const bookingDate =
    payload.bookingDate ||
    (payload.date ? buildISOFromVN(payload.date, payload.time) : null);
  const body = {
    seat,
    bookingDate,
    ...(payload.wantTable ? { wantTable: Number(payload.wantTable) } : {}),
  };

  const res = await apiConfig.put(`/booking/${id}`, body);
  return normalizeBooking(res?.result ?? res);
}

export async function getBookingHistory(customerId) {
  if (!customerId) throw new Error("Thiếu customerId.");
  const res = await apiConfig.get(`/booking/customer/${customerId}`);
  const list = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];
  return list.map(normalizeBooking);
}

//==== Lấy ra danh sách Đặt Bàn của khách hàng (đã có paging từ BE) =====
export async function getBookingHistoryPaged({
  customerId,
  page = 1,
  size = 6,
}) {
  if (!customerId) throw new Error("Thiếu customerId.");
  //===== Lấy endpoint GET để lấy danh sách =====
  const res = await apiConfig.get(`/booking/customer/${customerId}`, {
    params: { page: Math.max(0, page - 1), size },
  });

  const box = res?.result ?? res;
  const list = Array.isArray(box?.content)
    ? box.content
    : Array.isArray(box)
    ? box
    : [];

  const items = list.map(normalizeBooking);
  const totalElements = box?.totalElements ?? items.length;
  const totalPages =
    box?.totalPages ?? Math.max(1, Math.ceil(totalElements / size));
  const first = box?.first ?? page === 1;
  const last = box?.last ?? page >= totalPages;

  return {
    items,
    pageInfo: {
      page,
      size,
      totalPages,
      totalElements,
      numberOfElements: items.length,
      first,
      last,
    },
  };
}
