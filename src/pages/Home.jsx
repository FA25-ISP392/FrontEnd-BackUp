import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import HeroSection from "../components/Home/HeroSection";
import VisionSection from "../components/Home/VisionSection";
import MenuSection from "../components/Home/MenuSection";
import LoginForm from "../components/Home/LoginForm";
import RegisterForm from "../components/Home/RegisterForm";
import ForgotPasswordSidebar from "../components/Home/ForgotPasswordSidebar";
import ResetPasswordSidebar from "../components/Home/ResetPasswordSidebar";
import BookingForm from "../components/Home/BookingForm";
import UserAccountDropdown from "../components/Home/UserAccountDropdown";
import { logoutCustomer } from "../lib/auth";
import { useBooking } from "../hooks/useBooking";
import ToastHost from "../common/ToastHost";
import { HOME, HOME_ROUTES, NEED_AUTH } from "../constant/routes";
import CustomerBookingHistory from "../components/Home/CustomerBookingHistory";
import PaymentHistoryModal from "../components/Home/PaymentHistoryModal";
import OrderHistoryModal from "../components/Home/OrderHistoryModal";
import TypewriterText from "../components/Home/TypewriterText";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isBookingSuccessOpen, setIsBookingSuccessOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const {
    bookingDraft,
    saveBookingDraft,
    clearBookingDraft,
    reloadBookingDraft,
  } = useBooking();

  const [isScrolled, setIsScrolled] = useState(false);

  const aboutText1 =
    "Chào mừng bạn đến với nhà hàng của chúng tôi, nơi tinh hoa ẩm thực hòa quện cùng sự hiếu khách nồng ấm. Trong hơn một thập kỷ qua, chúng tôi đã phục vụ những món ăn tuyệt hảo được chế biến từ những nguyên liệu tinh túy nhất.";
  const aboutText2 =
    "Những đầu bếp tài hoa của chúng tôi sáng tạo nên thực đơn độc đáo, kết hợp tinh hoa kỹ thuật truyền thống với hương vị hiện đại, mang đến trải nghiệm ẩm thực khó quên trong từng món ăn.";
  const aboutText3 =
    "Chúng tôi tự hào mang đến dịch vụ xuất sắc trong một không gian thoải mái và thanh lịch, lý tưởng cho mọi dịp – từ những bữa tối ấm cúng cho đến các buổi tiệc lớn.";
  const missionText =
    "Tạo nên những trải nghiệm ẩm thực khó quên thông qua món ăn tuyệt hảo, dịch vụ xuất sắc và sự hiếu khách nồng ấm. Đồng thời, chúng tôi mang đến thực đơn đa dạng và cá nhân hóa theo nhu cầu từng người, nhằm phục vụ mục tiêu ăn uống lành mạnh – từ tăng, giảm cho đến duy trì cân nặng một cách bền vững.";

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");
      if (token && rawUser) {
        try {
          setIsLoggedIn(true);
          setUserInfo(JSON.parse(rawUser));
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth:changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth:changed", syncAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //===== Các Sự Kiện Khi Khách Hàng Ấn Sẽ Ứng Với 1 Cái Render Case Phía Dưới =====
  const modal = useMemo(() => {
    const p = location.pathname;
    if (p === HOME_ROUTES.ABOUT) return "about";
    if (p === HOME_ROUTES.LOGIN) return "login";
    if (p === HOME_ROUTES.REGISTER) return "register";
    if (p === HOME_ROUTES.FORGOT) return "forgot";
    if (p === HOME_ROUTES.MENU_PREVIEW) return "menu";
    if (p === HOME_ROUTES.BOOKING) return "booking";
    if (p === HOME_ROUTES.HISTORY) return "history";
    if (p === HOME_ROUTES.EDIT) return "edit";
    if (p === HOME_ROUTES.PAYMENT_HISTORY) return "payment_history";
    if (p === HOME_ROUTES.ORDER_HISTORY) return "order_history";
    return null;
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoggedIn && NEED_AUTH.includes(location.pathname)) {
      navigate(HOME_ROUTES.LOGIN, { replace: true });
    }
  }, [location.pathname, isLoggedIn, navigate]);

  useEffect(() => {
    const tableId = searchParams.get("tableId");
    if (tableId && modal === "login") {
      sessionStorage.setItem("currentTableId", tableId);
    }
  }, [searchParams, modal]);

  const resetToken = searchParams.get("token");
  //===== Hàm xử lý khi ResetPasswordSidebar mở ra =====
  const isResetOpen = Boolean(resetToken);
  const closeReset = () => {
    setSearchParams(
      (prev) => {
        prev.delete("token");
        return prev;
      },
      { replace: true }
    );
    if (location.pathname.startsWith(HOME)) {
      navigate(HOME, { replace: true });
    }
  };

  const open = (path) => navigate(path);
  const closeToHome = () => navigate(HOME, { replace: true });

  const handleBookingSubmit = (result) => {
    clearBookingDraft();
    closeToHome();
    setIsBookingSuccessOpen(true);
  };

  const handleLoginFromBooking = (currentForm) => {
    if (currentForm) {
      const { date, time, guests, preferredTable } = currentForm;
      saveBookingDraft({ date, time, guests, preferredTable });
    }
    open(HOME_ROUTES.LOGIN);
  };

  const handleLoginRequest = (currentForm) => {
    if (currentForm) {
      saveBookingDraft(currentForm);
    }
    setIsLoginRequiredOpen(true);
  };

  //===== Hàm xử lý khi đăng nhập xong =====
  const handleLoginSubmit = () => {
    const tableId = sessionStorage.getItem("currentTableId");
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        const cid = u?.customerId ?? u?.id;
        if (cid != null) sessionStorage.setItem("customerId", String(cid));
      }
    } catch (err) {}
    if (tableId) {
      sessionStorage.setItem("customerTableId", tableId);
      navigate("/menu");
      return;
    }

    if (bookingDraft) {
      reloadBookingDraft();
      open(HOME_ROUTES.BOOKING);
    } else {
      closeToHome();
    }
  };

  const handleLogout = () => {
    logoutCustomer(HOME);
  };

  const handleBookingHistoryClick = () => open(HOME_ROUTES.HISTORY);
  const handleEditAccountClick = () => open(HOME_ROUTES.EDIT);
  const handlePaymentHistoryClick = () => open(HOME_ROUTES.PAYMENT_HISTORY);
  const handleOrderHistoryClick = () => open(HOME_ROUTES.ORDER_HISTORY);

  return (
    <div className="min-h-screen">
      <ToastHost />
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent shadow-none"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => open(HOME)}
            className={`text-2xl font-bold transition-colors ${
              isScrolled
                ? "text-orange-600 hover:text-orange-700"
                : "text-white shadow-text"
            }`}
            aria-label="Go Home"
          >
            MónCủaBạn
          </button>

          <nav className="flex items-center gap-8">
            <button
              onClick={() => open(HOME_ROUTES.ABOUT)}
              className={`transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 active:shadow-inner px-3 py-1 rounded-lg ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600 hover:shadow-lg"
                  : "text-white hover:bg-white/10 shadow-text hover:shadow-lg"
              }`}
            >
              Về Chúng Tôi
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => open(HOME_ROUTES.LOGIN)}
                className={`transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 active:shadow-inner px-3 py-1 rounded-lg ${
                  isScrolled
                    ? "text-gray-700 hover:text-orange-600 hover:shadow-lg"
                    : "text-white hover:bg-white/10 shadow-text hover:shadow-lg"
                }`}
              >
                Đăng Nhập
              </button>
            )}
            <button
              //===== Bắt Sự Kiện Khách Hàng Ấn Vào Nút Đặt Bàn =====
              onClick={() => open(HOME_ROUTES.BOOKING)}
              className={`transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 active:shadow-inner px-3 py-1 rounded-lg ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600 hover:shadow-lg"
                  : "text-white hover:bg-white/10 shadow-text hover:shadow-lg"
              }`}
            >
              Đặt Bàn
            </button>
            <button
              onClick={() => {
                menuRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
            >
              Món phải thử
            </button>

            <UserAccountDropdown
              isLoggedIn={isLoggedIn}
              userInfo={userInfo}
              onLogout={handleLogout}
              //===== Khách Hàng muốn xem Lịch Sử Đặt Bàn thì sẽ bắt sự kiến đó =====
              onBookingHistoryClick={handleBookingHistoryClick}
              onEditAccountClick={handleEditAccountClick}
              onCloseEditAccount={closeToHome}
              onPaymentHistoryClick={handlePaymentHistoryClick}
              onOrderHistoryClick={handleOrderHistoryClick}
              isScrolled={isScrolled}
            />
          </nav>
        </div>
      </header>
      <div className="pt-0">
        {" "}
        <HeroSection />
        <VisionSection />
        <div ref={menuRef}>
          <MenuSection />
        </div>
      </div>
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Vị trí của chúng tôi
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Ghé thăm nhà hàng của chúng tôi tại vị trí thuận tiện và không
              gian đẹp mắt
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Thông tin liên hệ
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">
                    7 D1, Long Thạnh Mỹ, TP.HCM
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">+84 123-456-789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">moncuaban@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-64">
              <iframe
                title="Restaurant Map"
                src={
                  "https://www.google.com/maps?q=" +
                  encodeURIComponent(
                    "7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000, Việt Nam"
                  ) +
                  "&output=embed"
                }
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
      {modal === "booking" && (
        <div className="fixed inset-0 z-50 transition-opacity duration-300">
          <div className="absolute inset-0 bg-black/40" onClick={closeToHome} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Đặt Bàn</h2>
                <button
                  onClick={closeToHome}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <BookingForm
                onSubmit={handleBookingSubmit}
                isLoggedIn={isLoggedIn}
                onLoginClick={handleLoginFromBooking}
                onLoginRequest={handleLoginRequest}
                initialData={bookingDraft}
              />
            </div>
          </div>
        </div>
      )}
      {modal === "about" && (
        <div className="fixed inset-0 z-50 transition-opacity duration-300">
          <div className="absolute inset-0 bg-black/40" onClick={closeToHome} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Về Chúng Tôi
                </h2>
                <button
                  onClick={closeToHome}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                <TypewriterText
                  text={aboutText1}
                  speed={20}
                  className="text-gray-700 leading-relaxed text-sm"
                />
                <TypewriterText
                  text={aboutText2}
                  speed={20}
                  className="text-gray-700 leading-relaxed text-sm"
                />
                <TypewriterText
                  text={aboutText3}
                  speed={20}
                  className="text-gray-700 leading-relaxed text-sm"
                />
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-orange-600 mb-2">
                    Sứ mệnh của chúng tôi
                  </h3>
                  <TypewriterText
                    text={missionText}
                    speed={20}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {(modal === "login" || modal === "register") && (
        <div className="fixed inset-0 z-50 transition-opacity duration-300">
          <div className="absolute inset-0 bg-black/40" onClick={closeToHome} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modal === "login" ? "Đăng Nhập" : "Đăng Ký"}
                </h2>
                <button
                  onClick={closeToHome}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="transition-all duration-500 ease-in-out">
                {modal === "login" ? (
                  <LoginForm
                    onSubmit={handleLoginSubmit}
                    onSwitchToRegister={() => open(HOME_ROUTES.REGISTER)}
                    onForgotPassword={() => open(HOME_ROUTES.FORGOT)}
                  />
                ) : (
                  <RegisterForm
                    onSwitchToLogin={() => open(HOME_ROUTES.LOGIN)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {modal === "forgot" && (
        <ForgotPasswordSidebar
          isOpen
          onClose={closeToHome}
          onBackToLogin={() => open(HOME_ROUTES.LOGIN)}
        />
      )}
      //===== Render ra ResetPasswordSidebar =====
      {isResetOpen && (
        <ResetPasswordSidebar
          isOpen
          onClose={closeReset}
          onBackToLogin={() => open(HOME_ROUTES.LOGIN)}
          token={resetToken}
        />
      )}
      {modal === "history" && (
        <CustomerBookingHistory
          isOpen
          onClose={closeToHome}
          userInfo={userInfo}
        />
      )}
      {modal === "payment_history" && (
        <PaymentHistoryModal isOpen onClose={closeToHome} userInfo={userInfo} />
      )}
      {modal === "order_history" && (
        <OrderHistoryModal isOpen onClose={closeToHome} userInfo={userInfo} />
      )}
      {isBookingSuccessOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Đặt bàn thành công!
              </h3>
              <p className="text-neutral-600 mb-6">
                Bàn của bạn đã được ghi nhận. Cảm ơn bạn đã sử dụng dịch vụ!
              </p>
              <button
                onClick={() => {
                  setIsBookingSuccessOpen(false);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoginRequiredOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Yêu cầu Đăng nhập
              </h3>
              <p className="text-neutral-600 mb-6">
                Bạn cần đăng nhập để có thể đặt bàn. Vui lòng đăng nhập để tiếp
                tục.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLoginRequiredOpen(false)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                >
                  Để sau
                </button>
                <button
                  onClick={() => {
                    setIsLoginRequiredOpen(false);
                    open(HOME_ROUTES.LOGIN);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
