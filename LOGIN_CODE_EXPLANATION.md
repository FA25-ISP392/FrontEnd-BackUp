# Giải Thích Chi Tiết Code Xử Lý Đăng Nhập

## 1. Cấu Trúc Xử Lý API Response

### 1.1. Phần Khai Báo State
```javascript
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);    // Hiển thị loading
const [error, setError] = useState("");               // Hiển thị lỗi
```

### 1.2. Mapping Role sang Routes
```javascript
const roleRoutes = {
  ADMIN: "/admin",      // Backend trả "ADMIN" → chuyển đến /admin
  MANAGER: "/manager",  // Backend trả "MANAGER" → chuyển đến /manager
  STAFF: "/staff",      // Backend trả "STAFF" → chuyển đến /staff
  CHEF: "/chef"         // Backend trả "CHEF" → chuyển đến /chef
};
```

## 2. Chi Tiết Hàm handleLogin

### 2.1. Validation Input
```javascript
if (!username || !password) {
  setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
  setIsLoading(false);
  return;
}
```
**Giải thích:** Kiểm tra user có nhập đủ thông tin không, nếu thiếu thì báo lỗi.

### 2.2. Gọi API
```javascript
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
```
**Giải thích:** 
- Gửi POST request đến Backend
- Header `Content-Type: application/json` để Backend biết data là JSON
- Body chứa username và password

### 2.3. Xử Lý Response Thành Công
```javascript
if (response.ok) {  // Status 200-299
  const userData = await response.json();
  
  // Kiểm tra role có hợp lệ không
  if (userData.role && roleRoutes[userData.role]) {
    // Lưu thông tin user
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token || "");
    
    // Chuyển hướng dựa trên role
    window.location.href = roleRoutes[userData.role];
  } else {
    setError("Vai trò không hợp lệ hoặc không được phép truy cập");
  }
}
```

**Giải thích từng bước:**

1. **`response.ok`**: Kiểm tra status code 200-299 (thành công)
2. **`userData.role`**: Lấy role từ response của Backend
3. **`roleRoutes[userData.role]`**: Kiểm tra role có trong mapping không
4. **`localStorage.setItem`**: Lưu thông tin user để dùng sau
5. **`window.location.href`**: Chuyển hướng đến trang tương ứng

### 2.4. Xử Lý Lỗi từ Backend
```javascript
else {
  const errorData = await response.json();
  setError(errorData.message || "Tên đăng nhập hoặc mật khẩu không đúng");
}
```

**Các trường hợp lỗi:**
- **Status 401**: Sai username/password
- **Status 403**: Không có quyền truy cập
- **Status 500**: Lỗi server

### 2.5. Xử Lý Lỗi Network
```javascript
catch (error) {
  console.error("Login error:", error);
  setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
}
```

**Khi nào xảy ra:**
- Server không chạy
- Không có internet
- CORS error
- Timeout

## 3. Các Trường Hợp Response từ Backend

### 3.1. Đăng Nhập Thành Công
```json
// Status: 200 OK
{
  "staffId": 1,
  "staffName": "Nguyễn Văn Admin",
  "staffEmail": "admin@restaurant.com",
  "username": "admin",
  "role": "ADMIN",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
**Code xử lý:** Lưu vào localStorage và chuyển đến `/admin`

### 3.2. Sai Username/Password
```json
// Status: 401 Unauthorized
{
  "message": "Tên đăng nhập hoặc mật khẩu không đúng",
  "error": "INVALID_CREDENTIALS"
}
```
**Code xử lý:** Hiển thị message trong UI

### 3.3. Tài Khoản Bị Khóa
```json
// Status: 403 Forbidden
{
  "message": "Tài khoản của bạn đã bị khóa",
  "error": "ACCOUNT_LOCKED"
}
```
**Code xử lý:** Hiển thị message cảnh báo

### 3.4. Role Không Hợp Lệ
```json
// Status: 200 OK nhưng role sai
{
  "username": "test",
  "role": "INVALID_ROLE"
}
```
**Code xử lý:** Báo lỗi "Vai trò không hợp lệ"

## 4. Hiển Thị Lỗi trong UI

### 4.1. Component Hiển Thị Lỗi
```jsx
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
    <p className="text-sm text-red-700">{error}</p>
  </div>
)}
```

### 4.2. Các Loại Lỗi
- **Validation**: "Vui lòng nhập đầy đủ thông tin"
- **Authentication**: "Tên đăng nhập hoặc mật khẩu không đúng"
- **Authorization**: "Vai trò không hợp lệ"
- **Network**: "Không thể kết nối đến server"

## 5. Loading State

### 5.1. Hiển thị Loading
```jsx
{isLoading ? (
  <div className="flex items-center justify-center gap-2">
    <Loader2 className="h-5 w-5 animate-spin" />
    <span>Đang đăng nhập...</span>
  </div>
) : (
  "Đăng nhập"
)}
```

### 5.2. Disable Form khi Loading
```jsx
<input
  disabled={isLoading}
  // ... other props
/>
```

## 6. Lưu Trữ Thông Tin User

### 6.1. Lưu vào localStorage
```javascript
localStorage.setItem("user", JSON.stringify(userData));
localStorage.setItem("token", userData.token || "");
```

### 6.2. Sử dụng sau này
```javascript
// Lấy thông tin user
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

// Kiểm tra đã đăng nhập chưa
if (user && user.role) {
  // User đã đăng nhập
}
```

## 7. Debug và Test

### 7.1. Console Logs
```javascript
console.log("Login attempt:", { username, password });
console.log("API Response:", userData);
console.log("Redirecting to:", roleRoutes[userData.role]);
```

### 7.2. DevTools Network Tab
- Xem request/response
- Kiểm tra status code
- Xem error message

### 7.3. Test Cases
1. **Thành công**: username/password đúng
2. **Sai password**: username đúng, password sai
3. **Sai username**: username không tồn tại
4. **Server offline**: Backend không chạy
5. **Role không hợp lệ**: Backend trả role lạ

## 8. Security Best Practices

### 8.1. Không log sensitive data
```javascript
// ❌ Không làm thế này
console.log("Password:", password);

// ✅ Làm thế này
console.log("Login attempt for user:", username);
```

### 8.2. Clear error sau một thời gian
```javascript
setTimeout(() => setError(""), 5000); // Clear sau 5s
```

### 8.3. Logout function
```javascript
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/homestaff";
};
```

Đây là cách code hoạt động thực tế để xử lý đăng nhập, chia quyền và báo lỗi!

