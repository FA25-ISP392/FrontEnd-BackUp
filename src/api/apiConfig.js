// import axios from "axios";
// import { getToken } from "../lib/auth";

// const BASE_API =
//   import.meta.env.VITE_API_BASE || "https://api-monngon88.purintech.id.vn";
// //   import.meta.env.VITE_API_BASE || "https://backend2-production-00a1.up.railway.app";
// // import.meta.env.VITE_API_BASE ||
// // "https://backend-production-0865.up.railway.app";
// const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/isp392";

// const apiConfig = axios.create({
//   baseURL: `${BASE_API}${API_PREFIX}`,
//   headers: { Accept: "application/json", "Content-Type": "application/json" },
// });

// apiConfig.interceptors.request.use((config) => {
//   const raw = getToken();
//   const token = raw ? String(raw).replace(/^Bearer\s+/i, "") : "";
//   const url = String(config.url || "");
//   const method = String(config.method || "get").toLowerCase();
//   const isOauthPublic =
//     /\/auth\/(google|success|login|register|callback)(\/|$)?/i.test(url);
//   const isPublicCustomerCreate =
//     /\/customer(\/|$)/.test(url) && method === "post";
//   const isPublic = isOauthPublic || isPublicCustomerCreate;

//   if (token && !isPublic) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// apiConfig.interceptors.response.use(
//   (res) => {
//     if (res.status === 204) return null;
//     const d = res.data ?? {};
//     if (d?.code === 0 || d?.code === 1000) return d.result ?? d;
//     if (d?.token || d?.accessToken || d?.id_token) return d;
//     if (d?.result?.token || d?.result?.accessToken || d?.result?.id_token)
//       return d.result;
//     if (typeof d === "string" && d.length > 20) return { token: d };
//     if (d && typeof d === "object") return d;
//     throw new Error(d?.message || "Yêu cầu thất bại.");
//   },
//   (error) => {
//     const data = error?.response?.data;
//     const errorList = data?.result || data?.errors || [];
//     const detailedMsg = Array.isArray(errorList)
//       ? errorList
//           .map((e) => e?.defaultMessage || e?.message || JSON.stringify(e))
//           .join(" | ")
//       : data?.message || "Không thể kết nối server.";
//     const wrapped = new Error(detailedMsg);
//     wrapped.response = error.response;
//     wrapped.status = error?.response?.status;
//     wrapped.data = data;
//     wrapped.url = error?.config?.url;
//     return Promise.reject(wrapped);
//   }
// );

// export default apiConfig;

// src/lib/apiConfig.js
import axios from "axios";
import { getToken } from "../lib/auth";

/** ========= Base URL resolution ========= **/
const USE_PROXY = !!import.meta.env.DEV; // Vite dev: dùng proxy để tránh CORS
const BASE_API =
  import.meta.env.VITE_API_BASE ||
  "https://api-monngon88.purintech.id.vn/isp392";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || ""; // default empty: backend has no prefix
const PROXY_PREFIX = import.meta.env.VITE_PROXY_PREFIX || "/api"; // cấu hình trong vite.config

const baseURL = USE_PROXY ? PROXY_PREFIX : `${BASE_API}${API_PREFIX}`;

/** ========= Helpers ========= **/
function isPublicEndpoint(url = "", method = "get") {
  const u = String(url);
  const m = String(method || "get").toLowerCase();

  // Mọi route OAuth / Auth public (Spring Security + custom)
  // const isOauthPublic =
  //   /\/auth\/(google|success|login|register|callback)(\/|$)?/i.test(u) ||
  //   /\/login\/oauth2\/code\/(google|github|facebook)(\/|$)?/i.test(u);
  const isOauthPublic =
    /\/auth\/(token|google|success|login|register|callback)(\/|$)?/i.test(u) ||
    /\/login\/oauth2\/code\/(google|github|facebook)(\/|$)?/i.test(u);
  // Cho phép tạo khách hàng (đăng ký) không cần token
  const isPublicCustomerCreate = /\/customer(\/|$)/i.test(u) && m === "post";

  // Nếu cần thêm whitelist khác, thêm vào đây
  return isOauthPublic || isPublicCustomerCreate;
}

function unwrapResponse(res) {
  if (!res) return null;
  if (res.status === 204) return null;

  const d = res.data ?? {};

  // Chuẩn backend: { code: 0|1000, result: ... }
  if (d?.code === 0 || d?.code === 1000) return d.result ?? d;

  // Trường hợp trả token trực tiếp
  if (d?.token || d?.accessToken || d?.id_token) return d;
  if (d?.result?.token || d?.result?.accessToken || d?.result?.id_token)
    return d.result;

  // Khá nhiều BE trả về mảng/obj thuần
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") return d;

  // Một số trường hợp BE trả string dài (JWT) hoặc số (code 1000)
  if (typeof d === "string") {
    if (d.length > 20) return { token: d };
    return { message: d };
  }
  if (typeof d === "number") return { code: d };

  // Fallback
  throw new Error(d?.message || "Yêu cầu thất bại.");
}

function wrapError(error) {
  const data = error?.response?.data;
  const errorList = data?.result || data?.errors || [];
  const detailedMsg = Array.isArray(errorList)
    ? errorList
        .map((e) => e?.defaultMessage || e?.message || JSON.stringify(e))
        .join(" | ")
    : data?.message || "Không thể kết nối server.";

  const wrapped = new Error(detailedMsg);
  wrapped.response = error?.response;
  wrapped.status = error?.response?.status;
  wrapped.data = data;
  wrapped.url = error?.config?.url;
  return wrapped;
}

/** ========= Axios instance ========= **/
const apiConfig = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/** ========= Request interceptor ========= **/
apiConfig.interceptors.request.use((config) => {
  const raw = getToken();
  const token = raw ? String(raw).replace(/^Bearer\s+/i, "") : "";
  const url = config.url || "";
  const method = config.method || "get";

  // Compute and log the full request URL (base + path) for easier debugging in dev.
  // Use simple join rules similar to axios: trim trailing slash from base and leading
  // slash from url, then join with a single '/'. This preserves a relative base like '/api'.
  try {
    let fullUrl = String(url || "");
    if (!/^https?:\/\//i.test(fullUrl)) {
      const base = String(config.baseURL || baseURL || "");
      const baseWithOrigin = base.startsWith("/")
        ? `${location.origin}${base}`
        : base || location.origin;
      const baseNoSlash = baseWithOrigin.replace(/\/$/, "");
      const urlNoLeading = fullUrl.replace(/^\//, "");
      fullUrl = `${baseNoSlash}/${urlNoLeading}`;
    }
    if (import.meta.env.DEV) {
      console.info("[API REQUEST]", (method || "").toUpperCase(), fullUrl);
    }
  } catch (e) {
    // don't break requests if logging fails
    console.debug("[API REQUEST] unable to compute full url", e);
  }

  if (token && !isPublicEndpoint(url, method)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/** ========= Response interceptor ========= **/
apiConfig.interceptors.response.use(
  (res) => unwrapResponse(res),
  (error) => Promise.reject(wrapError(error)),
);

// Export resolved backend information so other modules can know the original backend URL.
// Note: in Vite dev mode requests go through the proxy (e.g. '/api'), so the browser
// will see proxied paths. Use these exported values to know the real target used
// in production or the configured fallback target.
export const REAL_BACKEND_BASE = `${BASE_API}${API_PREFIX}`;
export { PROXY_PREFIX };
export function getOriginalBackendUrl() {
  return REAL_BACKEND_BASE;
}

export default apiConfig;
