import { useState } from "react";
import { X, Save, Eye, EyeOff } from "lucide-react";
import { createStaff, getStaff } from "../../lib/apiStaff";

export default function AdminAccountForm({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    staffName: "",
    staffPhone: "",
    staffEmail: "",
    role: "STAFF",
  });
  const [saving, setSaving] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;
  //Cập nhật từng field trong form
  const setF = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const ROLES = ["ADMIN", "MANAGER", "STAFF", "CHEF"];
  function validateCreate(f) {
    const errs = {};
    const cleaned = {
      username: (f.username || "").trim(),
      password: f.password || "",
      staffName: (f.staffName || "").trim(),
      staffPhone: (f.staffPhone || "").trim(),
      staffEmail: (f.staffEmail || "").trim(),
      role: String(f.role || "").toUpperCase(),
    };

    if (
      !cleaned.username ||
      cleaned.username.length < 3 ||
      cleaned.username.length > 30
    ) {
      errs.username = "Tên đăng nhập phải từ 3-30 ký tự.";
    }

    if (
      !cleaned.password ||
      cleaned.password.length < 8 ||
      cleaned.password.length > 30
    ) {
      errs.password = "Mật khẩu phải từ 8–30 ký tự.";
    }

    if (
      !cleaned.staffName ||
      cleaned.staffName.length < 2 ||
      cleaned.staffName.length > 30
    ) {
      errs.staffName = "Họ Tên phải từ 2–30 ký tự.";
    }

    if (cleaned.staffPhone) {
      if (!/^\d+$/.test(cleaned.staffPhone))
        errs.staffPhone = "Số Điện Thoại chỉ chứa số.";
      else if (!/^\d{9,11}$/.test(cleaned.staffPhone))
        errs.staffPhone = "Số Điện Thoại phải 9–11 chữ số.";
    }

    if (
      !cleaned.staffEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.staffEmail)
    ) {
      errs.staffEmail = "Email không hợp lệ.";
    }

    if (!ROLES.includes(cleaned.role)) errs.role = "Vai trò không hợp lệ.";

    if (!cleaned.staffPhone) cleaned.staffPhone = null;

    return { errs, cleaned };
  }

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setFieldErrs({});

    const { errs, cleaned } = validateCreate(form);
    if (Object.keys(errs).length) {
      setFieldErrs(errs);
      return;
    }

    try {
      setSaving(true);
      const created = await createStaff(cleaned);

      let full = created;
      const id = created?.staffId ?? created?.id;
      if (id) {
        try {
          const detail = await getStaff(id);
          if (detail) full = detail;
        } catch (refetchErr) {
          console.debug("[Refetch skipped]", refetchErr.message);
        }
      }

      onCreated?.(full);
      onClose?.();
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data || {};

      if (status === 409) {
        const dup = data?.duplicates || {};
        const fe = {};

        if (dup.username) fe.username = "Tên đăng nhập đã tồn tại.";
        if (dup.email) fe.staffEmail = "Email đã tồn tại.";
        if (dup.phone) fe.staffPhone = "Số Điện Thoại đã tồn tại.";

        if (!Object.keys(fe).length && typeof data?.message === "string") {
          const msg = data.message.toLowerCase();
          if (msg.includes("user")) fe.username = "Tên đăng nhập đã tồn tại.";
          if (msg.includes("email")) fe.staffEmail = "Email đã tồn tại.";
          if (msg.includes("phone") || msg.includes("sđt"))
            fe.staffPhone = "Số Điện Thoại đã tồn tại.";
        }

        if (Object.keys(fe).length) {
          setFieldErrs(fe);
          return;
        }
      }

      setErr(data?.message || e.message || "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
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

        <form onSubmit={submit} noValidate className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tên Đăng Nhập
            </label>
            <input
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.username}
              onChange={(e) => {
                setF("username", e.target.value);
                setFieldErrs((s) => ({ ...s, username: "" }));
              }}
              minLength={3}
              maxLength={30}
              required
            />
            {fieldErrs.username && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mật Khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.password}
                onChange={(e) => {
                  setF("password", e.target.value);
                  setFieldErrs((s) => ({ ...s, password: "" }));
                }}
                minLength={8}
                maxLength={30}
                required
              />
              {fieldErrs.password && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrs.password}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Họ Tên
            </label>
            <input
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.staffName}
              onChange={(e) => {
                setF("staffName", e.target.value);
                setFieldErrs((s) => ({ ...s, staffName: "" }));
              }}
              minLength={2}
              maxLength={30}
              required
            />
            {fieldErrs.staffName && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.staffName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.staffEmail}
              onChange={(e) => {
                setF("staffEmail", e.target.value);
                setFieldErrs((s) => ({ ...s, staffEmail: "" }));
              }}
              required
            />
            {fieldErrs.staffEmail && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrs.staffEmail}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Số Điện Thoại
            </label>
            <input
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.staffPhone}
              onChange={(e) => {
                setF("staffPhone", e.target.value);
                setFieldErrs((s) => ({ ...s, staffPhone: "" }));
              }}
            />
            {fieldErrs.staffPhone && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrs.staffPhone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Vai Trò
            </label>
            <select
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.role}
              onChange={(e) => setF("role", e.target.value)}
              required
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="STAFF">STAFF</option>
              <option value="CHEF">CHEF</option>
            </select>
            {fieldErrs.role && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.role}</p>
            )}
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

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
