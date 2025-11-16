import { useState } from "react";
import {
  ChefHat,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
  Lock,
} from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      username,
      password,
      onSuccess: (path) => navigate(path, { replace: true }),
    });
  };

  return (
    <div className="min-h-screen relative w-full h-full flex items-center justify-center p-4">
      {/* 1. Hình nền toàn màn hình */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />
      {/* 2. Lớp phủ tối */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 3. Form Đăng Nhập - Thẻ "Thủy Tinh" */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden mx-4 animate-fade-in-up">
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center border-2 border-white/50 shadow-lg">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mt-4 shadow-text-lg">
              MónCủaBạn
            </h2>
            <p className="text-neutral-200 shadow-text">
              Đăng nhập hệ thống quản lý
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100/80 border border-red-300 rounded-xl flex items-center gap-3 text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-300" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/20 text-white placeholder-neutral-300 border border-white/30 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all outline-none"
                placeholder="Tên đăng nhập"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-300" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/20 text-white placeholder-neutral-300 border border-white/30 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all outline-none"
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
