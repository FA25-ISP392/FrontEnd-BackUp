import apiConfig from "../api/apiConfig";

export const normalizeOrderDetail = (d = {}) => ({
  orderDetailId: d.orderDetailId ?? d.id,
  orderId: d.orderId,
  dishId: d.dishId,
  dishName: d.dishName,
  totalPrice: Number(d.totalPrice ?? 0),
  status: d.status,
  note: d.note ?? d.notes ?? "",
  toppings: Array.isArray(d.toppings)
    ? d.toppings.map((t) => ({
        toppingId: t.toppingId ?? t.id,
        toppingName: t.toppingName ?? t.name ?? "",
        quantity: Number(t.quantity ?? 1),
        toppingPrice: Number(t.toppingPrice ?? t.price ?? 0),
      }))
    : [],
});

export async function createOrderDetail({
  orderId,
  dishId,
  notes = "",
  toppings = [],
}) {
  if (!orderId) throw new Error("Thiếu orderId.");
  if (!dishId) throw new Error("Thiếu dishId.");

  const payload = {
    orderId: Number(orderId),
    dishId: Number(dishId),
    notes: String(notes || ""),
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
        notes: item.notes || "",
        toppings, // mỗi topping mặc định quantity = 1 (đã set trong hàm trên)
      });
      results.push(od);
    }
  }
  return results;
}
