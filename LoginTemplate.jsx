import { useState } from "react";

export default function LoginTemplate() {
  // 1. KHAI BÁO STATE
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. MAPPING ROLE → ROUTE
  const roleRoutes = {
    ADMIN: "/admin",
    MANAGER: "/manager",
    STAFF: "/staff", 
    CHEF: "/chef"
  };

  // 3. HÀM XỬ LÝ ĐĂNG NHẬP
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset trạng thái
    setError("");
    setIsLoading(true);
    
    // Kiểm tra input
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        // THÀNH CÔNG
        const userData = await response.json();
        
        if (userData.role && roleRoutes[userData.role]) {
          // Lưu thông tin user
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", userData.token || "");
          
          // Chuyển hướng dựa trên role
          window.location.href = roleRoutes[userData.role];
        } else {
          setError("Vai trò không hợp lệ hoặc không được phép truy cập");
        }
      } else {
        // LỖI TỪ BACKEND
        const errorData = await response.json();
        setError(errorData.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      // LỖI NETWORK
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      // Tắt loading
      setIsLoading(false);
    }
  };

  // 4. RENDER UI
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Đăng Nhập Hệ Thống
        </h2>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* HIỂN THỊ LỖI */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              ⚠️ {error}
            </div>
          )}

          {/* INPUT USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên đăng nhập"
              disabled={isLoading}
              required
            />
          </div>

          {/* INPUT PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
              required
            />
          </div>

          {/* BUTTON ĐĂNG NHẬP */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "⏳ Đang đăng nhập..." : "🔐 Đăng nhập"}
          </button>
        </form>

        {/* THÔNG TIN TEST */}
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800 font-medium">Tài khoản test:</p>
          <ul className="text-sm text-blue-700 mt-1">
            <li>• admin / admin123 → Admin</li>
            <li>• manager / manager123 → Manager</li>
            <li>• staff / staff123 → Staff</li>
            <li>• chef / chef123 → Chef</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/*
CÁCH SỬ DỤNG:

1. Copy code này vào file Login.jsx
2. Thay đổi URL API nếu cần:
   "http://localhost:8080/api/auth/login" → "http://your-backend-url/api/auth/login"
3. Thêm/sửa role mapping nếu cần:
   const roleRoutes = { ADMIN: "/admin", ... }
4. Tùy chỉnh CSS classes theo design của bạn
5. Test với các tài khoản mẫu

LUỒNG HOẠT ĐỘNG:
User nhập → Validation → API call → Check role → Redirect hoặc hiển thị lỗi
*/

