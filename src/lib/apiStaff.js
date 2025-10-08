import { apiPath, authHeaders, handleResponse } from "../api/apiConfig";

export function normalizeStaff(s = {}) {
  return {
    id: s.staffId ?? s.id,
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
  const res = await fetch(apiPath("/staff"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function listStaff(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = apiPath(`/staff${query ? `?${query}` : ""}`);
  const res = await fetch(url, { headers: authHeaders() });
  const data = await handleResponse(res);
  const arr = Array.isArray(data) ? data : [];
  // console.log("[listStaff raw]", arr);
  // return arr.map(normalizeStaff);
  console.log("[listStaff raw]", arr);

  const mapped = arr.map((s) => normalizeStaff(s));
  const hasPromise = mapped.some((v) => v && typeof v.then === "function");
  console.log("[listStaff mapped -> hasPromise?]", hasPromise);

  const result = hasPromise ? await Promise.all(mapped) : mapped;

  console.log(
    "[listStaff result types]",
    result.map((x) => typeof x)
  );
  console.log("[listStaff sample]", result.slice(0, 3));
  console.table(
    result.map((x) => ({ id: x.id, name: x.name, email: x.email }))
  );

  return result;
}

export async function listNonAdmin(params = {}) {
  const all = await listStaff(params);
  return all.filter((x) => (x.role || "").toUpperCase() !== "ADMIN");
}

export async function getStaff(id) {
  const res = await fetch(apiPath(`/staff/${id}`), { headers: authHeaders() });
  return handleResponse(res);
}

export async function updateStaff(id, payload) {
  const res = await fetch(apiPath(`/staff/${id}`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteStaff(id) {
  const res = await fetch(apiPath(`/staff/${id}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function findNameByUserName(username, token) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`, // dùng token vừa login, KHÔNG lấy từ localStorage
  };

  const res = await fetch(apiPath("/staff"), { headers });
  const data = await handleResponse(res);
  const arr = Array.isArray(data) ? data : [];

  const me = arr.find((s) => {
    const u = s.account?.username ?? s.username ?? s.usename;
    return String(u || "").toLowerCase() === String(username).toLowerCase();
  });

  return me ? { ...me, staff_name: me.staffName || me.staff_name } : null;
}
