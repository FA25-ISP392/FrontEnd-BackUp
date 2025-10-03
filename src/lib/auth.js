// ====================CẤU HÌNH ĐƯỜNG DẪN API====================

//Vì Vite chạy localhost nên phải cần thông qua Proxy để chuyển từ localhost sang thành đường dẫn API
const USE_PROXY = true; //Bật/Tắt Proxy
const BASE_URL = "https://isp392-production.up.railway.app/isp392/auth/token"; //Nơi chứa đường dẫn API mà BE đưa cho

const LOGIN_PATH = USE_PROXY ? "/api/auth/token" : "/isp392/auth/token"; //Nếu muốn dùng cho việc đăng nhập thì làm như này

//Chia role
export const roleRoutes = {
  ADMIN: "/admin",
  MANAGER: "/manager",
  STAFF: "/staff",
  CHEF: "/chef",
};

// ====================TIỆN ÍCH JWT và PHIÊN====================

//Cấu hình và sử dụng JWT&PHIÊN
//Giải mã đoạn token để lấy ra phần mong muốn
export function parseJWT(token) {
  try {
    // Tách phần payload (ở giữa, index [1])
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    // base64url -> base64 + padding
    // Chuyển base64url -> base64 chuẩn + thêm padding
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);

    // Giải mã base64 thành chuỗi JSON
    const json = atob(base64);

    // Parse JSON thành object JavaScript
    return JSON.parse(json);
  } catch (e) {
    console.error("decode JWT error:", e);
    return null;
  }
}

//Lấy ra role trong API để phân quyền
export function getRoleFromToken(decode) {
  return decode?.role || null;
}

//Lưu token và user info sau khi đã login thành công, để khi load lại trang không bị văng ra ngoài
export function saveSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // console.log("💾 saveSession: token saved?", !!localStorage.getItem("token"));
}

//Lấy ra token đã lưu ở trên, nếu nó không có gì === null thì cho ra ngoài
export function getToken() {
  return localStorage.getItem("token");
}

//Lấy ra user info đã lưu trong localStorage
export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

//Lấy ra role
export function getCurrentRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const d = parseJWT(token);
  return d?.role || d?.roles?.[0] || d?.authorities?.[0] || null;
}

//Xoá hết token lẫn user info === dùng cho khi ấn Logout
export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

//Xác định Role nhận vào để phân quyền
export function resolveRouteByRole(role) {
  if (!role) return "/";
  const key = role.toString().toUpperCase();
  return roleRoutes[key] ?? "/";
}

//Kiểm tra xem người dùng có đang đăng nhập hợp lệ không
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  const decoded = parseJWT(token);
  if (!decoded) return false;
  if (decoded.exp && Date.now() / 1000 >= decoded.exp) return false;
  return true;
}

// ====================CALL API LOGIN====================
export async function apiLogin({ username, password }) {
  const url = USE_PROXY ? LOGIN_PATH : BASE_URL + LOGIN_PATH;

  //Gọi ra fetch API
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    mode: "cors",
    credentials: "omit", //Dùng token không dùng cookie
    body: JSON.stringify({ username, password }),
  });

  //In ra lỗi nếu có phát hiện
  if (!res.ok) {
    let msg = "UserName hoặc Passowrd không đúng.";
    try {
      const error = await res.json();
      msg = error?.message || msg;
    } catch {
      msg = "Đã xảy ra lỗi. Vui lòng thử lại.";
    }
    throw new Error(msg);
  }

  //Parse dữ liệu từ BE
  const data = await res.json();

  //Kiểm tra xem BE có xác thực thành công không
  const ok =
    (data?.code === 1000 || data?.code === 0) &&
    data?.result?.authenticated &&
    data?.result?.token;

  if (!ok) throw new Error("Xác thực thất bại. Vui lòng thử lại.");

  //Giải mã token và lấy role
  const token = data.result.token;
  const decode = parseJWT(token);
  const role = getRoleFromToken(decode);

  // console.log("🔎 API DATA:", data);
  // console.log("🔎 decoded:", decode);
  // console.log("🔎 role:", role);

  //Trả ra kết quả để xử lý
  return {
    token,
    role,
    user: {
      username,
      authenticated: true,
      decode,
    },
  };
}

// ====================LOGOUT====================
export function logout(redirectTo = "/") {
  clearSession();
  window.location.href = redirectTo;
}
