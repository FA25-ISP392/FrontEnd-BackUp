# 🚀 Hướng Dẫn Test Nhanh

## ✅ **Đã Sửa:**
1. **Xóa file SimpleLogin.jsx** - Không cần thiết, trùng lặp
2. **Thêm route mặc định** - Bây giờ có thể truy cập từ `/`
3. **Chỉ còn 1 trang đăng nhập** - Login.jsx

## 🌐 **Các Đường Dẫn Có Thể Truy Cập:**

### **Trang Đăng Nhập:**
- `http://localhost:5175/` ← **MỚI** (trang chủ)
- `http://localhost:5175/homestaff` ← Như cũ

### **Các Trang Khác:**
- `http://localhost:5175/home` - Trang chủ khách hàng
- `http://localhost:5175/menu` - Menu nhà hàng
- `http://localhost:5175/admin` - Trang admin (sau khi đăng nhập)
- `http://localhost:5175/manager` - Trang manager (sau khi đăng nhập)
- `http://localhost:5175/staff` - Trang staff (sau khi đăng nhập)
- `http://localhost:5175/chef` - Trang chef (sau khi đăng nhập)

## 🔧 **Cách Test:**

### **Bước 1: Kiểm tra server**
```bash
npm run dev
```
Server sẽ chạy tại: `http://localhost:5175`

### **Bước 2: Truy cập trang đăng nhập**
Mở trình duyệt và vào:
```
http://localhost:5175/
```
hoặc
```
http://localhost:5175/homestaff
```

### **Bước 3: Test đăng nhập**
1. **Mở DevTools (F12) → Console**
2. **Nhập thông tin test:**
   - Username: `admin`
   - Password: `admin123`
3. **Click "Đăng nhập"**
4. **Xem logs trong Console**
5. **Sẽ chuyển đến `/admin`**

## 🐛 **Nếu Vẫn Không Vào Được:**

### **Kiểm tra 1: Server có chạy không?**
```bash
# Trong terminal, xem có thông báo này không:
➜  Local:   http://localhost:5175/
```

### **Kiểm tra 2: Port có bị chiếm không?**
Nếu port 5175 bị chiếm, Vite sẽ tự động chuyển sang port khác:
```bash
Port 5175 is in use, trying another one...
➜  Local:   http://localhost:5176/  # Hoặc port khác
```

### **Kiểm tra 3: Lỗi trong Console**
Mở DevTools → Console, xem có lỗi đỏ không.

### **Kiểm tra 4: Network tab**
DevTools → Network → Reload trang → Xem có request nào fail không.

## 🎯 **Luồng Hoạt Động Mong Đợi:**

1. **Truy cập `http://localhost:5175/`**
2. **Thấy trang đăng nhập với:**
   - Hình ảnh nhà hàng bên trái
   - Form đăng nhập bên phải
   - Debug info ở dưới (trong development)
3. **Nhập `admin` / `admin123`**
4. **Click "Đăng nhập"**
5. **Thấy logs trong Console:**
   ```
   🔐 Bắt đầu đăng nhập cho user: admin
   📡 Gọi API đăng nhập...
   📥 Response status: 200 (hoặc lỗi nếu server offline)
   ```
6. **Nếu có Backend:** Chuyển đến `/admin`
7. **Nếu không có Backend:** Hiển thị lỗi "Không thể kết nối server"

## 🔥 **Nếu Cần Mock Server:**
```bash
# Chạy mock server (nếu Backend chưa sẵn sàng)
node mock-server.js
```

**Bây giờ chỉ còn 1 trang đăng nhập duy nhất và đã sửa route! 🎉**

