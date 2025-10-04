import { apiLogin, resolveRouteByRole, saveSession } from "../lib/auth";
import { useState } from "react";
import { findNameByUserName } from "../lib/apiStaff";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async ({ username, password, onSuccess }) => {
    setError("");
    setIsLoading(true);
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      setIsLoading(false);
      return;
    }

    try {
      // 1) Đăng nhập để lấy token + role (userFromLogin có thể có/không)
      const {
        token,
        role,
        user: userFromLogin,
      } = await apiLogin({ username, password });

      let profile = null;
      try {
        profile = await findNameByUserName(username, token); // ← truyền token ở đây
      } catch {}

      const raw = { username, ...userFromLogin, ...profile };
      const staff_name = raw.staff_name ?? raw.staffName ?? username;

      const userForSession = {
        ...raw,
        username: raw.username ?? raw.usename ?? username,
        staff_name,
        displayName: staff_name,
        authenticated: true,
      };

      // giờ mới lưu vào localStorage
      saveSession({ token, user: userForSession });

      const path = resolveRouteByRole(role);
      typeof onSuccess === "function"
        ? onSuccess(path)
        : (window.location.href = path);
    } catch (e) {
      setError(
        e.message?.includes("Failed to fetch.")
          ? "Không thể kết nối đến server. Vui lòng thử lại sau."
          : e.message || "Có lỗi xảy ra."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
