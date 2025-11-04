import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Utensils, X, Eye, Trash2, Search } from "lucide-react";
import {
  listDishPaging,
  createDish,
  updateDish,
  normalizeDish,
  getDish,
  deleteDish,
  searchDishByName,
} from "../../../lib/apiDish";
import { listTopping } from "../../../lib/apiTopping";
import {
  addDishToppingsBatch,
  deleteDishTopping,
} from "../../../lib/apiDishTopping";

/* ===================== Helpers ===================== */
const CATEGORIES = [
  "Pizza",
  "Mì ý",
  "Bò bít tết",
  "Salad",
  "Tráng miệng",
  "Đồ uống",
];
const TYPES = ["Tăng cân", "Giữ dáng", "Giảm cân"];

const fmtVND = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

/* ===================== Modal ===================== */
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="font-semibold text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== Form ===================== */
function DishForm({ initial, onSubmit, saving }) {
  const [form, setForm] = useState({
    dishName: initial?.name || "",
    category: initial?.category || CATEGORIES[0],
    type: initial?.type || TYPES[0],
    price: Number(initial?.price ?? 0),
    calo: Number(initial?.calo ?? 0),
    description: initial?.description || "",
    isAvailable: Boolean(initial?.isAvailable ?? true),
    imageFile: null,
    toppings: initial?.optionalToppings?.map((t) => t.toppingId) || [],
  });
  const [allToppings, setAllToppings] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listTopping();
        setAllToppings(res);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const toggleTopping = (id) =>
    setForm((prev) => ({
      ...prev,
      toppings: prev.toppings.includes(id)
        ? prev.toppings.filter((tid) => tid !== id)
        : [...prev.toppings, id],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tên món ăn"
          value={form.dishName}
          onChange={(e) => handleChange("dishName", e.target.value)}
          required
        />
        <Select
          label="Danh mục"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          options={CATEGORIES}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Loại (Type)"
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          options={TYPES}
        />
        <Input
          label="Calories (kcal)"
          type="number"
          value={form.calo}
          onChange={(e) => handleChange("calo", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Giá (VND)"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
        <div>
          <label className="text-sm text-gray-600">Trạng thái</label>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="avail"
                checked={form.isAvailable === true}
                onChange={() => handleChange("isAvailable", true)}
              />
              Được bán
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="avail"
                checked={form.isAvailable === false}
                onChange={() => handleChange("isAvailable", false)}
              />
              Không được bán
            </label>
          </div>
        </div>
      </div>

      <Textarea
        label="Mô tả món ăn"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <div>
        <label className="text-sm text-gray-600">Ảnh món ăn</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleChange("imageFile", e.target.files[0])}
          className="mt-2 block w-full text-sm"
        />
        {form.imageFile && (
          <img
            src={URL.createObjectURL(form.imageFile)}
            alt="preview"
            className="mt-2 w-32 h-32 object-cover rounded-xl border"
          />
        )}
      </div>

      <div>
        <label className="text-sm text-gray-600 mb-2 block">
          Chọn topping đi kèm
        </label>
        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
          {allToppings.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTopping(t.id)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                form.toppings.includes(t.id)
                  ? "bg-orange-100 border-orange-300 text-orange-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="text-right pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl"
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}

/* ===================== Trang chính ===================== */
export default function ManagerDishPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailDish, setDetailDish] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);
      if (searchTerm.trim()) {
        setIsSearching(true);
        const res = await searchDishByName(searchTerm.trim());
        setDishes(res);
        setTotalPages(1);
        setPage(0);
      } else {
        setIsSearching(false);
        const res = await listDishPaging(page, 8);
        setDishes(res.content);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error("❌ Lỗi tải danh sách món ăn:", err);
      alert("Không tải được danh sách món ăn");
      setDishes([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchDishes();
  };

  const handleCreate = async (form) => {
    try {
      setSaving(true);
      const created = await createDish(form);
      const dish = created?.result ?? created;
      const newId = dish?.dishId || dish?.id;

      const toppingIds = (form.toppings || []).map((t) =>
        typeof t === "object" ? t.toppingId || t.id : Number(t)
      );

      if (toppingIds.length > 0) {
        await addDishToppingsBatch(newId, toppingIds);
      }

      alert("✅ Thêm món ăn thành công!");
      setOpenCreate(false);
      handleRefresh();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi thêm món ăn!");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    try {
      setSaving(true);
      const updated = await updateDish(editingDish.id, form);
      const normalized = normalizeDish(updated?.result ?? updated);

      const oldToppings = editingDish.optionalToppings || [];
      if (Array.isArray(oldToppings) && oldToppings.length > 0) {
        await Promise.all(
          oldToppings.map((t) =>
            deleteDishTopping(editingDish.id, t.toppingId || t.id)
          )
        );
      }

      const toppingIds = (form.toppings || []).map((t) =>
        typeof t === "object" ? t.toppingId || t.id : Number(t)
      );
      if (toppingIds.length > 0) {
        await addDishToppingsBatch(editingDish.id, toppingIds);
      }

      handleRefresh();
      alert("✅ Cập nhật món ăn thành công!");
      setOpenEdit(false);
      setEditingDish(null);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật món ăn!");
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getDish(id);
      setDetailDish(res);
      setOpenDetail(true);
    } catch (err) {
      console.error(err);
      alert("❌ Không tải được chi tiết món ăn!");
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá món ăn này không?")) return;
    try {
      await deleteDish(id);
      handleRefresh();
      alert("✅ Đã xoá món ăn thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Không thể xoá món ăn!");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-white">Quản lý món ăn</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transform hover:scale-105 transition"
        >
          <Plus className="h-5 w-5" /> Thêm món ăn
        </button>
      </div>

      <div className="mb-5 relative">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên món ăn..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-white/30 bg-white/10 text-white placeholder-indigo-300 px-4 py-2 pl-10 outline-none focus:ring-2 focus:ring-orange-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {loading ? (
        <div className="text-indigo-200">
          {isSearching && searchTerm.trim()
            ? "Đang tìm kiếm..."
            : "Đang tải danh sách món ăn..."}
        </div>
      ) : dishes.length === 0 ? (
        <div className="text-indigo-200 italic">
          {isSearching && searchTerm.trim()
            ? `Không tìm thấy món ăn nào với từ khóa "${searchTerm}".`
            : "Chưa có món ăn nào."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dishes.map((d) => (
            <div
              key={d.id}
              className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-lg hover:shadow-xl transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Utensils className="text-orange-400" />
                  <div>
                    <p className="font-semibold text-white">{d.name}</p>
                    <p className="text-sm text-neutral-400">{d.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewDetail(d.id)}
                    className="text-neutral-400 hover:text-blue-400 p-1 rounded-lg hover:bg-blue-900/50"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingDish(d);
                      setOpenEdit(true);
                    }}
                    className="text-neutral-400 hover:text-orange-400 p-1 rounded-lg hover:bg-orange-900/50"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDish(d.id)}
                    className="text-neutral-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-900/50"
                    title="Xoá món ăn"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-neutral-300 text-sm line-clamp-2">
                {d.description}
              </p>
              <p className="mt-2 font-semibold text-orange-400">
                {fmtVND(d.price)}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isSearching && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded-lg border border-white/20 bg-white/10 text-neutral-300 hover:bg-white/20 disabled:opacity-50"
          >
            Trang trước
          </button>
          <span className="text-neutral-300">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg border border-white/20 bg-white/10 text-neutral-300 hover:bg-white/20 disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Modal tạo món */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Thêm món ăn mới"
      >
        <DishForm onSubmit={handleCreate} saving={saving} />
      </Modal>

      {/* Modal chỉnh sửa món */}
      <Modal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditingDish(null);
        }}
        title="Chỉnh sửa món ăn"
      >
        <DishForm initial={editingDish} onSubmit={handleEdit} saving={saving} />
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setDetailDish(null);
        }}
        title="Chi tiết món ăn"
      >
        {detailDish ? (
          <div className="space-y-3">
            <img
              src={detailDish.picture}
              alt={detailDish.name}
              className="w-full h-64 object-cover rounded-xl border"
            />
            <p>
              <strong>Tên món:</strong> {detailDish.name}
            </p>
            <p>
              <strong>Mô tả:</strong> {detailDish.description}
            </p>
            <p>
              <strong>Danh mục:</strong> {detailDish.category}
            </p>
            <p>
              <strong>Loại:</strong> {detailDish.type}
            </p>
            <p>
              <strong>Giá:</strong> {fmtVND(detailDish.price)}
            </p>
            <p>
              <strong>Calories:</strong> {detailDish.calo} kcal
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {detailDish.isAvailable ? "Được bán" : "Không được bán"}
            </p>
            <p>
              <strong>Số lượng còn lại:</strong> {detailDish.remainingQuantity}
            </p>
            <div>
              <strong>Toppings đi kèm:</strong>
              <ul className="list-disc pl-6">
                {detailDish.optionalToppings?.length > 0 ? (
                  detailDish.optionalToppings.map((t) => (
                    <li key={t.toppingId}>
                      {t.name} - {fmtVND(t.price)} ({t.calories} kcal)
                    </li>
                  ))
                ) : (
                  <li>Không có topping nào.</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div>Đang tải chi tiết...</div>
        )}
      </Modal>
    </div>
  );
}

/* Reusable inputs */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select
        {...props}
        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
