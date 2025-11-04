import { useState, useMemo } from "react";
import { X, Save, Eye, EyeOff } from "lucide-react";
import { createStaff, getStaff } from "../../lib/apiStaff";

export default function AdminAccountForm({
  open,
  onClose,
  onCreated,
  accounts = [],
}) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    role: "STAFF",
  });
  const [saving, setSaving] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;
  const setF = (key, value) => setForm((state) => ({ ...state, [key]: value }));

  const ROLES = ["ADMIN", "MANAGER", "STAFF", "CHEF"];
  function validateCreate(vldCreate) {
    const errs = {};
    const cleaned = {
      username: (vldCreate.username || "").trim(),
      password: vldCreate.password || "",
      fullName: (vldCreate.fullName || "").trim(),
      phone: (vldCreate.phone || "").trim(),
      email: (vldCreate.email || "").trim(),
      dob: (vldCreate.dob || "").trim(),
      role: String(vldCreate.role || "").toUpperCase(),
    };

    if (
      !cleaned.username ||
      cleaned.username.length < 3 ||
      cleaned.username.length > 30
    ) {
      errs.username = "Tên đăng nhập phải từ 3–30 ký tự.";
    }

    if (
      !cleaned.password ||
      cleaned.password.length < 8 ||
      cleaned.password.length > 30
    ) {
      errs.password = "Mật khẩu phải từ 8–30 ký tự.";
    }

    if (
      !cleaned.fullName ||
      cleaned.fullName.length < 2 ||
      cleaned.fullName.length > 50
    ) {
      errs.fullName = "Họ tên phải từ 2–50 ký tự.";
    }

    if (cleaned.phone) {
      const newPhone = cleaned.phone.replace(/\D/g, "");
      if (!/^0[1-9]\d{8}$/.test(newPhone)) {
        errs.phone =
          "Số điện thoại phải 10 số, bắt đầu bằng 0 và số thứ 2 từ 1–9.";
      }
      cleaned.phone = newPhone;
    } else {
      delete cleaned.phone;
    }

    if (cleaned.dob) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned.dob)) {
        errs.dob = "Ngày sinh phải dạng yyyy-MM-dd.";
      }
    } else {
      delete cleaned.dob;
    }

    if (cleaned.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
        errs.email = "Email không hợp lệ.";
      }
    } else {
      delete cleaned.email;
    }

    if (!ROLES.includes(cleaned.role)) errs.role = "Vai trò không hợp lệ.";

    return { errs, cleaned };
  }

  function normalizePhone(checkPhone = "") {
    return String(checkPhone).replace(/\D/g, "");
  }

  const { checkUserDup, checkEmailDup, checkPhoneDup } = useMemo(() => {
    const checkUser = new Set(
      (accounts || [])
        .map((checkU) => (checkU?.username || "").trim().toLowerCase())
        .filter(Boolean)
    );
    const checkEmail = new Set(
      (accounts || [])
        .map((checkE) => (checkE?.email || "").trim().toLowerCase())
        .filter(Boolean)
    );
    const checkPhone = new Set(
      (accounts || [])
        .map((checkP) => normalizePhone(checkP?.phone || ""))
        .filter(Boolean)
    );
    return {
      checkUserDup: checkUser,
      checkEmailDup: checkEmail,
      checkPhoneDup: checkPhone,
    };
  }, [accounts]);

  function precheckDuplicate({ username, email, phone }) {
    const tmp = {};
    const us = (username || "").trim().toLowerCase();
    const em = (email || "").trim().toLowerCase();
    const ph = normalizePhone(phone || "");

    if (us && checkUserDup.has(us)) tmp.username = "Tên đăng nhập đã tồn tại.";
    if (em && checkEmailDup.has(em)) tmp.email = "Email đã tồn tại.";
    if (ph && checkPhoneDup.has(ph)) tmp.phone = "Số điện thoại đã tồn tại.";

    return tmp;
  }

  function focusFirstError(tmp) {
    const firstKey = Object.keys(tmp)[0];
    const choose =
      firstKey === "username"
        ? "input[name='username']"
        : firstKey === "email"
        ? "input[name='email']"
        : firstKey === "phone"
        ? "input[name='phone']"
        : firstKey === "password"
        ? "input[type='password']"
        : firstKey === "fullName"
        ? "input[name='fullName']"
        : null;
    const result = choose && document.querySelector(choose);
    if (result) result.focus();
  }

  function showFieldErrors(tmp) {
    setFieldErrs(tmp);
    setErr("");
    requestAnimationFrame(() => focusFirstError(tmp));
  }

  function parseBackendError(err) {
    const status = err?.response?.status;
    const data = err?.response?.data || {};
    const lowMessage = String(err?.message || "").toLowerCase();
    const tmp = {};

    if (status === 400 || status === 409) {
      const list =
        data?.errors ||
        data?.result ||
        data?.fieldErrors ||
        data?.violations ||
        data?.details ||
        data?.subErrors ||
        [];
      if (Array.isArray(list)) {
        for (const it of list) {
          const field = String(
            it.field || it.fieldName || it.property || it.path || it.param || ""
          ).toLowerCase();
          const msg =
            it.defaultMessage ||
            it.message ||
            it.reason ||
            data?.message ||
            "Không hợp lệ.";
          if (field.includes("user")) tmp.username = msg;
          if (field.includes("email")) tmp.email = msg;
          if (field.includes("phone") || field.includes("tel")) tmp.phone = msg;
          if (field.includes("name")) tmp.fullName = msg;
          if (field.includes("pass")) tmp.password = msg;
        }
      }

      const dup = data?.duplicates || {};
      if (dup.username) tmp.username = "Tên đăng nhập đã tồn tại.";
      if (dup.email) tmp.email = "Email đã tồn tại.";
      if (dup.phone) tmp.phone = "Số Điện Thoại đã tồn tại.";

      const dupRe = /(exist|exists|duplicate|already|unique|trùng)/i;
      if (
        !tmp.username &&
        /(user(name)?)/i.test(lowMessage) &&
        dupRe.test(lowMessage)
      )
        tmp.username = "Tên đăng nhập đã tồn tại.";
      if (!tmp.email && /(email)/i.test(lowMessage) && dupRe.test(lowMessage))
        tmp.email = "Email đã tồn tại.";
      if (
        !tmp.phone &&
        /(phone|sđt)/i.test(lowMessage) &&
        dupRe.test(lowMessage)
      )
        tmp.phone = "Số Điện Thoại đã tồn tại.";

      if (!tmp.email) {
        const deep = JSON.stringify(data).toLowerCase();
        const cause = String(
          data?.cause?.message || data?.rootCause?.message || ""
        ).toLowerCase();
        if (
          (deep.includes("email") && dupRe.test(deep)) ||
          (cause.includes("email") && dupRe.test(cause))
        ) {
          tmp.email = "Email đã tồn tại.";
        }
      }
    }

    return {
      fieldErrors: tmp,
      message: data?.message || err.message || "Có lỗi xảy ra.",
    };
  }

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setFieldErrs({});

    const { errs, cleaned } = validateCreate(form);
    if (Object.keys(errs).length) return showFieldErrors(errs);

    const payload = Object.fromEntries(
      Object.entries(cleaned).filter(([_, v]) => v !== "" && v !== null)
    );

    const dupErrs = precheckDuplicate(cleaned);
    if (Object.keys(dupErrs).length) return showFieldErrors(dupErrs);

    try {
      setSaving(true);

      const created = await createStaff(payload);
      const id = created?.staffId ?? created?.id;
      const full = id ? await getStaff(id).catch(() => created) : created;

      onCreated?.(full);
      onClose?.();
    } catch (err) {
      const { fieldErrors, message } = parseBackendError(err);
      if (Object.keys(fieldErrors).length) return showFieldErrors(fieldErrors);
      setErr(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
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
              name="username"
              className="form-input-enhanced"
              value={form.username}
              onChange={(e) => {
                setF("username", e.target.value);
                setFieldErrs((s) => ({ ...s, username: "" }));
                setErr("");
              }}
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
                className="form-input-enhanced pr-10"
                value={form.password}
                onChange={(e) => {
                  setF("password", e.target.value);
                  setFieldErrs((s) => ({ ...s, password: "" }));
                }}
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
              className="form-input-enhanced"
              value={form.fullName}
              onChange={(e) => {
                setF("fullName", e.target.value);
                setFieldErrs((s) => ({ ...s, fullName: "" }));
              }}
              required
            />
            {fieldErrs.fullName && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="form-input-enhanced"
              value={form.email}
              onChange={(e) => {
                setF("email", e.target.value);
                setFieldErrs((s) => ({ ...s, email: "" }));
                setErr("");
              }}
            />
            {fieldErrs.email && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              className="form-input-enhanced"
              value={form.dob}
              onChange={(e) => {
                setF("dob", e.target.value);
                setFieldErrs((s) => ({ ...s, dob: "" }));
              }}
            />
            {fieldErrs.dob && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.dob}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Số Điện Thoại
            </label>
            <input
              name="phone"
              className="form-input-enhanced"
              value={form.phone}
              onChange={(e) => {
                setF("phone", e.target.value);
                setFieldErrs((s) => ({ ...s, phone: "" }));
                setErr("");
              }}
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
              className="form-input-enhanced"
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
              className="flex-1 px-4 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-100 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-submit-enhanced py-3" // 👈 Class mới
            >
              <Save className="h-4 w-4 inline-block mr-2" />
              {saving ? "Đang tạo..." : "Tạo nhân sự"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
