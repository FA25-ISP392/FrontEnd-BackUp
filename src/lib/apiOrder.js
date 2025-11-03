import apiConfig from "../api/apiConfig";
import { normalizeOrderDetail } from "./apiOrderDetail";

export const normalizeOrder = (o = {}) => ({
  orderId: Number(o.orderId ?? o.id),
  customerId: Number(o.customerId ?? o.customer?.id ?? 0) || null,
  customerName: o.customerName ?? "",
  tableId: Number(o.tableId ?? o.table?.tableId ?? 0) || null,
  orderDate: o.orderDate ?? o.createdAt ?? null,
  status: String(o.status || "PENDING").toUpperCase(),
  total: Number(o.totalPrice ?? 0), // Modal sẽ dùng tên này
  grandTotal: Number(o.totalPrice ?? 0),
  paid: o.paid ?? false, // 👈 DÒNG NÀY QUAN TRỌNG ĐÃ ĐƯỢC THÊM
  orderDetails: Array.isArray(o.orderDetails)
    ? o.orderDetails.map(normalizeOrderDetail)
    : [],
});

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

//  HÀM MỚI BỊ THIẾU CỦA BẠN ĐÂY
export async function getOrderHistoryPaged({ customerId, page = 1, size = 6 }) {
  if (!customerId) throw new Error("Thiếu customerId.");

  // Gọi API GET /orders/customer/{customerId} (đã thấy trong OrdersController.java)
  const res = await apiConfig.get(`/orders/customer/${customerId}`, {
    params: { page: Math.max(0, page - 1), size }, // Backend Java Pageable 0-indexed
  });

  const result = res?.result ?? res; // Lấy data từ ApiResponse
  const list = Array.isArray(result?.content) ? result.content : [];

  // Dùng normalizeOrder (đã được cập nhật trường 'paid' ở trên)
  const data = list.map(normalizeOrder);

  const totalElements = result?.totalElements ?? data.length;
  const totalPages =
    result?.totalPages ?? Math.max(1, Math.ceil(totalElements / size));
  const number = result?.number ?? page - 1;
  const sizePage = result?.size ?? size;

  return {
    items: data,
    pageInfo: {
      page: number + 1, // Trả về page 1-indexed cho frontend
      size: sizePage,
      totalPages,
      totalElements,
      numberOfElements: data.length,
      first: result?.first ?? page === 1,
      last: result?.last ?? number + 1 >= totalPages,
    },
  };
}
