import apiConfig from "../api/apiConfig";

export const normalizeOrderDetail = (d = {}) => {
  const note = d.note != null && d.note !== "" ? String(d.note) : null;
  const toppings = Array.isArray(d.toppings)
    ? d.toppings.map((t) => ({
        toppingId: Number(t.toppingId ?? t.id),
        toppingName: t.toppingName ?? t.name ?? "",
        quantity: Number(t.quantity ?? 1),
        toppingPrice: Number(t.toppingPrice ?? t.price ?? 0),
      }))
    : [];
  const lineTotal = Number(d.totalPrice ?? 0);
  return {
    orderDetailId: Number(d.orderDetailId ?? d.id),
    orderId: Number(d.orderId ?? 0),
    dishId: Number(d.dishId ?? 0),
    dishName: d.dishName ?? d.name ?? "",
    status: String(d.status || "PENDING").toUpperCase(),
    note,
    toppings,
    quantity: 1,
    unitPrice: lineTotal,
    totalPrice: lineTotal,
    lineTotal,
    orderDate: d.orderDate ?? null,
  };
};

export async function createOrderDetail({
  orderId,
  dishId,
  note = "",
  toppings = [],
}) {
  if (!orderId) throw new Error("Thiếu orderId.");
  if (!dishId) throw new Error("Thiếu dishId.");

  const payload = {
    orderId: Number(orderId),
    dishId: Number(dishId),
    note: String(note || ""),
    toppings: toppings.map((t) => ({
      toppingId: Number(t.toppingId ?? t.id),
      quantity: Number(t.quantity ?? 1),
    })),
  };

  const res = await apiConfig.post("/order-details", payload);
  return normalizeOrderDetail(res?.result ?? res);
}

export async function createOrderDetailsFromCart(orderId, cart = []) {
  if (!orderId) throw new Error("Thiếu orderId để ghi chi tiết đơn.");
  const results = [];

  for (const item of cart) {
    const times = Math.max(1, Number(item.quantity ?? 1));
    const toppings = Array.isArray(item.selectedToppings)
      ? item.selectedToppings
      : [];

    for (let i = 0; i < times; i++) {
      const od = await createOrderDetail({
        orderId,
        dishId: item.id ?? item.dishId,
        note: item.notes || "",
        toppings,
      });
      results.push(od);
    }
  }
  return results;
}

export async function getOrderDetailsByStatus(status) {
  if (!status) throw new Error("Cần cung cấp trạng thái (status)");
  const formattedStatus = String(status).toUpperCase();
  const res = await apiConfig.get(`/order-details/status/${formattedStatus}`);
  if (Array.isArray(res)) {
    return res.map(normalizeOrderDetail);
  }
  if (Array.isArray(res?.result)) {
    return res.result.map(normalizeOrderDetail);
  }
  return [];
}

export async function updateOrderDetailStatus(
  orderDetailId,
  itemToUpdate,
  newStatus
) {
  if (!orderDetailId) throw new Error("Cần cung cấp orderDetailId");
  if (!itemToUpdate) throw new Error("Cần cung cấp item object để cập nhật");
  if (!newStatus) throw new Error("Cần cung cấp trạng thái mới (newStatus)");
  const formattedStatus = String(newStatus).toUpperCase();
  const payload = {
    orderDetailId: Number(orderDetailId),
    status: formattedStatus,
  };
  const res = await apiConfig.put(
    `/order-details/${Number(orderDetailId)}`,
    payload
  );
  return normalizeOrderDetail(res?.result ?? res);
}

export async function updateOrderDetail(detail = {}) {
  const id = Number(detail.orderDetailId ?? detail.id);
  if (!id) throw new Error("Thiếu orderDetailId để cập nhật.");
  const payload = {
    orderDetailId: id,
    note: String(detail.note ?? ""),
    status: String(detail.status ?? "PENDING").toUpperCase(),
    toppings: Array.isArray(detail.toppings)
      ? detail.toppings.map((t) => ({
          toppingId: Number(t.toppingId ?? t.id),
          quantity: Number(t.quantity ?? 1),
        }))
      : [],
  };

  const res = await apiConfig.put(`/order-details/${id}`, payload);
  return normalizeOrderDetail(res?.result ?? res);
}

export async function deleteOrderDetail(orderDetailId) {
  const id = Number(orderDetailId);
  if (!id) throw new Error("Thiếu orderDetailId để xoá.");
  await apiConfig.delete(`/order-details/${id}`);
  return true;
}
