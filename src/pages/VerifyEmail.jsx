import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiConfig from "../api/apiConfig";
import { HOME_ROUTES } from "../constant/routes";
import { showToast } from "../common/ToastHost";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    //===== Đọc token từ URL mà BE gửi =====
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    (async () => {
      try {
        //===== Nếu có token thì gọi hàm để tiến hành xác thực =====
        //===== Lấy endpoint GET lấy ra xác thực =====
        await apiConfig.get("/auth/verify-email", { params: { token } });
        //===== Nếu thành công thì thông báo và chuyển về trang đăng nhập =====
        setStatus("success");
        showToast(
          "Xác thực email thành công! Bạn có thể đăng nhập.",
          "success"
        );
        setTimeout(() => navigate(HOME_ROUTES.LOGIN, { replace: true }), 1800);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    })();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {status === "loading" && (
        <p className="text-gray-600 animate-pulse">Đang xác thực email...</p>
      )}
      {status === "success" && (
        <p className="text-green-600 font-semibold">
          Email đã được xác thực! Đang chuyển hướng đến đăng nhập...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-semibold">
          ❌ Liên kết không hợp lệ hoặc đã hết hạn.
        </p>
      )}
    </div>
  );
}
