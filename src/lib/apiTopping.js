import apiConfig from "../api/apiConfig";

export function normalizeTopping(t = {}) {
  return {
    id: t.toppingId ?? t.id ?? 0,
    name: t.name ?? "",
    price: Number(t.price ?? 0),
    calories: Number(t.calories ?? 0),
    gram: Number(t.gram ?? 0),
  };
}

export async function listTopping(params = {}) {
  try {
    const token = localStorage.getItem("token");
    const res = await apiConfig.get("/topping", {
      params,
      headers: {},
    });
    const arr = res?.result ?? res ?? [];
    return Array.isArray(arr) ? arr.map(normalizeTopping) : [];
  } catch (err) {
    console.error("❌ Lỗi khi load danh sách topping:", err);
    throw err;
  }
}

export async function getTopping(id) {
  if (!id) throw new Error("Thiếu ID topping");
  try {
    const token = localStorage.getItem("token");
    const res = await apiConfig.get(`/topping/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res?.result ?? res;
    return normalizeTopping(data);
  } catch (err) {
    console.error("❌ Lỗi khi lấy topping:", err);
    throw err;
  }
}

export async function createTopping(payload) {
  try {
    const token = localStorage.getItem("token");
    const res = await apiConfig.post(
      "/topping",
      {
        name: payload.name,
        price: Number(payload.price),
        calories: Number(payload.calories),
        gram: Number(payload.gram),
        quantity: Number(payload.quantity ?? 0),
      },
      {
        headers: {},
      }
    );

    const data = res?.result ?? res;
    return normalizeTopping(data);
  } catch (err) {
    console.error("❌ Lỗi khi tạo topping:", err);
    throw err;
  }
}

export async function updateTopping(id, payload) {
  if (!id) throw new Error("Thiếu ID topping để cập nhật");
  try {
    const token = localStorage.getItem("token");
    const res = await apiConfig.put(`/topping/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = res?.result ?? res;
    return normalizeTopping(data);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật topping:", err);
    throw err;
  }
}

export async function deleteTopping(id) {
  if (!id) throw new Error("Thiếu ID topping để xoá");
  try {
    const token = localStorage.getItem("token");
    const res = await apiConfig.delete(`/topping/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res?.result ?? "Xóa thành công";
  } catch (err) {
    console.error("❌ Lỗi khi xoá topping:", err);
    throw err;
  }
}
