import { useCustomerLogin } from "../../hooks/useCustomerLogin";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginForm({ onSubmit, onSwitchToRegister, onForgotPassword }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useCustomerLogin();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    clearError();
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login({
      username: formData.username,
      password: formData.password,
      onSuccess: () => {
        if (typeof onSubmit === "function") onSubmit(formData);
      },
    });
  };

  return (
    <div className="animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên Đăng Nhập
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
            className="form-input-enhanced"
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật Khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="form-input-enhanced pr-10"
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="mt-2 text-left">
            <button
              onClick={onForgotPassword}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-all duration-300 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-submit-enhanced"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Bạn chưa có tài khoản?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-orange-600 hover:text-orange-700 font-medium transition-all duration-300 hover:underline"
          >
            Hãy Đăng Ký
          </button>
        </p>
      </div>
    </div>
  );
}
