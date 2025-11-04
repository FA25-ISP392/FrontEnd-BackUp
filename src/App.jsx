import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import StaffPage from "./pages/StaffPage.jsx";
import Admin from "./pages/Admin.jsx";
import Manager from "./pages/Manager.jsx";
import Chef from "./pages/Chef.jsx";
import ProtectedRoute from "./components/Handle/ProtectedRoute.jsx";
import "./App.css";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFail from "./pages/PaymentFail.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/home/*" element={<Home />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentFail />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="*" element={<NotFoundPage />} />

      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={["STAFF"]}>
            <MainLayout
              headerProps={{
                icon: "👥",
                title: "Trang nhân viên",
                subtitle: "Quản lý dịch vụ khách hàng",
                theme: "staff", // 👈 THÊM VÀO ĐÂY
              }}
              showFooter={false}
            >
              <Routes>
                <Route index element={<Navigate to="sodoban" replace />} />
                <Route
                  path="sodoban"
                  element={<StaffPage section="tableLayout" />}
                />
                <Route
                  path="thongtinban"
                  element={<StaffPage section="overview" />}
                />
                <Route
                  path="phucvumon"
                  element={<StaffPage section="serveBoard" />}
                />
                <Route
                  path="lichsuphucvu"
                  element={<StaffPage section="serveHistory" />}
                />
                <Route path="*" element={<Navigate to="sodoban" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MainLayout
              headerProps={{
                icon: "📊",
                title: "Trang quản trị",
                subtitle: "Quản lý hệ thống",
                theme: "admin", // 👈 THÊM VÀO ĐÂY
              }}
              showFooter={false}
            >
              <Admin />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chef"
        element={
          <ProtectedRoute allowedRoles={["CHEF"]}>
            <MainLayout
              headerProps={{
                icon: "👨‍🍳",
                title: "Trang bếp",
                subtitle: "Quản lý món ăn và đơn hàng",
                theme: "chef", // 👈 THÊM VÀO ĐÂY
              }}
              showFooter={false}
            >
              <Chef />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <MainLayout
              headerProps={{
                icon: "👔",
                title: "Trang quản lý",
                subtitle: "Quản lý nhà hàng",
                theme: "manager", // 👈 THÊM VÀO ĐÂY
              }}
              showFooter={false}
            >
              <Manager />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
