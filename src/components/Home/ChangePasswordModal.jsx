import { useMemo, useState } from "react";
import { X, Lock, Eye, EyeOff, Save } from "lucide-react";
import { getCurrentUser } from "../../lib/auth";
import {
  findCustomerByUsername,
  changeCustomerPassword,
} from "../../lib/apiCustomer";

export default function ChangePasswordModal({ isOpen, onClose, userInfo }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const effectiveUser = useMemo(() => {
    return userInfo || getCurrentUser() || {};
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessage({ type: "", text: "" });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (password.length > 30) {
      return "Mật khẩu không được vượt quá 30 ký tự";
    }
    return null;
  };

  const resolveCustomerId = async () => {
    if (effectiveUser?.id) return effectiveUser.id;

    if (effectiveUser?.username) {
      const found = await findCustomerByUsername(effectiveUser.username);
      return found?.id;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const current = formData.currentPassword.trim();
      const next = formData.newPassword.trim();
      const confirm = formData.confirmPassword.trim();

      if (!current) {
        throw new Error("Vui lòng nhập mật khẩu hiện tại");
      }

      if (!next) {
        throw new Error("Vui lòng nhập mật khẩu mới");
      }

      const passwordError = validatePassword(next);
      if (passwordError) {
        throw new Error(passwordError);
      }

      if (next !== confirm) throw new Error("Mật khẩu xác nhận không khớp");

      if (current === next)
        throw new Error("Mật khẩu mới phải khác mật khẩu hiện tại");

      const customerId = await resolveCustomerId();
      if (!customerId) {
        throw new Error("Không xác định được tài khoản khách hàng hiện tại.");
      }
      await changeCustomerPassword(customerId, next);
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });

      setTimeout(() => {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({
          current: false,
          new: false,
          confirm: false,
        });
        onClose();
        setMessage({ type: "", text: "" });
      }, 1200);
    } catch (err) {
      const msg =
        err?.message ||
        err?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 transition-opacity duration-300">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl transform transition-transform duration-300">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang đổi...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Đổi mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
