import axios from "axios";
import { getToken } from "../lib/auth";

const USE_PROXY = !!import.meta.env.DEV;
const BASE_API =
  import.meta.env.VITE_API_BASE || "https://api-monngon88.purintech.id.vn";
// const BASE_API =
//   import.meta.env.VITE_API_BASE || "https://backend-79cz.onrender.com";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/isp392";
const PROXY_PREFIX = import.meta.env.VITE_PROXY_PREFIX || "/api";

const baseURL = USE_PROXY ? PROXY_PREFIX : `${BASE_API}${API_PREFIX}`;

function isPublicEndpoint(url = "", method = "get") {
  const u = String(url);
  const m = String(method || "get").toLowerCase();

  const isOauthPublic =
    /\/auth\/(token|google|success|login|register|callback)(\/|$)?/i.test(u) ||
    /\/login\/oauth2\/code\/(google|github|facebook)(\/|$)?/i.test(u);

  const isPublicCustomerCreate = /\/customer(\/|$)/i.test(u) && m === "post";

  const isVerifyEmail = /\/auth\/verify-email(\/|\?|$)/i.test(u) && m === "get";

  return isOauthPublic || isPublicCustomerCreate || isVerifyEmail;
}

function unwrapResponse(res) {
  if (!res) return null;
  if (res.status === 204) return null;

  const d = res.data ?? {};

  if (d?.code === 0 || d?.code === 1000) return d.result ?? d;

  if (d?.token || d?.accessToken || d?.id_token) return d;
  if (d?.result?.token || d?.result?.accessToken || d?.result?.id_token)
    return d.result;

  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") return d;

  if (typeof d === "string") {
    if (d.length > 20) return { token: d };
    return { message: d };
  }
  if (typeof d === "number") return { code: d };

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

const apiConfig = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiConfig.interceptors.request.use((config) => {
  const raw = getToken();
  const token = raw ? String(raw).replace(/^Bearer\s+/i, "") : "";
  const url = config.url || "";
  const method = config.method || "get";

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
    console.debug("[API REQUEST] unable to compute full url", e);
  }

  if (token && !isPublicEndpoint(url, method)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
  }

  return config;
});

apiConfig.interceptors.response.use(
  (res) => unwrapResponse(res),
  (error) => Promise.reject(wrapError(error))
);

export const REAL_BACKEND_BASE = `${BASE_API}${API_PREFIX}`;
export { PROXY_PREFIX };
export function getOriginalBackendUrl() {
  return REAL_BACKEND_BASE;
}

export default apiConfig;
