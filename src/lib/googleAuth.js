import apiConfig from "../api/apiConfig";
import { parseJWT } from "./auth";

function getApiURL() {
  const raw = String(apiConfig?.defaults?.baseURL || "");
  try {
    // Cho DEV: "/api" -> "http(s)://<frontend-origin>/api"
    // Cho PROD: "https://api.../isp392" giữ nguyên
    return new URL(raw, window.location.origin);
  } catch {
    return new URL("/", window.location.origin);
  }
}

const apiURL = getApiURL();
const apiOrigin = apiURL.origin;

function openPopup(url, name = "google_oauth", w = 520, h = 640) {
  const left =
    (window.screenX || window.screenLeft || 0) + (window.innerWidth - w) / 2;
  const top =
    (window.screenY || window.screenTop || 0) + (window.innerHeight - h) / 2;
  const features = `scrollbars=yes,width=${w},height=${h},top=${top},left=${left}`;
  const popup = window.open(url, name, features);
  if (!popup)
    throw new Error(
      "Trình duyệt đang chặn popup. Hãy cho phép popup và thử lại."
    );
  popup.focus();
  return popup;
}

export async function loginWithGooglePopup() {
  // baseURL có thể là "/api" (DEV) hoặc "https://api.../isp392" (PROD)
  const base = String(apiConfig?.defaults?.baseURL || "");
  const loginUrl = new URL(
    // luôn tạo URL tuyệt đối để tránh lỗi tương tự
    `${base.replace(/\/$/, "")}/oauth2/authorization/google`,
    window.location.origin
  ).toString();

  const popup = openPopup(loginUrl);

  return new Promise((resolve, reject) => {
    let finished = false;
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      clearInterval(pollClosed);
      clearTimeout(timeout);
    };

    const finish = (token) => {
      if (finished) return;
      finished = true;
      try {
        popup.close();
      } catch {}
      try {
        localStorage.setItem("token", `Bearer ${token}`);
        const user = parseJWT(token) || {};
        localStorage.setItem("user", JSON.stringify(user));
      } catch {}

      window.dispatchEvent(new Event("auth:changed"));
      window.location.reload();

      cleanup();
      resolve({ token });
    };

    const onMessage = (ev) => {
      // chấp nhận từ FE origin hiện tại và từ API origin
      const allowedOrigins = [window.location.origin, apiOrigin];
      if (!allowedOrigins.includes(ev.origin)) return;
      const msg = ev.data || {};
      if (msg.type === "OAUTH_SUCCESS" && msg.token) {
        finish(msg.token);
      }
    };

    window.addEventListener("message", onMessage);

    const pollClosed = setInterval(() => {
      if (popup.closed && !finished) {
        cleanup();
        reject(new Error("Bạn đã đóng cửa sổ đăng nhập Google."));
      }
    }, 400);

    const timeout = setTimeout(() => {
      cleanup();
      try {
        popup.close();
      } catch {}
      reject(new Error("Hết thời gian xác thực Google."));
    }, 2 * 60 * 1000);
  });
}
