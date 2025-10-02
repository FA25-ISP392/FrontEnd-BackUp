# Hướng Dẫn Code Đăng Nhập Từ Đầu

## 🎯 Mục Tiêu
Tạo trang đăng nhập có thể:
- Nhập username/password
- Gọi API Backend để xác thực
- Chia quyền dựa trên role từ API
- Hiển thị lỗi khi sai thông tin
- Chuyển hướng đến trang tương ứng

## 📝 Bước 1: Tạo State Variables

```javascript
import { useState } from "react";

export default function Login() {
  // Lưu thông tin input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Lưu trạng thái UI
  const [isLoading, setIsLoading] = useState(false);  // Hiển thị loading
  const [error, setError] = useState("");             // Hiển thị lỗi
  const [showPassword, setShowPassword] = useState(false); // Hiện/ẩn password
```

**Giải thích:**
- `useState("")` tạo biến state với giá trị ban đầu là chuỗi rỗng
- `setUsername` là hàm để thay đổi giá trị `username`
- Mỗi khi state thay đổi, component sẽ re-render

## 📝 Bước 2: Tạo Mapping Role

```javascript
  // Ánh xạ role từ Backend sang route Frontend
  const roleRoutes = {
    ADMIN: "/admin",
    MANAGER: "/manager", 
    STAFF: "/staff",
    CHEF: "/chef"
  };
```

**Giải thích:**
- Khi Backend trả `role: "ADMIN"` → chuyển đến `/admin`
- Khi Backend trả `role: "STAFF"` → chuyển đến `/staff`

## 📝 Bước 3: Tạo Hàm Xử Lý Đăng Nhập

```javascript
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn form reload trang
    
    // Bước 1: Reset trạng thái
    setError("");
    setIsLoading(true);
    
    // Bước 2: Kiểm tra input
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      setIsLoading(false);
      return;
    }
    
    try {
      // Bước 3: Gọi API
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
      
      // Bước 4: Xử lý response
      if (response.ok) {
        // Thành công
        const userData = await response.json();
        
        if (userData.role && roleRoutes[userData.role]) {
          // Lưu thông tin
          localStorage.setItem("user", JSON.stringify(userData));
          
          // Chuyển hướng
          window.location.href = roleRoutes[userData.role];
        } else {
          setError("Vai trò không hợp lệ");
        }
      } else {
        // Lỗi từ Backend
        const errorData = await response.json();
        setError(errorData.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      // Lỗi network
      setError("Không thể kết nối server");
    } finally {
      // Luôn tắt loading
      setIsLoading(false);
    }
  };
```

## 📝 Bước 4: Tạo Form UI

```javascript
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Đăng Nhập</h2>
        
        <form onSubmit={handleLogin}>
          {/* Hiển thị lỗi */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {/* Input Username */}
          <div className="mb-4">
            <label className="block mb-2">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded"
              disabled={isLoading}
            />
          </div>
          
          {/* Input Password */}
          <div className="mb-6">
            <label className="block mb-2">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded"
              disabled={isLoading}
            />
          </div>
          
          {/* Button Đăng nhập */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

## 🔍 Giải Thích Chi Tiết Các Phần

### 1. **Event Handling**
```javascript
onChange={(e) => setUsername(e.target.value)}
```
- `e.target.value` là giá trị user nhập vào input
- `setUsername()` cập nhật state với giá trị mới

### 2. **Form Submit**
```javascript
onSubmit={handleLogin}
```
- Khi user click "Đăng nhập" hoặc nhấn Enter
- Hàm `handleLogin` sẽ được gọi

### 3. **API Call**
```javascript
const response = await fetch("url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password })
});
```
- `fetch()` gửi HTTP request
- `await` chờ response trả về
- `JSON.stringify()` chuyển object thành JSON string

### 4. **Conditional Rendering**
```javascript
{error && <div>{error}</div>}
```
- Chỉ hiển thị div khi `error` có giá trị
- Nếu `error = ""` thì không hiển thị gì

### 5. **Loading State**
```javascript
disabled={isLoading}
{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
```
- Khi `isLoading = true`: button bị disable và hiển thị "Đang đăng nhập..."
- Khi `isLoading = false`: button bình thường

## 🧪 Test Các Trường Hợp

### 1. **Test Thành Công**
- Input: `admin` / `admin123`
- Backend trả: `{role: "ADMIN", username: "admin"}`
- Kết quả: Chuyển đến `/admin`

### 2. **Test Sai Password**
- Input: `admin` / `wrong`
- Backend trả: Status 401 + `{message: "Sai mật khẩu"}`
- Kết quả: Hiển thị "Sai mật khẩu"

### 3. **Test Input Trống**
- Input: `` / `admin123`
- Kết quả: Hiển thị "Vui lòng nhập đầy đủ thông tin"

### 4. **Test Server Offline**
- Backend không chạy
- Kết quả: Hiển thị "Không thể kết nối server"

## 🔧 Cách Debug

### 1. **Console Logs**
```javascript
console.log("Username:", username);
console.log("API Response:", userData);
```

### 2. **DevTools**
- F12 → Console: Xem logs
- F12 → Network: Xem API calls
- F12 → Application → Local Storage: Xem dữ liệu lưu

## 🚀 Hoàn Chỉnh

File `Login.jsx` cuối cùng sẽ có cấu trúc:

```
1. Import
2. State variables
3. Role mapping
4. handleLogin function
5. Return JSX
```

**Đây là cách code từ đầu một trang đăng nhập hoàn chỉnh! 🎉**

