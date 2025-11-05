import { User, LogOut, X, ArrowLeft, Mail, Phone, AtSign } from "lucide-react";
import { useState, useEffect } from "react"; // Thêm useState, useEffect

// Component con để hiển thị thông tin chi tiết
const DetailRow = ({ icon, label, value }) => {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-800 break-words">
          {value || "Chưa cập nhật"}
        </div>
      </div>
    </div>
  );
};

export default function UserModal({ isOpen, onClose, userInfo = {} }) {
  // State để quản lý view (main hoặc details)
  const [view, setView] = useState("main");

  // Lấy thông tin từ prop userInfo
  const { name: userName, role: userRole, email, phone, username } = userInfo;

  // Reset view về 'main' mỗi khi modal được mở
  useEffect(() => {
    if (isOpen) {
      setView("main");
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleProfile = () => {
    // Chuyển sang view 'details' thay vì đóng modal
    setView("details");
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
        className={`absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl transform transition-all duration-300 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            {/* Nút Back (chỉ hiển thị ở view details) */}
            {view === "details" && (
              <button
                onClick={() => setView("main")}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
            )}

            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-semibold">
                {(userName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {userName || "User"}
              </h3>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                  userRole
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

        {/* === Render nội dung dựa trên state 'view' === */}

        {/* View 1: Main Menu */}
        {view === "main" && (
          <>
            <div className="p-2">
              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Thông tin tài khoản</span>
              </button>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </>
        )}

        {/* View 2: Account Details */}
        {view === "details" && (
          <div className="p-4 space-y-4">
            <DetailRow icon={User} label="Tên đầy đủ" value={userName} />
            <DetailRow icon={AtSign} label="Tên đăng nhập" value={username} />
            <DetailRow icon={Mail} label="Email" value={email} />
            <DetailRow icon={Phone} label="Số điện thoại" value={phone} />
          </div>
        )}
      </div>
    </div>
  );
}
