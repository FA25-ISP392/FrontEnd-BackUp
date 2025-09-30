import { BarChart3, Bell, Settings, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function AdminHeader({ adminName }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // thêm state cho settings

  const handleLogout = () => {
    window.location.href = "/homestaff";
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: logo & title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  Trang quản trị
                </h1>
                <p className="text-sm text-neutral-600">Quản lý hệ thống</p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
                aria-label="Thông báo"
              >
                <Bell className="h-5 w-5 text-neutral-600" />
              </button>

              {/* SETTINGS button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
                aria-label="Cài đặt"
              >
                <Settings className="h-5 w-5 text-neutral-600" />
              </button>

              {/* Profile button */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 hover:bg-neutral-100 rounded-lg p-2 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {adminName?.[0]?.toUpperCase() || "A"}
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  {adminName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsProfileOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Thông Tin Tài Khoản</h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {adminName?.[0]?.toUpperCase() || "A"}
                </div>
                <h3 className="font-semibold text-lg">{adminName}</h3>
                <p className="text-neutral-600 text-sm">Quyền Quản Trị Viên</p>
                <p className="text-neutral-500 text-xs mt-1">ID: ADM001</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Bộ phận:</span>
                  <span className="font-medium">Chủ nhà hàng</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Cấp độ quyền hạn:</span>
                  <span className="font-medium">Tất cả quyền hạn</span>
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
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Bật thông báo Email</span>
                <input type="checkbox" className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Chế độ tối</span>
                <input type="checkbox" className="h-4 w-4" />
              </label>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
