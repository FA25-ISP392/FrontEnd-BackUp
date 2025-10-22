import apiConfig from "../api/apiConfig";

export function normalizeDish(d = {}) {
  return {
    id: d.dishId ?? d.id,
    name: d.dishName ?? d.name ?? "",
    description: d.description ?? "",
    price: d.price ?? 0,
    calo: d.calo ?? d.calories ?? 0,
    category: d.category ?? "",
    type: d.type ?? "",
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

export async function getDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.get(`/dish/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("🍕 Dữ liệu món chi tiết:", res);
  return normalizeDish(res);
}

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
          type: payload.type || "BUILD_MUSCLE",
        }),
      ],
      { type: "application/json" }
    )
  );

  if (payload.imageFile instanceof File) {
    formData.append("image", payload.imageFile);
  }

  const res = await apiConfig.post("/dish", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res;
}

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
          type: payload.type || "BUILD_MUSCLE",
        }),
      ],
      { type: "application/json" }
    )
  );

  if (payload.imageFile instanceof File) {
    formData.append("image", payload.imageFile);
  }

  const res = await apiConfig.put(`/dish/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res;
}

export async function deleteDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.delete(`/dish/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
}
