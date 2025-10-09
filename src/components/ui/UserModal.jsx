import { User, LogOut, Settings, Shield, Clock, X } from "lucide-react";

export default function UserModal({ isOpen, onClose, userRole, userName }) {
  const handleLogout = () => {
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Chuyển hướng về trang login
    window.location.href = "/";
  };

  const handleProfile = () => {
    // Mở modal thông tin profile
    console.log("Open profile modal");
    onClose();
  };

  const handleSettings = () => {
    // Mở settings
    console.log("Open settings");
    onClose();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "chef":
        return "Đầu bếp";
      case "staff":
        return "Nhân viên";
      default:
        return "Người dùng";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "chef":
        return "bg-orange-100 text-orange-800";
      case "staff":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div
        className={`absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{userName}</h3>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                  userRole,
                )}`}
              >
                {getRoleDisplayName(userRole)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>ID: {userRole.toUpperCase()}-001</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Đăng nhập lần cuối: Hôm nay 14:30</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <button
            onClick={handleProfile}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Thông tin tài khoản</span>
          </button>

          <button
            onClick={handleSettings}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Cài đặt</span>
          </button>

          {userRole === "admin" && (
            <button
              onClick={() => console.log("Admin panel")}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Shield className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Bảng điều khiển</span>
            </button>
          )}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}
