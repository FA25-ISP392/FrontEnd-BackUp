import { X, Save, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminEditAccountModal({
  isEditingAccount,
  setIsEditingAccount,
  editingItem,
  setEditingItem,
  saveAccount,
}) {
  if (!isEditingAccount) return null;

  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("staff"); // state local
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrs, setFieldErrs] = useState({});

  // đồng bộ khi mở modal
  useEffect(() => {
    setRole((editingItem?.role || "staff").toLowerCase());
    setPassword("");
    setConfirm("");
    setErr("");
  }, [editingItem]);

  const ROLES = ["MANAGER", "CHEF", "STAFF"];
  function validateForm({ name, email, phone, password, confirm, role }) {
    const errs = {};
    const _name = (name || "").trim();
    const _email = (email || "").trim();
    const _phone = (phone || "").trim();
    const _role = String(role || "").toUpperCase();

    if (!_name || _name.length < 2 || _name.length > 30) {
      errs.name = "Họ Tên từ 2-30 ký tự.";
    }

    if (!_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
      errs.email = "Email có ký tự không hợp lệ.";
    }

    if (_phone) {
      if (!/^\d+$/.test(_phone)) {
        errs.phone = "Số Điện Thoại chỉ được chứa số.";
      } else if (!/^\d{9,11}$/.test(_phone)) {
        errs.phone = "Số Điện Thoại phải 9–11 chữ số.";
      }
    }

    if (password || confirm) {
      if (password.length < 8 || password.length > 30) {
        errs.confirm = "Mật khẩu từ 8-30 ký tự.";
      }

      if (!password || !confirm) {
        errs.confirm = "Vui lòng nhập đủ 2 ô mật khẩu.";
      } else if (password !== confirm) {
        errs.confirm = "Mật khẩu nhập lại không trùng hợp.";
      }
    }

    if (!ROLES.includes(_role)) {
      errs.role = "Vai trò không hợp lệ.";
    }

    return {
      errs,
      cleaned: {
        name: _name,
        email: _email,
        phone: _phone,
        role: _role,
      },
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");

    const { errs, cleaned } = validateForm({
      name,
      email,
      phone,
      password,
      confirm,
      role,
    });

    if (Object.keys(errs).length) {
      setFieldErrs(errs);
      setErr("");
      return;
    }

    const accountData = {
      id: editingItem?.id,
      name: cleaned.name,
      email: cleaned.email,
      phone: cleaned.phone || null,
      role: cleaned.role,
      ...(password ? { password } : {}),
    };

    try {
      setSaving(true);
      await saveAccount(accountData);
      setIsEditingAccount(false);
      setEditingItem(null);
    } catch (err) {
      setErr(err?.message || "Cập nhật thông tin thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingItem ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản Mới"}
            </h2>
            <button
              onClick={() => {
                setIsEditingAccount(false);
                setEditingItem(null);
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tên
            </label>
            <input
              type="text"
              name="name"
              defaultValue={editingItem?.name || ""}
              minLength={2}
              maxLength={30}
              required
              onChange={() => setFieldErrs((s) => ({ ...s, name: "" }))}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {fieldErrs.name && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={editingItem?.email || ""}
              required
              onChange={() => setFieldErrs((s) => ({ ...s, email: "" }))}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {fieldErrs.email && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mật khẩu mới{" "}
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {fieldErrs.password && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrs.password}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showPwd ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setFieldErrs((s) => ({ ...s, confirm: "" })); // clear lỗi khi gõ
                }}
                className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {fieldErrs.confirm && (
                <p className="text-xs text-red-600 mt-1">{fieldErrs.confirm}</p>
              )}
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Số Điện Thoại
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={editingItem?.phone || ""}
              onChange={() => setFieldErrs((s) => ({ ...s, phone: "" }))}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {fieldErrs.phone && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Vai Trò
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditingAccount(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
