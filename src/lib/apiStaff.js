import apiConfig from "../api/apiConfig";

export function normalizeStaff(s = {}) {
  const staffId = s.staffId ?? s.id;
  const accountId = s.accountId;
  return {
    id: staffId,
    staffId,
    accountId,
    username: s.username || "",
    name: s.fullName || "",
    phone: s.phone || "",
    email: s.email || "",
    role: (s.role || "").toUpperCase(),
    dob: s.dob || "",
  };
}

export async function findStaffByUsername(username) {
  if (!username) return null;
  const res = await apiConfig.get("/staff", { params: { username } });
  const arr = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];
  return arr.length ? normalizeStaff(arr[0]) : null;
}

export async function createStaff(payload) {
  const res = await apiConfig.post("/staff", payload);
  return Array.isArray(res?.result) || res?.result?.id ? res.result : res;
}

export async function listStaff(params = {}) {
  const res = await apiConfig.get("/staff", { params });
  const arr = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];
  return arr.map(normalizeStaff);
}

export async function listNonAdmin(params = {}) {
  const all = await listStaff(params);
  return all.filter((x) => (x.role || "").toUpperCase() !== "ADMIN");
}

export async function getStaff(id) {
  const res = await apiConfig.get(`/staff/${id}`);
  return normalizeStaff(res?.result ?? res);
}

export async function updateStaff(staffId, payload) {
  return apiConfig.put(`/staff/${staffId}`, payload);
}

export async function deleteStaff(staffId) {
  const id = Number(staffId);
  if (!id || Number.isNaN(id)) throw new Error("Thiếu hoặc sai staffId.");
  // apiConfig sẽ trả null nếu 204, hoặc {code,message,result} nếu 200
  const res = await apiConfig.delete(`/staff/${id}`);
  return res ?? null;
}
