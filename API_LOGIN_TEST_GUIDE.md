# Hướng Dẫn Test API Đăng Nhập

## 1. Cấu Trúc API Backend

Dựa trên cấu trúc Staff trong ảnh, Backend cần cung cấp API với format sau:

### Endpoint
```
POST http://localhost:8080/api/auth/login
```

### Request Body
```json
{
  "username": "string",
  "password": "string"
}
```

### Response Success (200 OK)
```json
{
  "staffId": 1,
  "staffName": "Nguyễn Văn A",
  "staffEmail": "admin@restaurant.com",
  "staffPhone": "0123456789",
  "username": "admin",
  "role": "ADMIN",
  "token": "jwt_token_here" // Optional
}
```

### Response Error (401 Unauthorized)
```json
{
  "message": "Tên đăng nhập hoặc mật khẩu không đúng",
  "error": "INVALID_CREDENTIALS"
}
```

## 2. Role Mapping

Frontend sẽ map các role từ API response sang routes:

| API Role | Frontend Route | Mô tả |
|----------|---------------|-------|
| `ADMIN` | `/admin` | Chủ nhà hàng - Quản lý toàn bộ hệ thống |
| `MANAGER` | `/manager` | Quản lý nhà hàng - Quản lý bàn và nhân viên |
| `STAFF` | `/staff` | Nhân viên phục vụ - Phục vụ khách hàng |
| `CHEF` | `/chef` | Bếp trưởng - Quản lý bếp và đơn hàng |

## 3. Cách Test API

### 3.1. Test với Postman/Insomnia

1. **Tạo request mới:**
   - Method: POST
   - URL: `http://localhost:8080/api/auth/login`
   - Headers: `Content-Type: application/json`

2. **Test case thành công:**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

3. **Test case thất bại:**
   ```json
   {
     "username": "wrong_user",
     "password": "wrong_pass"
   }
   ```

### 3.2. Test với cURL

```bash
# Test thành công
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Test thất bại
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "wrong", "password": "wrong"}'
```

### 3.3. Test trực tiếp trên Frontend

1. Mở trình duyệt và truy cập: `http://localhost:5175/homestaff`
2. Nhập thông tin đăng nhập
3. Kiểm tra Network tab trong DevTools để xem API call
4. Kiểm tra Console để xem logs

## 4. Dữ Liệu Test Mẫu

Backend nên có sẵn các tài khoản test sau:

```sql
-- Admin
INSERT INTO Staff (staffName, staffEmail, staffPhone, username, password, role) 
VALUES ('Admin User', 'admin@restaurant.com', '0123456789', 'admin', 'admin123', 'ADMIN');

-- Manager  
INSERT INTO Staff (staffName, staffEmail, staffPhone, username, password, role)
VALUES ('Manager User', 'manager@restaurant.com', '0123456788', 'manager', 'manager123', 'MANAGER');

-- Staff
INSERT INTO Staff (staffName, staffEmail, staffPhone, username, password, role)
VALUES ('Staff User', 'staff@restaurant.com', '0123456787', 'staff', 'staff123', 'STAFF');

-- Chef
INSERT INTO Staff (staffName, staffEmail, staffPhone, username, password, role)
VALUES ('Chef User', 'chef@restaurant.com', '0123456786', 'chef', 'chef123', 'CHEF');
```

## 5. Xử Lý CORS

Backend cần enable CORS cho Frontend:

```java
// Spring Boot example
@CrossOrigin(origins = "http://localhost:5175")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // ... controller code
}
```

Hoặc cấu hình global CORS:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5175"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 6. Troubleshooting

### Lỗi thường gặp:

1. **CORS Error**: Kiểm tra cấu hình CORS trên Backend
2. **Network Error**: Kiểm tra Backend có đang chạy không
3. **404 Not Found**: Kiểm tra endpoint URL có đúng không
4. **500 Internal Server Error**: Kiểm tra logs Backend

### Debug Frontend:

1. Mở DevTools (F12)
2. Vào tab Network để xem API calls
3. Vào tab Console để xem error logs
4. Kiểm tra localStorage để xem dữ liệu được lưu

## 7. Security Notes

- Mật khẩu nên được hash (bcrypt) trên Backend
- Sử dụng JWT token cho authentication
- Implement rate limiting để tránh brute force
- Validate input data trên Backend
- Sử dụng HTTPS trong production

