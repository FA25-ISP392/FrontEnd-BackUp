import apiConfig from "../api/apiConfig";

export const roleRoutes = {
  ADMIN: "/admin",
  MANAGER: "/manager",
  STAFF: "/staff",
  CHEF: "/chef",
};

// ==================== JWT & SESSION ====================
export function parseJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    const json = atob(base64);
    return JSON.parse(json);
  } catch (e) {
    console.error("decode JWT error:", e);
    return null;
  }
}

export function getRoleFromToken(decoded) {
  return (
    decoded?.role || decoded?.roles?.[0] || decoded?.authorities?.[0] || null
  );
}

export function saveSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getCurrentRole() {
  const token = getToken();
  if (!token) return null;
  const d = parseJWT(token);
  return getRoleFromToken(d);
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function resolveRouteByRole(role) {
  if (!role) return "/";
  const key = role.toString().toUpperCase();
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

  const token = data?.token;
  const authenticated = data?.authenticated ?? true;

  if (!token || authenticated === false) {
    throw new Error("Xác thực thất bại. Vui lòng thử lại.");
  }

  const decoded = parseJWT(token);
  const role = getRoleFromToken(decoded) || "STAFF";

  return {
    token,
    role,
    user: { username, authenticated: true, decode: decoded },
  };
}

export function logout(redirectTo = "/") {
  clearSession();
  window.location.href = redirectTo;
}
