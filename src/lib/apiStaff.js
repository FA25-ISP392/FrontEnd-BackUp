// BẬT/TẮT proxy Vite. Nếu === true thì phải có proxy trong vite.config.js
const USE_PROXY = true;
const BASE_URL = "https://isp392-production.up.railway.app";
const STAFF_PATH = USE_PROXY ? "/api/staff" : "/isp392/staff";

import { getToken } from "../lib/auth"; 

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${getToken() || ""}`,
  };
}

async function handle(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  //Nếu ra code 0 hoặc 1000 là thành công 
  if (!res.ok || !(data?.code === 0 || data?.code === 1000)) {
    throw new Error(data?.message || "Yêu cầu thất bại.");
  }
  return data?.result ?? data;
}

// Helper gộp host + path khi KHÔNG dùng proxy
function makeUrl(path) {
  return USE_PROXY ? path : BASE_URL + path;
}

// ==================== STAFF API ====================
// POST /staff — tạo nhân viên mới
export async function createStaff(payload) {
  const res = await fetch(makeUrl(STAFF_PATH), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload), //Lấy ra cái token bên trong payload rồi biên dịch ra
  });
  return handle(res);
}

// // GET /staff — danh sách
// export async function listStaff() {
//   const res = await fetch(makeUrl(STAFF_PATH), { headers: authHeaders() });
//   return handle(res);
// }

// // GET /staff/{id} — chi tiết
// export async function getStaff(id) {
//   const res = await fetch(makeUrl(`${STAFF_PATH}/${id}`), { headers: authHeaders() });
//   return handle(res);
// }

// // PUT /staff/{id} — cập nhật
// export async function updateStaff(id, payload) {
//   const res = await fetch(makeUrl(`${STAFF_PATH}/${id}`), {
//     method: "PUT",
//     headers: authHeaders(),
//     body: JSON.stringify(payload),
//   });
//   return handle(res);
// }

// // DELETE /staff/{id} — xoá
// export async function deleteStaff(id) {
//   const res = await fetch(makeUrl(`${STAFF_PATH}/${id}`), {
//     method: "DELETE",
//     headers: authHeaders(),
//   });
//   return handle(res);
// }