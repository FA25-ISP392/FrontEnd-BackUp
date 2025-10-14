import { apiLogin, resolveRouteByRole, saveSession } from "../lib/auth";
import { useState } from "react";

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
      const { token, role, user } = await apiLogin({ username, password });
      saveSession({ token, user });

      //Điều hướng theo role
      const path = resolveRouteByRole(role);
      typeof onSuccess === "function"
        ? onSuccess(path)
        : (window.location.href = path);
    } catch (e) {
      setError(
        /Network|connect|Failed to fetch/i.test(e.message)
          ? "Không thể kết nối đến server. Vui lòng thử lại sau."
          : e.message || "Tên đăng nhập hoặc Mật khẩu sai. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
