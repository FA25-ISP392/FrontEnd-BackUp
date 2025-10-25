import apiConfig from "../api/apiConfig";

export const normalizePayment = (p = {}) => ({
  id: Number(p.id ?? p.paymentId ?? 0),
  orderId: Number(p.orderId ?? 0),
  method: String(p.method || "BANK_TRANSFER").toUpperCase(),
  status: String(p.status || "PENDING").toUpperCase(),
  total: Number(p.total ?? 0),
  checkoutUrl: p.checkoutUrl ?? "",
  qrCode: p.qrCode ?? "",
});

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

export async function getPayments() {
  const res = await apiConfig.get("/payment");
  const list = Array.isArray(res) ? res : res?.result ?? [];
  return list.map(normalizePayment);
}
