import { useState } from "react";
import { X, Save } from "lucide-react";
import { createDish } from "../../lib/apiDish";

export default function AdminDishForm({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    dish_name: "",
    price: "",
    category: "",
    description: "",
    calo: "",
    picture: "",
    is_available: true,
  });
  const [saving, setSaving] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [err, setErr] = useState("");

  if (!open) return null;

  const setF = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const CATEGORIES = [
    "PIZZA",
    "Pasta",
    "Main Course",
    "Salad",
    "Dessert",
    "Appetizer",
    "Beverage",
  ];

  function validate(f) {
    const errs = {};
    if (!f.dish_name || f.dish_name.trim().length < 2)
      errs.dish_name = "Tên món ăn phải từ 2 ký tự trở lên.";
    if (!f.price || Number(f.price) <= 0) errs.price = "Giá phải là số dương.";
    if (!f.category) errs.category = "Vui lòng chọn danh mục.";
    if (!f.description || f.description.trim().length < 10)
      errs.description = "Mô tả phải ít nhất 10 ký tự.";
    return errs;
  }

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setFieldErrs({});
    const errs = validate(form);
    if (Object.keys(errs).length) return setFieldErrs(errs);

    try {
      setSaving(true);
      const payload = {
        dishName: form.dish_name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        calo: form.calo ? Number(form.calo) : 0,
        category: form.category,
        picture: form.picture.trim(),
        isAvailable: Boolean(form.is_available),
        status: form.is_available ? "available" : "unavailable",
      };

      const created = await createDish(payload);
      onCreated?.(created);
      onClose?.();

      setForm({
        dish_name: "",
        price: "",
        category: "",
        description: "",
        calo: "",
        picture: "",
        is_available: true,
      });
    } catch (e) {
      setErr(e.message || "Có lỗi xảy ra khi tạo món ăn.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Thêm Món Ăn Mới</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Tên món */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tên Món Ăn
            </label>
            <input
              value={form.dish_name}
              onChange={(e) => setF("dish_name", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              required
            />
            {fieldErrs.dish_name && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.dish_name}</p>
            )}
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setF("price", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              min="1"
              required
            />
            {fieldErrs.price && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.price}</p>
            )}
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Danh Mục
            </label>
            <select
              value={form.category}
              onChange={(e) => setF("category", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Chọn danh mục</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {fieldErrs.category && (
              <p className="text-xs text-red-600 mt-1">{fieldErrs.category}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mô Tả
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setF("description", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
              rows={3}
              required
            />
            {fieldErrs.description && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrs.description}
              </p>
            )}
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Calories (tùy chọn)
            </label>
            <input
              type="number"
              value={form.calo}
              onChange={(e) => setF("calo", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              min="0"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              URL Hình Ảnh (tùy chọn)
            </label>
            <input
              type="url"
              value={form.picture}
              onChange={(e) => setF("picture", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Trạng Thái
            </label>
            <select
              value={form.is_available ? "1" : "0"}
              onChange={(e) => setF("is_available", e.target.value === "1")}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
            >
              <option value="1">Có sẵn</option>
              <option value="0">Hết hàng</option>
            </select>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition"
            >
              <Save className="inline h-4 w-4 mr-2" />
              {saving ? "Đang tạo..." : "Tạo món ăn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
