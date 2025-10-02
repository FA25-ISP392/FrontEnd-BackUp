import { Users, Bell, Settings, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function StaffHeader({ staffName }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleLogout = () => {
    window.location.href = "/";
  };
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                Staff Dashboard
              </h1>
              <p className="text-sm text-neutral-600">Quản lý phục vụ</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition"
            >
              <Bell className="h-5 w-5 text-neutral-600" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition"
            >
              <Settings className="h-5 w-5 text-neutral-600" />
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 hover:bg-neutral-100 rounded-lg p-2 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">S</span>
              </div>
              <span className="text-sm font-medium text-neutral-700">
                {staffName}
              </span>
            </button>
          </div>
        </div>
      </div>
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
                <span className="text-neutral-700">Bật thông báo phục vụ</span>
                <input type="checkbox" className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">Âm thanh chuông</span>
                <input type="checkbox" className="h-4 w-4" />
              </label>
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

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
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 border rounded-lg">Bàn 7 gọi nhân viên</div>
              <div className="p-3 border rounded-lg">Đơn #1025 cần phục vụ</div>
            </div>
          </div>
        </div>
      )}

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
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  S
                </div>
                <h3 className="font-semibold text-lg">{staffName}</h3>
                <p className="text-neutral-600 text-sm">Staff</p>
                <p className="text-neutral-500 text-xs mt-1">
                  Employee ID: STF001
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
