// Mock API Server để test đăng nhập
// Chạy: node mock-server.js

import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 8080;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Mock database
const users = [
  {
    staffId: 1,
    staffName: "Admin User",
    staffEmail: "admin@restaurant.com", 
    staffPhone: "0123456789",
    username: "admin",
    password: "admin123",
    role: "ADMIN"
  },
  {
    staffId: 2,
    staffName: "Manager User",
    staffEmail: "manager@restaurant.com",
    staffPhone: "0123456788", 
    username: "manager",
    password: "manager123",
    role: "MANAGER"
  },
  {
    staffId: 3,
    staffName: "Staff User", 
    staffEmail: "staff@restaurant.com",
    staffPhone: "0123456787",
    username: "staff",
    password: "staff123", 
    role: "STAFF"
  },
  {
    staffId: 4,
    staffName: "Chef User",
    staffEmail: "chef@restaurant.com",
    staffPhone: "0123456786",
    username: "chef", 
    password: "chef123",
    role: "CHEF"
  }
];

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log(`Login attempt: ${username}`);
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      message: "Username và password là bắt buộc",
      error: "MISSING_CREDENTIALS"
    });
  }
  
  // Find user
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      message: "Tên đăng nhập hoặc mật khẩu không đúng", 
      error: "INVALID_CREDENTIALS"
    });
  }
  
  // Return user data (excluding password)
  const { password: _, ...userData } = user;
  
  res.json({
    ...userData,
    token: `mock_jwt_token_${user.staffId}`,
    message: "Đăng nhập thành công"
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /api/auth/login - Login endpoint`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`\n👥 Test accounts:`);
  users.forEach(user => {
    console.log(`   ${user.role.padEnd(8)} - ${user.username} / ${user.password}`);
  });
  console.log(`\n🌐 Frontend URL: http://localhost:5175/homestaff`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Lỗi server nội bộ",
    error: "INTERNAL_SERVER_ERROR"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint không tồn tại",
    error: "NOT_FOUND"
  });
});

