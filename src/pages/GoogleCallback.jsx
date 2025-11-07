import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveSession,
  parseJWT,
  getUsernameFromToken,
  getFullNameFromToken,
} from "../lib/auth";
import { ensureCustomerForUser } from "../lib/apiCustomer";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    //===== Phân tích JWT do phía BE cung cấp =====
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("token");

    if (token) {
      (async () => {
        try {
          //===== Nếu tìm thấy token thì sẽ giải mã token =====
          const jwtPayload = parseJWT(token) || {};
          //===== Lấy ra username ======
          const username = getUsernameFromToken(jwtPayload);
          //===== Lấy ra fullName =====
          const fullName = getFullNameFromToken(jwtPayload);
          const email = jwtPayload.email;
          //===== Tạo 1 bộ profile tạm thời =====
          const tempProfile = {
            username,
            fullName,
            email,
            role: "CUSTOMER",
            phone: jwtPayload.phone || "",
          };
          //===== Lưu các thông tin đó lại vào session =====
          saveSession({ token, user: tempProfile });
          //===== Lưu vào session thì sẽ gọi hàm để kiểm tra thông tin người dùng =====
          const customerData = await ensureCustomerForUser(tempProfile);
          //===== Khi xong tạo ra profile thực của khách hàng =====
          const finalProfile = {
            ...tempProfile,
            ...customerData,
            fullName: customerData.fullName || tempProfile.fullName,
            customerId: customerData.customerId || customerData.id,
            role: "CUSTOMER",
          };
          saveSession({ token, user: finalProfile });
          //==== Gửi thông báo rằng người dùng đã đăng nhập =====
          window.dispatchEvent(new Event("auth:changed"));
          const tableId = sessionStorage.getItem("currentTableId");
          if (tableId) {
            //===== Kiểm tra xem người dùng nếu đang thao tác quét QR =====
            sessionStorage.setItem("customerTableId", tableId);
            sessionStorage.removeItem("currentTableId");
            //===== Đúng đường link quét QR thì gửi về trang Menu
            navigate("/menu", { replace: true });
          } else {
            //===== Nếu chỉ là đăng nhập bth thì vào trang Home =====
            navigate("/home", { replace: true });
          }
        } catch (e) {
          console.error("Lỗi xử lý token/lấy profile:", e);
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
