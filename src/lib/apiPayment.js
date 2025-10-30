import apiConfig from "../api/apiConfig";

function toDatetimeText(raw) {
  if (!raw) return "-";
  const s = String(raw).trim();
  const m = s.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?(?:\.\d+)?/
  );
  if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
  return s;
}
function addHoursText(raw, offsetHours = 7) {
  if (!raw) return "-";
  const s = String(raw).trim();
  const m = s.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?(?:\.\d+)?/
  );
  if (!m) return toDatetimeText(s);
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const hh = Number(m[4]);
  const mm = Number(m[5]);
  const baseMs = Date.UTC(y, mo - 1, d, hh, mm);
  const shifted = new Date(baseMs + offsetHours * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const out = `${shifted.getUTCFullYear()}-${pad(
    shifted.getUTCMonth() + 1
  )}-${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(
    shifted.getUTCMinutes()
  )}`;
  return out;
}

export const normalizePayment = (p = {}) => {
  const rawPaid = p.paidAt ?? p.paid_at ?? null;
  const rawCreated = p.createdAt ?? p.created_at ?? null;
  const rawUpdated = p.updatedAt ?? p.updated_at ?? null;
  const rawTs = rawPaid ?? rawUpdated ?? rawCreated;
  const method = String(p.method || "BANK_TRANSFER").toUpperCase();
  const status = String(p.status || "PENDING").toUpperCase();

  const methodVi =
    method === "CASH"
      ? "Tiền mặt"
      : method === "BANK_TRANSFER"
      ? "Thanh toán QR"
      : method;
  const statusVi =
    status === "COMPLETED"
      ? "Thành công"
      : status === "CANCELLED"
      ? "Thất bại"
      : "Đang xử lý";

  return {
    id: Number(p.id ?? p.paymentId ?? 0),
    orderId: Number(p.orderId ?? 0),
    method,
    methodVi,
    status,
    statusVi,
    total: Number(p.total ?? 0),
    checkoutUrl: p.checkoutUrl ?? "",
    qrCode: p.qrCode ?? "",
    paidAt: rawPaid,
    createdAt: rawCreated,
    updatedAt: rawUpdated,
    datetimeText: toDatetimeText(rawTs),
    datetimeTextPlus7: addHoursText(rawTs, 7),
  };
};

export async function createPayment({ orderId, method = "BANK_TRANSFER" }) {
  if (!orderId) throw new Error("Thiếu orderId.");
  const payload = {
    orderId: Number(orderId),
    method: String(method).toUpperCase(),
  };
  const res = await apiConfig.post("/payment", payload);
  return normalizePayment(res?.result ?? res);
}

export async function getPaymentById(id) {
  const res = await apiConfig.get(`/payment/${id}`);
  return normalizePayment(res?.result ?? res);
}

export async function listPaymentsPaging({ page = 0, size = 6 } = {}) {
  const res = await apiConfig.get("/payment", { params: { page, size } });
  const result = res?.result ?? res;
  const list = Array.isArray(result?.content)
    ? result.content
    : Array.isArray(result)
    ? result
    : [];

  const data = list.map(normalizePayment);

  const totalElements = result?.totalElements ?? data.length;
  const totalPages = result?.totalPages ?? 1;
  const number = result?.number ?? page;
  const sizePage = result?.size ?? size;

  return {
    items: data,
    pageInfo: {
      page: number + 1,
      size: sizePage,
      totalPages,
      totalElements,
      first: result?.first ?? page === 0,
      last: result?.last ?? number + 1 >= totalPages,
    },
  };
}

export async function getPayments({ page = 0, size = 100 } = {}) {
  const { items } = await listPaymentsPaging({ page, size });
  return items;
}

export async function cancelPayment({ id, orderCode, status = "CANCELLED" }) {
  const res = await apiConfig.get("/payment/cancel", {
    params: { id, orderCode, status },
  });
  return res;
}

export async function getPaymentHistoryPaged({
  customerId,
  page = 1,
  size = 6,
}) {
  if (!customerId) throw new Error("Thiếu customerId.");
  const res = await apiConfig.get(`/payment/${customerId}`, {
    params: { page: Math.max(0, page - 1), size },
  });
  const result = res?.result ?? res;
  const list = Array.isArray(result?.content)
    ? result.content
    : Array.isArray(result)
    ? result
    : [];

  const data = list.map(normalizePayment);
  const totalElements = result?.totalElements ?? data.length;
  const totalPages =
    result?.totalPages ?? Math.max(1, Math.ceil(totalElements / size));
  const number = result?.number ?? page - 1;
  const sizePage = result?.size ?? size;
  return {
    items: data,
    pageInfo: {
      page: number + 1,
      size: sizePage,
      totalPages,
      totalElements,
      numberOfElements: data.length,
      first: result?.first ?? page === 1,
      last: result?.last ?? number + 1 >= totalPages,
    },
  };
}
