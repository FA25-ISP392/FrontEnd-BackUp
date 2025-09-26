import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomeHeader from './components/HomeHeader.jsx';
import MenuHeader from './components/MenuHeader.jsx';
import AdminHeader from './components/AdminHeader.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Staff from './pages/Staff.jsx';
import StaffPage from './pages/StaffPage.jsx';
import Admin from './pages/Admin.jsx';
import Manager from './pages/Manager.jsx';
import Chef from './pages/Chef.jsx';
import './App.css';

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Routes>
        <Route path="/" element={
          <>
            <HomeHeader />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/menu" element={
          <>
            <Menu />
            <Footer />
          </>
        } />
        <Route path="/staff" element={
          <>
            <Header />
            <Staff />
            <Footer />
          </>
        } />
        <Route path="/staff-dashboard" element={
          <>
            <StaffPage />
            <Footer />
          </>
        } />
                    <Route path="/admin" element={
                      <>
                        <AdminHeader />
                        <Admin />
                        <Footer />
                      </>
                    } />
        <Route path="/manager" element={
          <>
            <Header />
            <Manager />
            <Footer />
          </>
        } />
        <Route path="/chef" element={
          <>
            <Header />
            <Chef />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}
