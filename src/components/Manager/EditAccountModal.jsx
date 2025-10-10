import { X, Save, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminEditAccountModal({
  isEditingAccount,
  setIsEditingAccount,
  editingItem,
  setEditingItem,
  saveAccount,
  accounts = [],
}) {
  if (!isEditingAccount) return null;

  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrs, setFieldErrs] = useState({});

  useEffect(() => {
    setRole((editingItem?.role || "staff").toLowerCase());
    setPassword("");
    setConfirm("");
    setErr("");
  }, [editingItem]);

  function validateForm({ name, email, phone, password, confirm, role, dob }) {
    const errs = {};
    const _name = (name || "").trim();
    const _email = (email || "").trim();
    let _phone = (phone || "").trim();
    const _role = role ? String(role).toUpperCase() : undefined;
    const _dob = (dob || "").trim();

    if (_name && (_name.length < 2 || _name.length > 50)) {
      errs.name = "Họ Tên từ 2–50 ký tự.";
    }

    if (_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
      errs.email = "Email không hợp lệ.";
    }

    if (_phone) {
      _phone = _phone.replace(/\D/g, "");
      if (!/^0[1-9]\d{8}$/.test(_phone)) {
        errs.phone =
          "Số Điện Thoại phải 10 số, bắt đầu bằng 0 và số thứ 2 từ 1–9.";
      }
    }

    if (_dob) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(_dob)) {
        errs.dob = "Ngày sinh phải dạng yyyy-MM-dd.";
      }
    }

    if (password || confirm) {
      if (!password || !confirm) {
        errs.confirm = "Vui lòng nhập đủ 2 ô mật khẩu.";
      } else if (password.length < 8 || password.length > 30) {
        errs.confirm = "Mật khẩu từ 8–30 ký tự.";
      } else if (password !== confirm) {
        errs.confirm = "Mật khẩu nhập lại không trùng.";
      }
    }

    return {
      errs,
      cleaned: {
        name: _name || undefined,
        email: _email || undefined,
        phone: _phone || undefined,
        dob: _dob || undefined,
        role: _role,
      },
    };
  }

  function normalizePhone(value = "") {
    return String(value).replace(/\D/g, "");
  }

  function precheckDuplicate({ email, phone }) {
    const checkId = editingItem?.id;
    const errs = {};

    const checkDupEmail = (email || "").trim().toLowerCase();
    const checkDupPhone = normalizePhone(phone || "");

    for (const check of accounts) {
      if (check?.id === checkId) continue;
      const checkEmail = (check?.email || "").trim().toLowerCase();
      const checkPhone = normalizePhone(check?.phone || "");

      if (checkDupEmail && checkEmail && checkEmail === checkDupEmail) {
        errs.email = "Email đã tồn tại.";
      }
      if (checkDupPhone && checkPhone && checkPhone === checkDupPhone) {
        errs.phone = "Số điện thoại đã tồn tại.";
      }
    }
    return errs;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setFieldErrs({});

    const toDigits = (isDigit) => String(isDigit || "").replace(/\D/g, "");
    const sameDate = (same1, same2) =>
      String(same1 || "").slice(0, 10) === String(same2 || "").slice(0, 10);
    const old = editingItem || {};
    const staffId = editingItem?.staffId ?? editingItem?.id;
    if (!staffId) return setErr("Không tìm thấy tài khoản phù hợp.");

    const tmpData = new FormData(e.target);
    const rawData = {
      name: tmpData.get("name"),
      email: tmpData.get("email"),
      phone: tmpData.get("phone"),
      dob: tmpData.get("dob"),
      role,
      password,
      confirm,
    };

    const { errs, cleaned } = validateForm(rawData);
    if (Object.keys(errs).length) return setFieldErrs(errs);

    const dupChecks = {
      email:
        cleaned.email && cleaned.email !== (old.email || "")
          ? cleaned.email
          : "",
      phone:
        cleaned.phone && toDigits(cleaned.phone) !== toDigits(old.phone || "")
          ? cleaned.phone
          : "",
    };

    const dup = precheckDuplicate(dupChecks);
    if (Object.keys(dup).length) return setFieldErrs(dup);

    const planUpdate = [
      {
        ui: "name",
        api: "fullName",
        diff: (value) => value !== (old.name || ""),
      },
      {
        ui: "email",
        api: "email",
        diff: (value) => value !== (old.email || ""),
      },
      {
        ui: "phone",
        api: "phone",
        xform: toDigits,
        diff: (value) => toDigits(value) !== toDigits(old.phone || ""),
      },
      { ui: "dob", api: "dob", diff: (value) => !sameDate(value, old.dob) },
      {
        ui: "role",
        api: "role",
        xform: (value) => String(value).toUpperCase(),
        diff: (value) =>
          String(value).toUpperCase() !== String(old.role || "").toUpperCase(),
      },
      { ui: "password", api: "password", diff: (value) => !!value },
    ];

    const changesData = planUpdate.reduce(
      (object, { ui, api, xform, diff }) => {
        const value = cleaned[ui] ?? (ui === "password" ? password : undefined);
        if (value === undefined || value === "") return object;
        const val = xform ? xform(value) : value;
        if (diff(val)) object[api] = val;
        return object;
      },
      {}
    );

    if (!Object.keys(changesData).length)
      return setErr("Không có thay đổi nào.");

    try {
      setSaving(true);
      await saveAccount({ staffId, ...changesData });
      setIsEditingAccount(false);
      setEditingItem(null);
    } catch (ex) {
      setErr(ex?.message || "Cập nhật thông tin thất bại.");
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
              onChange={() => setFieldErrs((s) => ({ ...s, name: "" }))}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {fieldErrs.name && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dob"
              defaultValue={
                editingItem?.dob ? String(editingItem.dob).slice(0, 10) : ""
              }
              onChange={() => setFieldErrs((s) => ({ ...s, dob: "" }))}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {fieldErrs.dob && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.dob}</p>
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
