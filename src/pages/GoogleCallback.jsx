import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveSession,
  parseJWT,
  getUsernameFromToken, // 👈 Cần thiết
  getFullNameFromToken, // 👈 Cần thiết
} from "../lib/auth";
import { ensureCustomerForUser } from "../lib/apiCustomer"; // 👈 Cần thiết

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("token");

    if (token) {
      (async () => {
        try {
          const jwtPayload = parseJWT(token) || {};

          const username = getUsernameFromToken(jwtPayload);
          const fullName = getFullNameFromToken(jwtPayload);
          const email = jwtPayload.email;

          // 1. Tạo profile tạm từ JWT
          const tempProfile = {
            username,
            fullName,
            email,
            role: "CUSTOMER",
            phone: jwtPayload.phone || "",
          };

          // 2. LƯU TOKEN TẠM THỜI vào localStorage để các API call tiếp theo được authorize
          saveSession({ token, user: tempProfile });

          // 3. GỌI API ĐỂ LẤY VÀ GHI ĐÈ THÔNG TIN CUSTOMER ĐẦY ĐỦ
          const customerData = await ensureCustomerForUser(tempProfile);

          // 4. Cập nhật profile cuối cùng với thông tin từ API
          const finalProfile = {
            ...tempProfile,
            ...customerData, // Ghi đè các trường chi tiết (height, weight, portion...)
            fullName: customerData.fullName || tempProfile.fullName,
            customerId: customerData.customerId || customerData.id,
            role: "CUSTOMER",
          };

          // 5. LƯU LẠI SESSION VỚI THÔNG TIN ĐẦY ĐỦ
          saveSession({ token, user: finalProfile });

          window.dispatchEvent(new Event("auth:changed"));
          navigate("/home", { replace: true });
        } catch (e) {
          console.error("Lỗi xử lý token/lấy profile:", e);
          // Quay về trang login nếu không thể lấy profile
          alert(
            "Đăng nhập Google thành công nhưng không thể tải thông tin profile."
          );
          navigate("/home/dangnhap", { replace: true });
        }
      })();
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
