import apiConfig from "../api/apiConfig";

export function normalizeStaff(s = {}) {
  return {
    id: s.staffId ?? s.id,
    username: s.account?.username ?? s.username ?? "",
    name:
      s.staffName ??
      s.staff_name ??
      s.name ??
      s.account?.fullName ??
      s.account?.name ??
      "",
    phone: s.staffPhone ?? s.staff_phone ?? s.phone ?? "",
    email: s.staffEmail ?? s.staff_email ?? s.email ?? "",
    role: s.account?.role ?? s.role ?? "",
    status: s.status ?? "active",
  };
}

export async function createStaff(payload) {
  const res = await apiConfig.post("/staff", payload);
  return res;
}

export async function listStaff(params = {}) {
  const res = await apiConfig.get("/staff", { params });
  const arr = Array.isArray(res) ? res : [];
  return arr.map(normalizeStaff);
}

export async function listNonAdmin(params = {}) {
  const all = await listStaff(params);
  return all.filter((x) => (x.role || "").toUpperCase() !== "ADMIN");
}

export async function getStaff(id) {
  return await apiConfig.get(`/staff/${id}`);
}

export async function updateStaff(id, payload) {
  return await apiConfig.put(`/staff/${id}`, payload);
}

export async function deleteStaff(id) {
  return await apiConfig.delete(`/staff/${id}`);
}
