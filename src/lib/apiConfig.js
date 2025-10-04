//========================= CẤU HÌNH CHUNG =========================//

export const USE_PROXY = true; // true = đang chạy local (Vite dev)
export const BASE_HOST = "https://backend2-production-00a1.up.railway.app";
export const API_PREFIX = "/isp392";
export const PROXY_PREFIX = "/api";

//========================== TOKEN & HEADER =========================//

import { getToken } from "./auth";

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${getToken() || ""}`,
  };
}

//========================= GHÉP URL =========================//

export function apiPath(pathStr) {
  const prefix = USE_PROXY ? PROXY_PREFIX : API_PREFIX;
  return USE_PROXY ? `${prefix}${pathStr}` : `${BASE_HOST}${prefix}${pathStr}`;
}

//=========================== XỬ LÝ RESPONSE =========================//

export async function handleResponse(res) {
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !(data?.code === 0 || data?.code === 1000)) {
    throw new Error(data?.message || "Yêu cầu thất bại.");
  }

  return data?.result ?? data;
}
