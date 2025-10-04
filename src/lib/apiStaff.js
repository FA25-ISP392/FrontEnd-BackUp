import { apiPath, authHeaders, handleResponse } from "./apiConfig";

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
  return handleResponse(res);
}

export async function listNonAdmin(params = {}) {
  const allStaff = await listStaff(params);
  if (!Array.isArray(allStaff)) return [];
  return allStaff.filter((staff) => staff.role?.toUpperCase() !== "ADMIN");
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
  const arr = Array.isArray(data) ? data : data?.item || [];

  const me = arr.find((s) =>
    [s.username, s.usename] // phòng trường hợp BE map sai chính tả
      .filter(Boolean)
      .some((u) => String(u).toLowerCase() === String(username).toLowerCase())
  );
  if (!me) return null;

  return { ...me, staff_name: me.staffName || me.staff_name };
}
