import { Bell, Settings, User } from "lucide-react";
import { useState } from "react";
import NotificationSidebar from "./NotificationSidebar";
import SettingsSidebar from "./SettingsSidebar";
import UserModal from "./UserModal";

export default function Header({
  icon = "📊",
  title = "Trang quản trị",
  subtitle = "Quản lý hệ thống",
  userRole = "admin",
  userName = "admin",
  onNotificationClick,
  onSettingsClick,
  onUserClick,
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-700 font-medium">{userRole}</span>
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
        userRole={userRole}
        userName={userName}
      />
    </header>
  );
}
