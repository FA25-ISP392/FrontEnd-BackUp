import apiConfig from "../api/apiConfig";
import { normalizeOrderDetail } from "./apiOrderDetail";

export const normalizeOrder = (o = {}) => ({
  orderId: Number(o.orderId ?? o.id),
  customerId: Number(o.customerId ?? o.customer?.id ?? 0) || null,
  customerName: o.customerName ?? "",
  tableId: Number(o.tableId ?? o.table?.tableId ?? 0) || null,
  orderDate: o.orderDate ?? o.createdAt ?? null,
  status: String(o.status || "PENDING").toUpperCase(),
  total: Number(o.totalPrice ?? 0),
  grandTotal: Number(o.totalPrice ?? 0),
  paid: o.paid ?? false,
  orderDetails: Array.isArray(o.orderDetails)
    ? o.orderDetails.map(normalizeOrderDetail)
    : [],
});

//===== Hàm tạo ra Order mới cho đơn hàng tổng =====
export async function createOrder({ customerId, tableId }) {
  if (!customerId || isNaN(Number(customerId))) {
    throw new Error("Thiếu hoặc sai customerId.");
  }
  if (!tableId || isNaN(Number(tableId))) {
    throw new Error("Thiếu hoặc sai tableId.");
  }

  const payload = {
    customerId: Number(customerId),
    tableId: Number(tableId),
    orderDate: new Date().toISOString(),
  };
  //===== Lấy endpoint POST để tạo đơn hàng mới =====
  const res = await apiConfig.post("/orders", payload);
  return normalizeOrder(res?.result ?? res);
}

export async function getOrderById(orderId) {
  if (!orderId) throw new Error("Thiếu orderId.");
  const res = await apiConfig.get(`/orders/${orderId}`);
  const raw = res?.result ?? res;
  const order = normalizeOrder(raw);

  const normalizedDetails = Array.isArray(raw?.orderDetails)
    ? raw.orderDetails.map((d) => normalizeOrderDetail(d))
    : [];

  return { ...order, orderDetails: normalizedDetails };
}

export async function getOrderDetailsByOrderId(orderId) {
  const order = await getOrderById(orderId);
  return order.orderDetails || [];
}

export async function getOrderHistoryPaged({ customerId, page = 1, size = 6 }) {
  if (!customerId) throw new Error("Thiếu customerId.");
  const res = await apiConfig.get(`/orders/customer/${customerId}`, {
    params: { page: Math.max(0, page - 1), size },
  });
  const result = res?.result ?? res;
  const list = Array.isArray(result?.content) ? result.content : [];
  const data = list.map(normalizeOrder);
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
