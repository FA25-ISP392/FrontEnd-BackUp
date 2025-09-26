import { useState } from 'react';
import { Home, User, LogOut, X, ChefHat } from 'lucide-react';

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleHomeClick = () => {
    window.location.href = '/staff';
  };

  const handleLogout = () => {
    window.location.href = '/staff';
  };

  return (
    <>
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2 text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors duration-300"
              >
                <ChefHat className="h-8 w-8" />
                <span className="text-gradient">Restaurant</span>
              </button>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Home Button */}
              <button
                onClick={handleHomeClick}
                className="flex items-center space-x-2 px-4 py-2 text-neutral-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Trang Chủ</span>
              </button>

              {/* Employee Profile Button */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 text-neutral-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsProfileOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl animate-slideInRight">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">Thông Tin Admin</h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Info */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Admin User</h3>
                <p className="text-neutral-600">Quản trị viên</p>
                <p className="text-sm text-neutral-500 mt-1">admin@restaurant.com</p>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Thông Tin Cá Nhân</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Họ tên:</span>
                      <span className="font-medium">Admin User</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Vai trò:</span>
                      <span className="font-medium text-orange-600">Administrator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Ngày tạo:</span>
                      <span className="font-medium">01/01/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Trạng thái:</span>
                      <span className="status-badge status-success">Hoạt động</span>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Quyền Hạn</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Quản lý tài khoản</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Quản lý món ăn</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Xem báo cáo doanh thu</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Quản lý hóa đơn</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Chỉnh Sửa Thông Tin
                </button>
                <button className="w-full btn-secondary">
                  Đổi Mật Khẩu
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full btn-danger"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng Xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}