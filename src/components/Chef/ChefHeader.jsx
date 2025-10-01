import { ChefHat, Bell, Settings, X, LogOut } from "lucide-react";
import { useState } from "react";
// (khuyến nghị) nếu dùng react-router-dom:
// import { useNavigate } from "react-router-dom";

export default function ChefHeader({ chefName = "Chef" }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  // const navigate = useNavigate();

  const handleLogout = () => {
    // navigate("/", { replace: true }); // SPA-friendly
    window.location.href = "/homestaff"; // nếu chưa dùng router
  };

  const initial = (chefName?.charAt(0) || "C").toUpperCase();

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg shadow-sm border-b border-white/30 sticky top-0 z-30 animate-slide-in-top">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fadeIn">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Bảng điều khiển Bếp
                </h1>
                <p className="text-sm text-neutral-600">
                  Quản lý bếp và đơn hàng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 animate-fadeIn stagger-1">
              <button
                onClick={() => setIsNotifOpen(true)}
                className="group p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-neutral-600 group-hover:text-orange-600 group-hover:animate-wiggle" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="group p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-neutral-600 group-hover:text-orange-600 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-xl p-3 transition-all duration-300 btn-animated"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                  <span className="text-white text-sm font-bold">
                    {initial}
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-700 font-semibold">
                  {chefName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex animate-slide-in-top"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsProfileOpen(false)}
            aria-label="Close overlay"
          />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Thông Tin Tài Khoản</h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {initial}
                </div>
                <h3 className="font-semibold text-lg">{chefName}</h3>
                <p className="text-neutral-600 text-sm">Chef</p>
                <p className="text-neutral-500 text-xs mt-1">ID: CHF001</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Bộ phận:</span>
                  <span className="font-medium">Bếp</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Cấp độ quyền hạn:</span>
                  <span className="font-medium">Quyền hạn của Bếp</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    Lần đăng nhập gần nhất:
                  </span>
                  <span className="font-medium">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Cài Đặt</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Bật thông báo bếp</span>
                <input type="checkbox" className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Âm thanh chuông</span>
                <input type="checkbox" className="h-4 w-4" />
              </label>
              <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Sidebar */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsNotifOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Thông báo</h2>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 border rounded-lg">Đơn mới từ bàn 3</div>
              <div className="p-3 border rounded-lg">
                Món cần chuẩn bị: Pizza Margherita
              </div>
              <div className="p-3 border rounded-lg">
                Bếp trưởng cập nhật thực đơn
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
