import { apiLogin, resolveRouteByRole, saveSession } from "../lib/auth";
import { useState } from "react";


export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error,  setError] = useState("");

  const login = async ({ username, password, onSuccess }) => {
    setError("");
    setIsLoading(true);
    console.log("username:", username, "password:", password);

    //Kiểm tra nếu người dùng không nhập gì 
    if ( !username || !password ){
      setError("Vui lòng nhập đầy đủ thông tin.");
      setIsLoading(false);
      return;
    }

    try {
      const { token, role, user } = await apiLogin({ username, password }); //Gọi API Login
      saveSession({ token, user }); //Lưu session về token và user info
      const path = resolveRouteByRole(role); //Tính đường dẫn để redirect trả về

      console.log("✅ LOGIN OK — role:", role, "→ redirect path:", path);

      //Điều hướng đường dẫn về trang phù hợp
      if (typeof onSuccess === "function") {
        onSuccess(path);
      } else {
        window.location.href = path;
      }
    } catch (e) {
      //Nếu lỗi về API/network
      setError(
        e.message?.includes("Failed to fetch.")
          ? "Không thể kết nối đến server. Vui lòng thử lại sau."
          : e.message || "Có lỗi xảy ra."
      );
    } finally {
      setIsLoading(false); //Tăt trạng thái Loading
    }
  };

  return { login, isLoading, error };
}