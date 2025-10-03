import { Routes, Route } from "react-router-dom";
import { homeHeader as HomeHeader, footer as Footer } from "./components/ui";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import StaffPage from "./pages/StaffPage.jsx";
import Admin from "./pages/Admin.jsx";
import Manager from "./pages/Manager.jsx";
import Chef from "./pages/Chef.jsx";
import ProtectedRoute from "./components/Handle/ProtectedRoute.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Routes>
        {/* Route mặc định - chuyển hướng đến trang đăng nhập */}
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <>
              <HomeHeader />
              <Home />
              <Footer />
            </>
          }
        />
        <Route path="/menu" element={<Menu />} />
        
        {/* Staff - chỉ STAFF vào */}
        <Route
          path="/staff"
          element={
          <ProtectedRoute allowedRoles={["STAFF"]}>
            <StaffPage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/admin"
          element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Admin />
          </ProtectedRoute>
        }
        />

        <Route
          path="/chef"
          element={
          <ProtectedRoute allowedRoles={["CHEF"]}>
            <Chef />
          </ProtectedRoute>
        }
        />

        <Route
          path="/manager"
          element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <Manager />
          </ProtectedRoute>
        }
        />
      </Routes>
    </div>
  );
}
