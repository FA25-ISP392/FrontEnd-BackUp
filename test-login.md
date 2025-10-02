# Hướng Dẫn Test Chức Năng Đăng Nhập

## ✅ Đã hoàn thành:

1. **Bỏ dropdown vai trò** - Chỉ còn username và password
2. **Tích hợp API đăng nhập** - Gọi API Backend để xác thực
3. **Phân quyền tự động** - Dựa trên role từ API response
4. **Xử lý lỗi và loading** - UX tốt hơn

## 🚀 Cách Test:

### Bước 1: Chạy Mock API Server (Tuỳ chọn)

Nếu Backend chưa sẵn sàng, bạn có thể dùng mock server:

```bash
# Cài đặt dependencies cho mock server
npm install express cors

# Chạy mock server
node mock-server.js
```

Mock server sẽ chạy tại: `http://localhost:8080`

### Bước 2: Chạy Frontend

```bash
# Trong terminal khác
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5175`

### Bước 3: Test Đăng Nhập

Truy cập: `http://localhost:5175/homestaff`

**Tài khoản test:**
- **Admin**: `admin` / `admin123` → Chuyển đến `/admin`
- **Manager**: `manager` / `manager123` → Chuyển đến `/manager`  
- **Staff**: `staff` / `staff123` → Chuyển đến `/staff`
- **Chef**: `chef` / `chef123` → Chuyển đến `/chef`

## 🔧 Cấu hình cho Backend thật:

### 1. Thay đổi URL API

Trong `src/pages/Login.jsx`, dòng 32:
```javascript
const response = await fetch("http://localhost:8080/api/auth/login", {
```

Thay `http://localhost:8080` bằng URL Backend thật của bạn.

### 2. API Contract

Backend cần implement endpoint:

```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "string",
  "password": "string"  
}

Response Success (200):
{
  "staffId": 1,
  "staffName": "Nguyễn Văn A",
  "staffEmail": "admin@restaurant.com",
  "staffPhone": "0123456789", 
  "username": "admin",
  "role": "ADMIN",  // ADMIN, MANAGER, STAFF, CHEF
  "token": "jwt_token_here"
}

Response Error (401):
{
  "message": "Tên đăng nhập hoặc mật khẩu không đúng"
}
```

### 3. CORS Configuration

Backend cần enable CORS cho `http://localhost:5175`

## 🐛 Debug:

1. **Mở DevTools (F12)**
2. **Tab Network** - Xem API calls
3. **Tab Console** - Xem error logs
4. **Tab Application > Local Storage** - Xem dữ liệu được lưu

## 📝 Features:

- ✅ Form đăng nhập đơn giản (username + password)
- ✅ Hiện/ẩn mật khẩu
- ✅ Loading state khi đăng nhập
- ✅ Hiển thị lỗi rõ ràng
- ✅ Phân quyền tự động dựa trên API response
- ✅ Lưu thông tin user vào localStorage
- ✅ Responsive design
- ✅ Hình ảnh nhà hàng đẹp mắt

## 🔄 Luồng hoạt động:

1. User nhập username/password
2. Frontend gọi API `POST /api/auth/login`
3. Backend xác thực và trả về thông tin user + role
4. Frontend lưu thông tin vào localStorage
5. Frontend chuyển hướng dựa trên role:
   - `ADMIN` → `/admin`
   - `MANAGER` → `/manager`
   - `STAFF` → `/staff`  
   - `CHEF` → `/chef`

Bây giờ bạn có thể test chức năng đăng nhập hoàn chỉnh! 🎉

