import { Routes, Route } from "react-router-dom";
import { homeHeader as HomeHeader, footer as Footer } from "./components/ui";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import StaffPage from "./pages/StaffPage.jsx";
import Admin from "./pages/Admin.jsx";
import Manager from "./pages/Manager.jsx";
import Chef from "./pages/Chef.jsx";
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
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/chef" element={<Chef />} />
      </Routes>
    </div>
  );
}
