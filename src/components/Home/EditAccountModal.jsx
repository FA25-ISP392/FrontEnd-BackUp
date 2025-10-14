import { useState, useEffect } from "react";
import { X, User, Phone, Mail, Save } from "lucide-react";
import {
  listCustomers,
  updateCustomer,
  normalizeCustomer,
  findCustomerByUsername,
} from "../../lib/apiCustomer";

export default function EditAccountModal({ isOpen, onClose, userInfo }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fieldErrs, setFieldErrs] = useState({});
  const [allCustomers, setAllCustomers] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadCustomers() {
      if (!isOpen) return;
      try {
        const data = await listCustomers();
        if (mounted) setAllCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Không thể tải danh sách khách hàng:", err);
        if (mounted) setAllCustomers([]);
      }
    }
    loadCustomers();
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const trim = (set) => String(set || "").trim();
  const toDigits = (set) => String(set || "").replace(/\D/g, "");

  function validateFullName(value) {
    const setFullName = trim(value);
    if (!setFullName) return "Vui lòng nhập họ và tên";
    if (setFullName.length < 2 || setFullName.length > 50)
      return "Họ và tên phải từ 2 đến 50 ký tự";
    return "";
  }

  function validateEmail(value) {
    const setEmail = trim(value);
    if (!setEmail) return ""; // email không bắt buộc
    const vldEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setEmail);
    return vldEmail ? "" : "Email không hợp lệ";
  }

  function validatePhone(value) {
    const setPhone = toDigits(value);
    if (!setPhone) return ""; // phone không bắt buộc
    const vldEmail = /^0[1-9]\d{8}$/.test(setPhone);
    return vldEmail ? "" : "Số điện thoại phải gồm 10 số và bắt đầu bằng 0";
  }

  useEffect(() => {
    if (isOpen && userInfo) {
      setFormData({
        fullName: userInfo.fullName || "",
        phone: userInfo.phone || "",
        email: userInfo.email || "",
      });
    }
  }, [isOpen, userInfo]);

  const isDirty = (() => {
    if (!userInfo) return false;
    const current = {
      fullName: String(formData.fullName || "").trim(),
      phone: String(formData.phone || "").replace(/\D/g, ""),
      email: String(formData.email || "").trim(),
    };
    const old = {
      fullName: String(userInfo.fullName || "").trim(),
      phone: String(userInfo.phone || "").replace(/\D/g, ""),
      email: String(userInfo.email || "").trim(),
    };
    return (
      current.fullName !== old.fullName ||
      current.phone !== old.phone ||
      current.email !== old.email
    );
  })();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFieldErrs((prev) => {
      const next = { ...prev };
      if (name === "fullName") next.fullName = validateFullName(value);
      if (name === "email") next.email = validateEmail(value);
      if (name === "phone") next.phone = validatePhone(value);
      return next;
    });
  };

  function checkDuplicateEmailPhone({ email, phone, selfId }) {
    const e = String(email || "")
      .trim()
      .toLowerCase();
    const p = String(phone || "").replace(/\D/g, "");
    const errs = {};

    for (const c of allCustomers) {
      if (!c || c.id === selfId) continue;
      const ce = String(c.email || "")
        .trim()
        .toLowerCase();
      const cp = String(c.phone || "").replace(/\D/g, "");

      if (e && ce && e === ce) {
        errs.email = "Email đã tồn tại.";
      }
      if (p && cp && p === cp) {
        errs.phone = "Số điện thoại đã tồn tại.";
      }

      if (errs.email || errs.phone) break;
    }

    return errs;
  }

  const resolveCustomerId = async () => {
    if (userInfo?.customerId) return userInfo.customerId;
    if (userInfo?.id) return userInfo.id;

    if (userInfo?.username) {
      const found = await findCustomerByUsername(userInfo.username);
      return found?.customerId ?? found?.id ?? null;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (!isDirty) {
        setMessage({ type: "error", text: "Không có thay đổi nào để lưu." });
        setIsLoading(false);
        return;
      }

      const errName = validateFullName(formData.fullName);
      const errEmail = validateEmail(formData.email);
      const errPhone = validatePhone(formData.phone);

      const newFieldErrs = {
        fullName: errName,
        email: errEmail,
        phone: errPhone,
      };
      const hasErr = Object.values(newFieldErrs).some(Boolean);
      if (hasErr) {
        setFieldErrs(newFieldErrs);
        throw new Error("Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại.");
      }

      const dup = checkDuplicateEmailPhone({
        email: formData.email,
        phone: formData.phone,
        selfId: userInfo?.id,
      });
      if (dup.email || dup.phone) {
        setFieldErrs((s) => ({ ...s, ...dup }));
        throw new Error("Email hoặc số điện thoại đã tồn tại.");
      }

      const toDigits = (s) => String(s || "").replace(/\D/g, "");
      const payload = {
        fullName: String(formData.fullName || "").trim(),
        phone: toDigits(formData.phone),
        email: String(formData.email || "").trim(),
      };

      const customerId = await resolveCustomerId();
      if (!customerId)
        throw new Error("Không xác định được tài khoản hiện tại.");
      const serverUser = await updateCustomer(customerId, payload);
      const normalize = normalizeCustomer(serverUser);
      localStorage.setItem("user", JSON.stringify(normalize));
      window.dispatchEvent(new Event("auth:changed"));

      setFieldErrs({});
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });

      setTimeout(() => {
        onClose();
        setMessage({ type: "", text: "" });
      }, 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Cập nhật thất bại.",
      });
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
            <h2 className="text-xl font-bold text-gray-900">
              Sửa thông tin tài khoản
            </h2>
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
                Họ và tên *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Nhập họ và tên"
                  required
                />
                {fieldErrs.fullName && (
                  <p className="text-xs text-red-600 mt-1">
                    {fieldErrs.fullName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Nhập số điện thoại"
                />
                {fieldErrs.phone && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrs.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Nhập email"
                />
                {fieldErrs.email && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrs.email}</p>
                )}
              </div>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm font-medium text-center ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-300"
                    : "bg-red-50 text-red-700 border border-red-300"
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
                disabled={isLoading || !isDirty}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
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
