import apiConfig from "../api/apiConfig";

export function normalizeStaff(s = {}) {
  const staffId = s.staffId ?? s.id;
  const accountId = s.accountId;

  return {
    id: staffId,
    staffId,
    accountId,
    username: s.username,
    name: s.fullName,
    phone: s.phone || "",
    email: s.email || "",
    role: String(s.role || "").toUpperCase(),
    dob: s.dob || "",
  };
}

export async function findStaffByUsername(username) {
  if (!username) return null;
  const res = await apiConfig.get("/staff", {
    params: { page: 0, size: 1000 },
  });
  const list = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];
  const exact = list.find(
    (x) =>
      String(x?.username || "").toLowerCase() === String(username).toLowerCase()
  );
  return exact ? normalizeStaff(exact) : null;
}

export async function createStaff(payload) {
  const res = await apiConfig.post("/staff", payload);
  return Array.isArray(res?.result) || res?.result?.id ? res.result : res;
}

export async function listStaffPaging({
  page = 1,
  size = 6,
  excludeRoles = [],
  ...filter
} = {}) {
  const res = await apiConfig.get("/staff", {
    params: { page: 0, size: 1000, ...filter },
  });

  const data = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];

  const blacklist = new Set(excludeRoles.map((r) => String(r).toUpperCase()));
  const filtered = data.filter(
    (x) => !blacklist.has(String(x.role || "").toUpperCase())
  );

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = (page - 1) * size;
  const end = start + size;

  return {
    items: filtered.slice(start, end).map(normalizeStaff),
    pageInfo: {
      page,
      size,
      totalPages,
      totalElements,
      numberOfElements: Math.min(size, filtered.length - start),
      first: page === 1,
      last: page >= totalPages,
    },
  };
}

export async function getStaff(id) {
  const res = await apiConfig.get(`/staff/${id}`);
  return normalizeStaff(res?.result ?? res);
}

export async function updateStaff(staffId, payload) {
  return apiConfig.put(`/staff/${staffId}`, payload);
}

export async function deleteStaff(staffId) {
  const res = await apiConfig.delete(`/staff/${staffId}`);
  return res ?? null;
}
