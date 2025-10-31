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
          const tempProfile = {
            username,
            fullName,
            email,
            role: "CUSTOMER",
            phone: jwtPayload.phone || "",
          };
          saveSession({ token, user: tempProfile });
          const customerData = await ensureCustomerForUser(tempProfile);
          const finalProfile = {
            ...tempProfile,
            ...customerData,
            fullName: customerData.fullName || tempProfile.fullName,
            customerId: customerData.customerId || customerData.id,
            role: "CUSTOMER",
          };
          saveSession({ token, user: finalProfile });
          window.dispatchEvent(new Event("auth:changed"));
          const tableId = sessionStorage.getItem("currentTableId");
          if (tableId) {
            sessionStorage.setItem("customerTableId", tableId);
            sessionStorage.removeItem("currentTableId");
            navigate("/menu", { replace: true });
          } else {
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
