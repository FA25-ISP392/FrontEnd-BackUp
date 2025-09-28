import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import HomeHeader from "./components/HomeHeader.jsx";
import MenuHeader from "./components/MenuHeader.jsx";
import AdminHeader from "./components/AdminHeader.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Staff from "./pages/Staff.jsx";
import StaffPage from "./pages/StaffPage.jsx";
import Admin from "./pages/Admin.jsx";
import Manager from "./pages/Manager.jsx";
import Chef from "./pages/Chef.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Routes>
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
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff-dashboard" element={<StaffPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/chef" element={<Chef />} />
      </Routes>
    </div>
  );
}
