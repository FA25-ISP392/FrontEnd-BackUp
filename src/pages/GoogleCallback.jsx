import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession, parseJWT } from "../lib/auth";

export default function GoogleCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("token");

    if (token) {
      try {
        const user = parseJWT(token) || {};
        saveSession({ token, user });
        window.dispatchEvent(new Event("auth:changed"));
        navigate("/home", { replace: true });
      } catch (e) {
        console.error("Lỗi xử lý token:", e);
        alert("Đăng nhập Google thành công nhưng không thể xử lý token.");
        navigate("/home/dangnhap", { replace: true });
      }
    } else {
      alert("Đăng nhập Google không thành công (thiếu token).");
      navigate("/home/dangnhap", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Đang xử lý đăng nhập Google...
    </div>
  );
}
