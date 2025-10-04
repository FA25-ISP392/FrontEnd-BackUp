import { useState } from "react";
import { X, Save } from "lucide-react";
import { createStaff } from "../../lib/apiStaff";

export default function ManagerAccountForm({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    staffName: "",
    staffPhone: "",
    staffEmail: "",
    role: "STAFF",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;
  //Cập nhật từng field trong form
  const setF = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (
      !form.username ||
      !form.password ||
      !form.staffName ||
      !form.staffEmail
    ) {
      setErr("Vui lòng nhập đủ Username, Password, Họ tên, Email.");
      return;
    }
    try {
      setSaving(true);
      const newStaff = await createStaff(form); //Call API tạo nhân viên
      onCreated?.(newStaff); //Call fallback để component cha cập nhật list
      onClose?.();
    } catch (e) {
      setErr(e.message || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Thêm Tài Khoản Nhân Sự</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tên Đăng Nhập
              </label>
              <input
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.username}
                onChange={(e) => setF("username", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Mật Khẩu
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.password}
                onChange={(e) => setF("password", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Họ Tên
              </label>
              <input
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.staffName}
                onChange={(e) => setF("staffName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Số Điện Thoại
              </label>
              <input
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.staffPhone}
                onChange={(e) => setF("staffPhone", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.staffEmail}
                onChange={(e) => setF("staffEmail", e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vai Trò
              </label>
              <select
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.role}
                onChange={(e) => setF("role", e.target.value)}
                required
              >
                <option value="MANAGER">MANAGER</option>
                <option value="STAFF">STAFF</option>
                <option value="CHEF">CHEF</option>
              </select>
            </div>
          </div>

          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {err}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Đang tạo..." : "Tạo nhân sự"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
