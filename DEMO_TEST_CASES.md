# Demo Các Trường Hợp Test Đăng Nhập

## 🧪 Cách Test Từng Trường Hợp

### 1. **THÀNH CÔNG - Đăng nhập đúng**

**Input:**
- Username: `admin`
- Password: `admin123`

**Backend Response:**
```json
Status: 200 OK
{
  "staffId": 1,
  "staffName": "Admin User",
  "username": "admin",
  "role": "ADMIN",
  "token": "jwt_token_here"
}
```

**Code xử lý:**
```javascript
// Bước 5-7 trong handleLogin
if (userData.role && roleRoutes[userData.role]) {
  // userData.role = "ADMIN"
  // roleRoutes["ADMIN"] = "/admin"
  localStorage.setItem("user", JSON.stringify(userData));
  window.location.href = "/admin"; // Chuyển đến trang admin
}
```

**Kết quả:** Chuyển đến `/admin`

---

### 2. **LỖI - Sai mật khẩu**

**Input:**
- Username: `admin`
- Password: `wrong_password`

**Backend Response:**
```json
Status: 401 Unauthorized
{
  "message": "Mật khẩu không đúng",
  "error": "INVALID_PASSWORD"
}
```

**Code xử lý:**
```javascript
// Bước 8 trong handleLogin
else {
  const errorData = await response.json();
  // errorData.message = "Mật khẩu không đúng"
  setError("Mật khẩu không đúng"); // Hiển thị lỗi đỏ
}
```

**Kết quả:** Hiển thị lỗi "Mật khẩu không đúng"

---

### 3. **LỖI - Sai tên đăng nhập**

**Input:**
- Username: `nonexistent_user`
- Password: `any_password`

**Backend Response:**
```json
Status: 401 Unauthorized
{
  "message": "Tên đăng nhập không tồn tại",
  "error": "USER_NOT_FOUND"
}
```

**Code xử lý:**
```javascript
// Bước 8 trong handleLogin
setError("Tên đăng nhập không tồn tại");
```

**Kết quả:** Hiển thị lỗi "Tên đăng nhập không tồn tại"

---

### 4. **LỖI - Tài khoản bị khóa**

**Input:**
- Username: `locked_user`
- Password: `correct_password`

**Backend Response:**
```json
Status: 403 Forbidden
{
  "message": "Tài khoản của bạn đã bị khóa",
  "error": "ACCOUNT_LOCKED"
}
```

**Code xử lý:**
```javascript
setError("Tài khoản của bạn đã bị khóa");
```

**Kết quả:** Hiển thị lỗi "Tài khoản của bạn đã bị khóa"

---

### 5. **LỖI - Role không hợp lệ**

**Input:**
- Username: `admin`
- Password: `admin123`

**Backend Response:**
```json
Status: 200 OK
{
  "username": "admin",
  "role": "UNKNOWN_ROLE"  // Role không có trong roleRoutes
}
```

**Code xử lý:**
```javascript
// Bước 5 trong handleLogin
if (userData.role && roleRoutes[userData.role]) {
  // userData.role = "UNKNOWN_ROLE"
  // roleRoutes["UNKNOWN_ROLE"] = undefined
  // Điều kiện false
} else {
  setError("Vai trò không hợp lệ hoặc không được phép truy cập");
}
```

**Kết quả:** Hiển thị lỗi "Vai trò không hợp lệ"

---

### 6. **LỖI - Server offline**

**Input:**
- Username: `admin`
- Password: `admin123`

**Backend:** Không chạy hoặc không truy cập được

**Code xử lý:**
```javascript
// Bước 9 trong handleLogin - catch block
catch (error) {
  // error = TypeError: Failed to fetch
  setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
}
```

**Kết quả:** Hiển thị lỗi "Không thể kết nối đến server"

---

### 7. **LỖI - Input trống**

**Input:**
- Username: `` (trống)
- Password: `admin123`

**Code xử lý:**
```javascript
// Bước 2 trong handleLogin
if (!username || !password) {
  setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
  return; // Không gọi API
}
```

**Kết quả:** Hiển thị lỗi "Vui lòng nhập đầy đủ thông tin"

---

## 🔍 Cách Debug

### 1. Mở DevTools (F12)

### 2. Tab Console - Xem logs
```
🔐 Bắt đầu đăng nhập cho user: admin
📡 Gọi API đăng nhập...
📥 Response status: 200
✅ Đăng nhập thành công: {username: "admin", role: "ADMIN", ...}
🎯 Role hợp lệ: ADMIN → /admin
💾 Đã lưu thông tin user vào localStorage
🚀 Chuyển hướng đến: /admin
⏹️ Kết thúc quá trình đăng nhập
```

### 3. Tab Network - Xem API call
- **Request URL:** `http://localhost:8080/api/auth/login`
- **Method:** POST
- **Request Body:** `{"username":"admin","password":"admin123"}`
- **Response Status:** 200 OK
- **Response Body:** `{"username":"admin","role":"ADMIN",...}`

### 4. Tab Application > Local Storage
- **Key:** `user`
- **Value:** `{"username":"admin","role":"ADMIN",...}`

---

## 🎯 Tóm Tắt Luồng Xử Lý

```
1. User nhập username/password
2. Click "Đăng nhập"
3. Validation input
4. Gọi API POST /api/auth/login
5. Kiểm tra response status:
   - 200: Thành công → Kiểm tra role → Chuyển hướng
   - 401: Sai thông tin → Hiển thị lỗi
   - 403: Không có quyền → Hiển thị lỗi
   - 500: Lỗi server → Hiển thị lỗi
6. Nếu network error → Hiển thị lỗi kết nối
7. Tắt loading
```

## 🛠️ Cách Tùy Chỉnh

### 1. Thay đổi URL API
```javascript
const response = await fetch("http://your-backend-url/api/auth/login", {
```

### 2. Thêm role mới
```javascript
const roleRoutes = {
  ADMIN: "/admin",
  MANAGER: "/manager", 
  STAFF: "/staff",
  CHEF: "/chef",
  CASHIER: "/cashier"  // Thêm role mới
};
```

### 3. Tùy chỉnh error messages
```javascript
const errorMessages = {
  INVALID_CREDENTIALS: "Sai tên đăng nhập hoặc mật khẩu",
  ACCOUNT_LOCKED: "Tài khoản đã bị khóa",
  USER_NOT_FOUND: "Tài khoản không tồn tại"
};

setError(errorMessages[errorData.error] || errorData.message);
```

Đây là cách code thực tế hoạt động để xử lý đăng nhập! 🚀

