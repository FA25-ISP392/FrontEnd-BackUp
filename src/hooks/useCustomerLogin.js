import { apiLoginCustomer } from "../lib/auth";
import { useState, useCallback } from "react";

export function useCustomerLogin() {
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState("");

  const clearError = useCallback(() => setErr(""), []);

  const login = useCallback(
    async ({ username, password, onSuccess }) => {
      if (isLoading) return false;
      const u = String(username || "").trim();
      const p = String(password || "").trim();

      setErr("");
      if (!u || !p) {
        setErr("Vui lòng nhập đầy đủ thông tin.");
        return false;
      }

      setLoading(true);
      try {
        const { token, user } = await apiLoginCustomer({
          username: u,
          password: p,
        });
        if (typeof onSuccess === "function") onSuccess();
        return true;
      } catch (e) {
        const msg = e?.message || "";

        if (e?.code === "NOT_CUSTOMER") {
          setErr("Tài khoản không có quyền truy cập.");
          return false;
        }

        if (/khách\s*hàng|customer/i.test(msg)) {
          setErr("Tài khoản không có quyền truy cập.");
        } else if (/401|unauth|credential|password/i.test(msg)) {
          setErr("Sai tên đăng nhập hoặc mật khẩu.");
        } else if (/Network|connect|Failed to fetch|timeout/i.test(msg)) {
          setErr("Không thể kết nối server. Vui lòng thử lại sau.");
        } else {
          setErr(msg || "Tên đăng nhập hoặc Mật khẩu sai. Vui lòng thử lại.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isLoading]
  );

  return { login, isLoading, error, clearError };
}
