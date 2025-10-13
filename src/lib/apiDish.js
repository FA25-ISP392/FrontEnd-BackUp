import apiConfig from "../api/apiConfig";

export function normalizeDish(d = {}) {
  return {
    id: d.dishId ?? d.id,
    name: d.dish_name ?? d.dishName ?? "",
    price: d.price ?? 0,
    category: d.category ?? "",
    // status: d.status === "available" ? 1 : d.status === 1 ? 1 : 0,
    is_available:
      d.isAvailable ??
      d.is_available ??
      (d.status === "available" || d.status === 1),
    calories: d.calo ?? d.calories ?? 0,
    description: d.description ?? "",
    picture: d.picture ?? "",
  };
}

export async function createDish(payload) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.post("/dish", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

export async function listDish(params = {}) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.get("/dish", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const arr = Array.isArray(res) ? res : [];
  return arr.map(normalizeDish);
}

export async function getDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.get(`/dish/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

export async function updateDish(id, payload) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.put(`/dish/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

export async function deleteDish(id) {
  const token = localStorage.getItem("token");
  const res = await apiConfig.delete(`/dish/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}
