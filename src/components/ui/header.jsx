import { User } from "lucide-react";
import { useState, useEffect } from "react";
import UserModal from "./UserModal";
import { getCurrentUser } from "../../lib/auth";

// 💎 ĐỊNH NGHĨA CÁC BIẾN THỂ MÀU SẮC
const themeClasses = {
  admin: "from-blue-500 to-purple-600",
  manager: "from-orange-500 to-red-600",
  chef: "from-orange-500 to-red-600", // Giống Manager
  staff: "from-green-500 to-emerald-600",
  default: "from-purple-500 to-blue-500", // Màu mặc định
};

export default function Header({
  icon = "📊",
  title = "Trang quản trị",
  subtitle = "Quản lý hệ thống",
  theme = "default",
  onUserClick,
}) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "User",
    role: "user",
  });

  const gradientClass = themeClasses[theme] || themeClasses.default;

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const name =
        user.fullName || user.staffName || user.name || user.username || "User";
      const role = String(user.role || "user").toLowerCase();
      // Lưu toàn bộ thông tin user vào state
      setCurrentUser({ ...user, name, role });
    }
  }, []);

  const handleUserClick = () => {
    setIsUserModalOpen(true);
    onUserClick?.();
  };

  return (
    // 👈 SỬA: Áp dụng gradientClass, border và shadow cho header
    <header
      className={`w-full bg-gradient-to-r ${gradientClass} border-b border-white/20 shadow-lg`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientClass} flex items-center justify-center`}
          >
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div>
            {/* 👈 SỬA: Đổi màu chữ sang trắng và thêm shadow */}
            <h1 className="text-xl font-bold text-white shadow-text-lg">
              {title}
            </h1>
            <p className="text-sm text-indigo-200 shadow-text">{subtitle}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleUserClick}
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div
              // 👈 SỬA: Đổi avatar BG sang trong suốt để nổi bật trên nền gradient
              className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center`}
            >
              <span className="text-white text-sm font-semibold">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* 👈 SỬA: Đổi màu chữ sang trắng */}
            <span className="text-white shadow-text font-medium">
              {currentUser.role}
            </span>
          </button>
        </div>
      </div>

      {/* User Modal - Truyền toàn bộ currentUser vào userInfo */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userInfo={currentUser}
      />
    </header>
  );
}
