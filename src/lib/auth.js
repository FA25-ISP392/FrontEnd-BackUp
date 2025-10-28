import apiConfig from "../api/apiConfig";
import { findStaffByUsername } from "./apiStaff";
import { ensureCustomerForUser } from "../lib/apiCustomer";

export const roleRoutes = {
  ADMIN: "/admin",
  MANAGER: "/manager",
  STAFF: "/staff",
  CHEF: "/chef",
  CUSTOMER: "/home",
};

export function parseJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRoleFromToken(decoded) {
  return (
    decoded?.role ||
    (Array.isArray(decoded?.roles) ? decoded.roles[0] : decoded?.roles) ||
    (Array.isArray(decoded?.authorities)
      ? decoded.authorities[0]
      : decoded?.authorities) ||
    null
  );
}

export function getRolesArray(decoded) {
  if (!decoded) return [];
  const raw = decoded.role || decoded.roles || decoded.authorities || [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.filter(Boolean).map((r) =>
    String(r)
      .replace(/^ROLE_/i, "")
      .toUpperCase()
  );
}

export function hasRole(decoded, role) {
  return getRolesArray(decoded).includes(String(role).toUpperCase());
}

export function getUsernameFromToken(d) {
  return (
    d?.username ||
    d?.preferred_username ||
    d?.sub ||
    (d?.email || "").split("@")[0] ||
    ""
  );
}

export function getFullNameFromToken(d) {
  return d?.fullName || d?.name || "";
}

export function saveSession({ token, user }) {
  const raw = String(token || "").replace(/^Bearer\s+/i, "");
  localStorage.setItem("token", raw);
  localStorage.setItem("user", JSON.stringify(user || null));
}

export function getToken() {
  const raw = localStorage.getItem("token");
  return raw ? String(raw) : "";
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentRole() {
  const token = getToken();
  if (!token) return null;
  const d = parseJWT(token);
  return getRoleFromToken(d);
}

export function resolveRouteByRole(role) {
  if (!role) return "/";
  const key = String(role).toUpperCase();
  return roleRoutes[key] ?? "/";
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  const decoded = parseJWT(token);
  if (!decoded) return false;
  if (decoded.exp && Date.now() / 1000 >= decoded.exp) return false;
  return true;
}

export async function apiLogin({ username, password }) {
  const data = await apiConfig.post("/auth/token", { username, password });

  const token =
    data?.token || data?.accessToken || data?.id_token || data?.result?.token;
  const authenticated = data?.authenticated ?? true;
  if (!token || authenticated === false) {
    throw new Error("Xác thực thất bại. Vui lòng thử lại.");
  }

  const decoded = parseJWT(token) || {};
  const role = getRoleFromToken(decoded) || "STAFF";
  const jwtName = getFullNameFromToken(decoded);
  const jwtUsername = getUsernameFromToken(decoded) || username;

  let user = {
    username: jwtUsername,
    fullName: jwtName || jwtUsername,
    role,
    email: decoded?.email || "",
    phone: decoded?.phone || "",
  };
  saveSession({ token, user });

  try {
    const staff = await findStaffByUsername(jwtUsername);
    if (staff) {
      user = {
        ...user,
        ...staff,
        fullName: staff.name || staff.fullName || user.fullName,
      };
      saveSession({ token, user });
    }
  } catch {}
  try {
    window.dispatchEvent(new Event("auth:changed"));
  } catch {}

  return { token, role, user };
}

export async function apiLoginCustomer({ username, password }) {
  const data = await apiConfig.post("/auth/token", { username, password });
  const token =
    data?.token || data?.accessToken || data?.id_token || data?.result?.token;
  const authenticated = data?.authenticated ?? true;

  if (!token || authenticated === false) {
    throw new Error("Xác thực thất bại. Vui lòng thử lại.");
  }

  const decoded = parseJWT(token) || {};
  if (!hasRole(decoded, "CUSTOMER")) {
    const err = new Error("Tài khoản không phải KHÁCH HÀNG.");
    err.code = "NOT_CUSTOMER";
    throw err;
  }

  const baseProfile = {
    username: getUsernameFromToken(decoded) || username,
    fullName: getFullNameFromToken(decoded) || username,
    email: decoded?.email || "",
    phone: decoded?.phone || "",
    role: "CUSTOMER",
  };

  // 👉 LƯU TOKEN NGAY LÚC NÀY để các request tiếp theo có Authorization
  saveSession({ token, user: baseProfile });

  // Sau khi có Authorization, gọi ensureCustomerForUser sẽ không bị 401
  const cus = await ensureCustomerForUser({
    username: baseProfile.username,
    fullName: baseProfile.fullName,
    email: baseProfile.email,
    phone: baseProfile.phone,
  });

  const customerId = cus?.customerId ?? cus?.id ?? null;
  const profile = {
    ...baseProfile,
    fullName: cus?.fullName || baseProfile.fullName,
    email: cus?.email || baseProfile.email,
    phone: cus?.phone || baseProfile.phone,
    customerId,
  };

  // Cập nhật lại user hoàn chỉnh
  saveSession({ token, user: profile });
  try {
    window.dispatchEvent(new Event("auth:changed"));
  } catch {}
  return { token, role: "CUSTOMER", user: profile };
}

export function logout(redirectTo = "/") {
  clearSession();
  window.location.href = redirectTo;
}

export function logoutCustomer(redirectTo = "/home") {
  clearSession();
  window.location.href = redirectTo;
}
