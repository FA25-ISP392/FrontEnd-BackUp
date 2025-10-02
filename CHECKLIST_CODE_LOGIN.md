# ✅ Checklist Code Đăng Nhập

## 📋 Bước 1: Setup Component

- [ ] Import `useState` từ React
- [ ] Tạo component function `Login()`
- [ ] Export default component

```javascript
import { useState } from "react";

export default function Login() {
  // Code ở đây
}
```

## 📋 Bước 2: Khai Báo State

- [ ] State cho username: `const [username, setUsername] = useState("");`
- [ ] State cho password: `const [password, setPassword] = useState("");`
- [ ] State cho loading: `const [isLoading, setIsLoading] = useState(false);`
- [ ] State cho error: `const [error, setError] = useState("");`

## 📋 Bước 3: Tạo Role Mapping

- [ ] Tạo object `roleRoutes` với mapping:
  - [ ] `ADMIN: "/admin"`
  - [ ] `MANAGER: "/manager"`
  - [ ] `STAFF: "/staff"`
  - [ ] `CHEF: "/chef"`

## 📋 Bước 4: Viết Hàm handleLogin

### 4.1 Setup Function
- [ ] Tạo async function `handleLogin(e)`
- [ ] Thêm `e.preventDefault()` để ngăn form reload
- [ ] Reset error: `setError("")`
- [ ] Bật loading: `setIsLoading(true)`

### 4.2 Validation
- [ ] Kiểm tra `if (!username || !password)`
- [ ] Nếu thiếu thông tin: `setError()` và `return`

### 4.3 API Call
- [ ] Wrap trong `try-catch`
- [ ] Gọi `fetch()` với:
  - [ ] URL: `"http://localhost:8080/api/auth/login"`
  - [ ] Method: `"POST"`
  - [ ] Headers: `"Content-Type": "application/json"`
  - [ ] Body: `JSON.stringify({username, password})`

### 4.4 Xử Lý Response
- [ ] Kiểm tra `if (response.ok)`
- [ ] Parse JSON: `const userData = await response.json()`
- [ ] Kiểm tra role hợp lệ: `if (userData.role && roleRoutes[userData.role])`
- [ ] Lưu localStorage: `localStorage.setItem("user", JSON.stringify(userData))`
- [ ] Chuyển hướng: `window.location.href = roleRoutes[userData.role]`

### 4.5 Xử Lý Lỗi
- [ ] Lỗi từ Backend: `setError(errorData.message)`
- [ ] Lỗi Network trong `catch`: `setError("Không thể kết nối server")`
- [ ] Tắt loading trong `finally`: `setIsLoading(false)`

## 📋 Bước 5: Tạo Form UI

### 5.1 Container
- [ ] Div wrapper với styling cơ bản
- [ ] Title "Đăng Nhập"

### 5.2 Form Element
- [ ] `<form onSubmit={handleLogin}>`
- [ ] Thêm `className` cho styling

### 5.3 Error Display
- [ ] Conditional rendering: `{error && <div>{error}</div>}`
- [ ] Styling màu đỏ cho error

### 5.4 Username Input
- [ ] Label "Tên đăng nhập"
- [ ] Input với:
  - [ ] `type="text"`
  - [ ] `value={username}`
  - [ ] `onChange={(e) => setUsername(e.target.value)}`
  - [ ] `disabled={isLoading}`
  - [ ] `required`

### 5.5 Password Input
- [ ] Label "Mật khẩu"
- [ ] Input với:
  - [ ] `type="password"`
  - [ ] `value={password}`
  - [ ] `onChange={(e) => setPassword(e.target.value)}`
  - [ ] `disabled={isLoading}`
  - [ ] `required`

### 5.6 Submit Button
- [ ] `type="submit"`
- [ ] `disabled={isLoading}`
- [ ] Text thay đổi: `{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}`

## 📋 Bước 6: Test & Debug

### 6.1 Console Logs (Optional)
- [ ] Log username khi submit
- [ ] Log API response
- [ ] Log errors

### 6.2 Test Cases
- [ ] Test với tài khoản đúng: `admin/admin123`
- [ ] Test với password sai
- [ ] Test với username sai
- [ ] Test với input trống
- [ ] Test khi server offline

### 6.3 DevTools Check
- [ ] F12 → Console: Xem logs
- [ ] F12 → Network: Xem API calls
- [ ] F12 → Application → Local Storage: Xem data được lưu

## 📋 Bước 7: Tùy Chỉnh (Optional)

- [ ] Thay đổi URL API theo Backend thật
- [ ] Thêm CSS/Tailwind styling
- [ ] Thêm icon cho inputs
- [ ] Thêm "Remember me" checkbox
- [ ] Thêm "Forgot password" link
- [ ] Thêm loading spinner

## 🚀 Hoàn Thành!

Khi tất cả checkbox được tick ✅, bạn đã có một trang đăng nhập hoàn chỉnh với:

- ✅ Form validation
- ✅ API integration  
- ✅ Role-based routing
- ✅ Error handling
- ✅ Loading states
- ✅ Local storage
- ✅ Responsive UI

## 🔧 Troubleshooting

**Nếu gặp lỗi:**

1. **"Cannot read property of undefined"**
   - Kiểm tra API response structure
   - Thêm optional chaining: `userData?.role`

2. **"CORS error"**
   - Backend cần enable CORS
   - Hoặc dùng proxy trong development

3. **"Network error"**
   - Kiểm tra Backend có chạy không
   - Kiểm tra URL API đúng chưa

4. **"Role không hợp lệ"**
   - Kiểm tra `roleRoutes` mapping
   - Kiểm tra Backend trả đúng role format chưa

**Cần help thêm? Hỏi tôi! 😊**

