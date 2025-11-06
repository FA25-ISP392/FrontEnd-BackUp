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

// export async function listTopping(params = {}) {
//   try {
//     const res = await apiConfig.get("/topping", { params });
//     const arr = res?.result ?? res?.data ?? [];
//     return Array.isArray(arr) ? arr.map(normalizeTopping) : [];
//   } catch (err) {
//     console.error("❌ Lỗi khi load danh sách topping:", err);
//     throw err;
//   }
// }

export async function listTopping(params = {}) {
  try {
    const res = await apiConfig.get("/topping", { params });
    console.log("📦 Raw topping response:", res);

    // 🧠 Trường hợp BE trả về mảng trực tiếp hoặc object bọc 'result'
    const arr = Array.isArray(res)
      ? res
      : Array.isArray(res?.result)
      ? res.result
      : Array.isArray(res?.data?.result)
      ? res.data.result
      : [];

    console.log("✅ Parsed topping array:", arr);

    return arr.map(normalizeTopping);
  } catch (err) {
    console.error("❌ Lỗi khi load danh sách topping:", err);
    throw err;
  }
}

export async function getTopping(id) {
  if (!id) throw new Error("Thiếu ID topping");
  try {
    const res = await apiConfig.get(`/topping/${id}`);
    const data = res?.result ?? res?.data ?? res;
    return normalizeTopping(data);
  } catch (err) {
    console.error("❌ Lỗi khi lấy topping:", err);
    throw err;
  }
}

export async function createTopping(payload) {
  try {
    const res = await apiConfig.post("/topping", {
      name: payload.name,
      price: Number(payload.price),
      calories: Number(payload.calories),
      gram: Number(payload.gram),
      quantity: Number(payload.quantity ?? 0),
    });
    const data = res?.result ?? res?.data ?? res;
    return normalizeTopping(data);
  } catch (err) {
    console.error("❌ Lỗi khi tạo topping:", err);
    throw err;
  }
}

export async function updateTopping(id, payload) {
  if (!id) throw new Error("Thiếu ID topping để cập nhật");
  try {
    const res = await apiConfig.put(`/topping/${id}`, payload);
    const data = res?.result ?? res?.data ?? res;
    return normalizeTopping(data);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật topping:", err);
    throw err;
  }
}

export async function deleteTopping(id) {
  if (!id) throw new Error("Thiếu ID topping để xoá");
  try {
    const res = await apiConfig.delete(`/topping/${id}`);
    return res?.result ?? res?.data ?? "Xóa thành công";
  } catch (err) {
    console.error("❌ Lỗi khi xoá topping:", err);
    throw err;
  }
}

export async function listToppingPaging({ page = 0, size = 10 }) {
  try {
    const res = await apiConfig.get("/topping/paging", {
      params: { page, size },
    });
    const result = res?.data ?? res?.result ?? res;

    const content = Array.isArray(result?.content)
      ? result.content.map(normalizeTopping)
      : [];

    return {
      content,
      pageInfo: {
        page: result.number ?? page, // ✅ BE trả 0–3 → FE nhận y chang
        size: result.size ?? size,
        totalPages: result.totalPages ?? 1,
        totalElements: result.totalElements ?? 0,
      },
    };
  } catch (err) {
    console.error("❌ Lỗi khi load danh sách topping:", err);
    return {
      content: [],
      pageInfo: { page: 0, size, totalPages: 1, totalElements: 0 },
    };
  }
}

export async function searchToppingByName(name) {
  if (!name || name.trim() === "") return [];
  try {
    const res = await apiConfig.get(
      `/topping/by-name/${encodeURIComponent(name.trim())}`,
    );
    const arr = Array.isArray(res?.data?.result)
      ? res.data.result
      : Array.isArray(res?.result)
      ? res.result
      : Array.isArray(res)
      ? res
      : [];

    return arr.map(normalizeTopping);
  } catch (err) {
    console.error("❌ Lỗi khi tìm topping theo tên:", err);
    return [];
  }
}
