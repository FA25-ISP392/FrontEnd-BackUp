import axios from "axios";
import { getToken } from "../lib/auth";

const USE_PROXY = true;
const BASE_HOT = "https://backend2-production-00a1.up.railway.app";
const API_PREFIX = "/isp392";
const PROXY_PREFIX = "/api";

const baseURL = USE_PROXY ? PROXY_PREFIX : `${BASE_HOT}${API_PREFIX}`;

const apiConfig = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

//Gắn Bearer token
apiConfig.interceptors.request.use((config) => {
  const isAuthLogin = (config.url || "").includes("/auth/token");
  if (!isAuthLogin) {
    const tk = getToken();
    if (tk) config.headers.Authorization = `Bearer ${tk}`;
  }
  return config;
});

//Chuẩn hóa respone
apiConfig.interceptors.response.use(
  (res) => {
    if (res.status === 204) return null;
    const d = res.data ?? {};
    if (d?.code === 0 || d?.code === 1000) return d.result ?? d;
    if (d?.token) return d;
    throw new Error(d?.message || "Yêu cầu thất bại.");
  },
  (err) => {
    const url = err?.config?.url;
    const data = err?.response?.data;

    // Nếu BE trả mảng lỗi (Spring Validation)
    const errorList = data?.result || data?.errors || [];
    const detailedMsg = Array.isArray(errorList)
      ? errorList
          .map((e) => e.defaultMessage || e.message || JSON.stringify(e))
          .join(" | ")
      : data?.message || "Không thể kết nối server.";

    return Promise.reject(new Error(detailedMsg));
  },
);

export default apiConfig;
