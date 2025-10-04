import { X, Save, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditAccountModal({
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

  // đồng bộ khi mở modal
  useEffect(() => {
    setRole((editingItem?.role || "staff").toLowerCase());
    setPassword("");
    setConfirm("");
    setErr("");
  }, [editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate đổi mật khẩu (chỉ khi người dùng nhập)
    if (password || confirm) {
      if (!password || !confirm) {
        setErr("Vui lòng nhập đầy đủ 2 ô mật khẩu.");
        return;
      }
      if (password !== confirm) {
        setErr("Mật khẩu nhập lại không khớp.");
        return;
      }
      if (password.length < 8) {
        setErr("Mật khẩu phải từ 8 ký tự trở lên.");
        return;
      }
    }
    const formData = new FormData(e.target);
    const accountData = {
      id: editingItem?.id,
      name: formData.get("name"),
      email: formData.get("email"),
      // Chỉ kèm password nếu có nhập
      ...(password ? { password } : {}),
      phone: formData.get("phone"),
      role: role,
    };
    try {
      setSaving(true);
      await saveAccount(accountData);
      setIsEditingAccount(false);
      setEditingItem(null);
    } catch (err) {
      alert(err?.message || "Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white rounded-t-2xl">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tên
            </label>
            <input
              type="text"
              name="name"
              defaultValue={editingItem?.name || ""}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Mật khẩu mới (tuỳ chọn) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mật khẩu mới{" "}
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
                className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
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
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
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
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
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
