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
      },
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

export const listToppingPaging = async ({ page = 0, size = 10 }) => {
  try {
    const res = await apiConfig.get("/topping/paging", {
      params: { page, size },
    });

    console.log("Res gốc từ API topping:", res);

    // 💡 Ở đây BE trả trực tiếp object chứa content, không bọc trong result
    const result = res?.result ?? res?.data ?? res ?? {}; // fallback 3 cấp: result -> data -> chính res

    // ✅ Lấy content đúng field
    const content = Array.isArray(result?.content)
      ? result.content.map(normalizeTopping)
      : [];

    console.log("✅ Content sau khi map:", content);

    return {
      content,
      pageInfo: {
        page,
        size: result?.size ?? size,
        totalPages: result?.totalPages ?? 1,
        totalElements: result?.totalElements ?? 0,
      },
    };
  } catch (err) {
    console.error("❌ Lỗi khi load danh sách topping:", err);
    return {
      content: [],
      pageInfo: { page: 0, size, totalPages: 1, totalElements: 0 },
    };
  }
};

export async function searchToppingByName(name) {
  if (!name || name.trim() === "") return [];
  try {
    const res = await apiConfig.get(
      `/topping/by-name/${encodeURIComponent(name.trim())}`,
    );
    console.log("🔍 API search topping response:", res);

    // ✅ BE có thể trả trực tiếp mảng, hoặc { code, result: [...] }
    let arr = [];

    if (Array.isArray(res)) {
      // Trường hợp API trả trực tiếp mảng
      arr = res;
    } else if (Array.isArray(res?.result)) {
      // Trường hợp API trả { code, result: [...] }
      arr = res.result;
    } else if (Array.isArray(res?.data?.result)) {
      // Một số axios wrapper đặt trong data
      arr = res.data.result;
    }

    const normalized = arr.map((t) => ({
      id: t.toppingId ?? t.id ?? 0,
      name: t.name ?? "",
      price: Number(t.price ?? 0),
      calories: Number(t.calories ?? 0),
      gram: Number(t.gram ?? 0),
    }));

    console.log("✅ Normalized topping:", normalized);
    return normalized;
  } catch (err) {
    console.error("❌ Lỗi khi tìm topping theo tên:", err);
    return [];
  }
}
