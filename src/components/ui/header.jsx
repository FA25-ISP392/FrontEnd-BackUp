import { Bell, Settings, User } from "lucide-react";
import { useState, useEffect } from "react";
import NotificationSidebar from "./NotificationSidebar";
import SettingsSidebar from "./SettingsSidebar";
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
  theme = "default", // 👈 THÊM PROP THEME
  onNotificationClick,
  onSettingsClick,
  onUserClick,
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "User",
    role: "user",
  });

  // 💎 Lấy màu gradient dựa trên prop theme
  const gradientClass = themeClasses[theme] || themeClasses.default;

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const name =
        user.fullName || user.staffName || user.name || user.username || "User";
      const role = String(user.role || "user").toLowerCase();
      setCurrentUser({ name, role });
    }
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
    onNotificationClick?.();
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    onSettingsClick?.();
  };

  const handleUserClick = () => {
    setIsUserModalOpen(true);
    onUserClick?.();
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Left Section - Branding and Page Information */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          {/* 💎 ÁP DỤNG MÀU THEME */}
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientClass} flex items-center justify-center`}
          >
            <span className="text-white text-xl">{icon}</span>
          </div>

          {/* Title and Subtitle */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button
            onClick={handleNotificationClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings Icon */}
          <button
            onClick={handleSettingsClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Avatar and Info */}
          <button
            onClick={handleUserClick}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {/* 💎 ÁP DỤNG MÀU THEME */}
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center`}
            >
              <span className="text-white text-sm font-semibold">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-700 font-medium">
              {currentUser.role}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userRole={currentUser.role}
        userName={currentUser.name}
      />
    </header>
  );
}
