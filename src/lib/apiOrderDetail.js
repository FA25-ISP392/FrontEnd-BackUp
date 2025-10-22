import apiConfig from "../api/apiConfig";

export const normalizeOrderDetail = (d = {}) => {
  const rawNote = d.note ?? d.notes;
  let finalNote = null;
  if (rawNote !== null && rawNote !== undefined && rawNote !== "") {
    finalNote = String(rawNote);
  }

  const finalToppings = Array.isArray(d.toppings)
    ? d.toppings.map((t) => {
        let finalQuantity = 1;
        if (typeof t.quantity === "number" && !isNaN(t.quantity)) {
          finalQuantity = t.quantity;
        } else if (
          t.quantity !== null &&
          t.quantity !== undefined &&
          t.quantity !== ""
        ) {
          finalQuantity = Number(t.quantity);
        }

        return {
          toppingId: Number(t.toppingId ?? t.id),
          toppingName: t.toppingName ?? t.name ?? "",
          quantity: finalQuantity,
          toppingPrice: Number(t.toppingPrice ?? t.price ?? 0),
        };
      })
    : [];

  return {
    orderDetailId: Number(d.orderDetailId ?? d.id),
    orderId: Number(d.orderId),
    dishId: Number(d.dishId),
    dishName: d.dishName,
    totalPrice: Number(d.totalPrice ?? 0),
    status: d.status,
    note: finalNote,
    toppings: finalToppings,
  };
};

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
  if (!newStatus) throw new Error("Cần cung cấp trạng thái mới (newStatus)");
  if (!itemToUpdate) throw new Error("Cần cung cấp item object để cập nhật");
  const formattedStatus = String(newStatus).toUpperCase();
  const payload = {
    orderDetailId: Number(itemToUpdate.orderDetailId),
    status: formattedStatus,
  };
  const res = await apiConfig.put(
    `/order-details/${Number(orderDetailId)}`,
    payload
  );
  return normalizeOrderDetail(res?.result ?? res);
}
