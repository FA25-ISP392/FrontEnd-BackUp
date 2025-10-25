import apiConfig from "../api/apiConfig";

// 💡 Map giữa FE (tiếng Việt) và BE (enum)
const categoryMap = {
  Pizza: "PIZZA",
  "Mì ý": "PASTA",
  "Bò bít tết": "STEAK",
  Salad: "SALAD",
  "Tráng miệng": "DESSERT",
  "Đồ uống": "DRINKS",
};
const categoryReverseMap = {
  PIZZA: "Pizza",
  PASTA: "Mì ý",
  STEAK: "Bò bít tết",
  SALAD: "Salad",
  DESSERT: "Tráng miệng",
  DRINKS: "Đồ uống",
};

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

// 🧩 Chuẩn hoá dữ liệu món ăn
export function normalizeDish(d = {}) {
  const catKey = typeof d.category === "string" ? d.category.toUpperCase() : "";
  return {
    id: d.dishId ?? d.id,
    name: d.dishName ?? d.name ?? "",
    description: d.description ?? "",
    price: d.price ?? 0,
    calo: Number(d.calo ?? d.calories ?? 0),
    // 👇 2 field cho hiển thị & filter
    categoryEnum: catKey,
    category: categoryReverseMap[catKey] || d.category || "Khác",
    type: typeReverseMap[d.type] || "Giữ dáng",
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

// 🧩 Lấy danh sách món
export async function listDish(params = {}) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.get("/dish", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  const arr = Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
    ? res.data
    : res?.data?.result ?? res?.result ?? [];

  console.log("🍽️ listDish() -> dữ liệu nhận được:", arr);
  return arr.map(normalizeDish);
}

// ⚙️ Lấy chi tiết 1 món
export async function getDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.get(`/dish/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res?.data?.result ?? res?.result ?? res?.data ?? res;
  console.log("🍕 Dữ liệu món chi tiết:", data);
  return normalizeDish(data);
}

// 🧩 Tạo món ăn mới
export async function createDish(payload) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  const dishPayload = {
    dishName: payload.dishName,
    description: payload.description,
    price: payload.price,
    calo: payload.calo,
    category: categoryMap[payload.category] || "PIZZA",
    isAvailable: payload.isAvailable,
    type: typeMap[payload.type] || "STAY_FIT",
  };

  formData.append(
    "dish",
    new Blob([JSON.stringify(dishPayload)], { type: "application/json" }),
  );

  // 🖼️ Upload hình (nếu có)
  if (payload.imageFile instanceof File) {
    formData.append("image", payload.imageFile);
  }

  console.log("🔍 FormData gửi lên (create):");
  for (const [k, v] of formData.entries()) console.log(k, v);

  const res = await apiConfig.post("/dish", formData, {
    headers: { Authorization: `Bearer ${token}` },
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) delete headers["Content-Type"];
        return data;
      },
    ],
  });

  return res;
}

// 🧩 Cập nhật món ăn
export async function updateDish(id, payload) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  const dishPayload = {
    dishName: payload.dishName,
    description: payload.description,
    price: payload.price,
    calo: payload.calo,
    category: categoryMap[payload.category] || "PIZZA",
    isAvailable: payload.isAvailable,
    type: typeMap[payload.type] || "STAY_FIT",
  };

  formData.append(
    "dish",
    new Blob([JSON.stringify(dishPayload)], { type: "application/json" }),
  );

  // 🖼️ Chỉ append ảnh nếu có (tránh 522 lỗi Cloudinary)
  if (payload.imageFile instanceof File) {
    formData.append("image", payload.imageFile);
  }

  console.log("🔍 FormData gửi lên (update):");
  for (const [k, v] of formData.entries()) console.log(k, v);

  try {
    const res = await apiConfig.put(`/dish/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
      transformRequest: [
        (data, headers) => {
          if (data instanceof FormData) delete headers["Content-Type"];
          return data;
        },
      ],
    });
    return res;
  } catch (err) {
    console.error("❌ updateDish lỗi:", err);
    throw err;
  }
}

// 🧩 Xóa món ăn
export async function deleteDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.delete(`/dish/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
}
