import { useState } from "react";
import { ChefHat, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Hệ Thống Quản Lý Nhà Hàng
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Đăng nhập vào hệ thống quản lý nhà hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 overflow-hidden">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500"></div>
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-2">
                      Nhà Hàng Delicious
                    </h3>
                    <p className="text-lg opacity-90">Hương vị tuyệt vời</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <h4 className="text-xl font-bold text-neutral-900 mb-2">
                  Chào mừng đến với hệ thống quản lý
                </h4>
                <p className="text-neutral-600">
                  Quản lý nhà hàng hiệu quả và chuyên nghiệp
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Đăng nhập
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập tên đăng nhập"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập mật khẩu"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
    </div>
  );
}
