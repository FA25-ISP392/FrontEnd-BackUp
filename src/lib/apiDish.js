import apiConfig from "../api/apiConfig";

// 💡 Map giữa FE (tiếng Việt) và BE (enum)
const typeMap = {
  "Tăng cân": "BUILD_MUSCLE",
  "Giữ dáng": "STAY_FIT",
  "Giảm cân": "FAT_LOSS",
};

const typeReverseMap = {
  BUILD_MUSCLE: "Tăng cân",
  STAY_FIT: "Giữ dáng",
  FAT_LOSS: "Giảm cân",
};

export function normalizeDish(d = {}) {
  return {
    id: d.dishId ?? d.id,
    name: d.dishName ?? d.name ?? "",
    description: d.description ?? "",
    price: d.price ?? 0,
    calo: Number(d.calo ?? d.calories ?? 0),
    category: d.category ?? "",
    type: typeReverseMap[d.type] || "Giữ dáng", // ✅ Hiển thị đúng tiếng Việt
    isAvailable: d.isAvailable ?? true,
    picture: d.picture?.startsWith("http")
      ? d.picture
      : d.picture
      ? `https://api-monngon88.purintech.id.vn/isp392/uploads/${d.picture}`
      : "",
    remainingQuantity: d.remainingQuantity ?? 0,
    optionalToppings: d.optionalToppings ?? [],
  };
}

export async function listDish(params = {}) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.get("/dish", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  const arr = Array.isArray(res) ? res : res?.result ?? [];
  return arr.map(normalizeDish);
}

// ⚙️ Lấy chi tiết 1 món
export async function getDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.get(`/dish/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res?.result ?? res;
  console.log("🍕 Dữ liệu món chi tiết:", data);
  return normalizeDish(data);
}

// 🧩 Tạo món ăn mới
export async function createDish(payload) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append(
    "dish",
    new Blob(
      [
        JSON.stringify({
          dishName: payload.dishName,
          description: payload.description,
          price: payload.price,
          calo: payload.calo,
          category: payload.category,
          isAvailable: payload.isAvailable,
          type: typeMap[payload.type] || "STAY_FIT", // ✅ Map đúng enum BE
        }),
      ],
      { type: "application/json" },
    ),
  );

  if (payload.imageFile instanceof File) {
    formData.append("image", payload.imageFile);
  }

  for (const [k, v] of formData.entries()) {
    console.log("🔍 FormData gửi lên:", k, v);
  }

  const res = await apiConfig.post("/dish", formData, {
    headers: { Authorization: `Bearer ${token}` },
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          delete headers["Content-Type"];
        }
        return data;
      },
    ],
  });

  // ⚡️ res đã là unwrapResponse rồi => có dishId trực tiếp
  return res;
}

// 🧩 Cập nhật món ăn
export async function updateDish(id, payload) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append(
    "dish",
    new Blob(
      [
        JSON.stringify({
          dishName: payload.dishName,
          description: payload.description,
          price: payload.price,
          calo: payload.calo,
          category: payload.category,
          isAvailable: payload.isAvailable,
          type: typeMap[payload.type] || "STAY_FIT", // ✅ Map đúng enum BE
        }),
      ],
      { type: "application/json" },
    ),
  );

  if (payload.imageFile instanceof File) {
    formData.append("image", payload.imageFile);
  }

  const res = await apiConfig.put(`/dish/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          delete headers["Content-Type"];
        }
        return data;
      },
    ],
  });
}

// 🧩 Xóa món ăn
export async function deleteDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.delete(`/dish/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
}
