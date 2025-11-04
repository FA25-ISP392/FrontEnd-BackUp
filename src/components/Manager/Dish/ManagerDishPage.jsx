import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Utensils,
  X,
  Eye,
  Trash2,
  Search,
  Save,
  ImageIcon,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
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

/* ===================== Modal (Giao diện "wow") ===================== */
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header Gradient đồng bộ với Manager */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Content cuộn được */}
        <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== Form (Giao diện "wow") ===================== */
function DishForm({ initial, onSubmit, saving, onClose }) {
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
  const [previewUrl, setPreviewUrl] = useState(initial?.picture || null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("imageFile", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Tên món ăn *"
          value={form.dishName}
          onChange={(e) => handleChange("dishName", e.target.value)}
          required
          placeholder="VD: Pizza Hải Sản"
        />
        <Select
          label="Danh mục *"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          options={CATEGORIES}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Loại (Phù hợp)"
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          options={TYPES}
        />
        <Input
          label="Calories (kcal)"
          type="number"
          value={form.calo}
          onChange={(e) => handleChange("calo", e.target.value)}
          placeholder="VD: 350"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Giá (VND) *"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          required
          placeholder="VD: 150000"
        />
        <div>
          <label className="text-sm font-medium text-neutral-700 mb-2 block">
            Trạng thái
          </label>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="avail"
                className="w-4 h-4 accent-orange-500"
                checked={form.isAvailable === true}
                onChange={() => handleChange("isAvailable", true)}
              />
              <span className="text-neutral-700">Được bán</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="avail"
                className="w-4 h-4 accent-neutral-500"
                checked={form.isAvailable === false}
                onChange={() => handleChange("isAvailable", false)}
              />
              <span className="text-neutral-700">Không được bán</span>
            </label>
          </div>
        </div>
      </div>

      <Textarea
        label="Mô tả món ăn"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Mô tả ngắn về món ăn..."
      />

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-2 block">
          Ảnh món ăn
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="file-upload"
            className="flex-1 cursor-pointer bg-white border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-orange-400 transition-all"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-neutral-400" />
            <span className="mt-2 block text-sm text-neutral-600">
              Kéo thả hoặc{" "}
              <span className="font-semibold text-orange-600">chọn ảnh</span>
            </span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Xem trước"
              className="w-32 h-32 object-cover rounded-xl border-2 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-neutral-100 rounded-xl flex items-center justify-center border border-neutral-200">
              <ImageIcon className="h-10 w-10 text-neutral-400" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-2 block">
          Chọn topping đi kèm (Optional)
        </label>
        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-3 bg-white/50 border border-neutral-200 rounded-xl">
          {allToppings.length > 0 ? (
            allToppings.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTopping(t.id)}
                className={`px-3 py-1.5 text-sm rounded-full border-2 transition-all ${
                  form.toppings.includes(t.id)
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-md"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-orange-400 hover:text-orange-600"
                }`}
              >
                {t.name}
              </button>
            ))
          ) : (
            <span className="text-sm text-neutral-500 italic">
              Chưa có topping nào được tạo.
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-neutral-200">
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
          className="flex-1 btn-submit-enhanced py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Save className="h-4 w-4 inline-block mr-2" />
          {saving ? "Đang lưu..." : "Lưu món ăn"}
        </button>
      </div>
    </form>
  );
}

// Helper mới cho Modal "Xem chi tiết"
function DetailRow({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-neutral-400 block">
        {label}
      </label>
      <p className="text-base text-white font-semibold">{children}</p>
    </div>
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

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 👈 === PHẦN THÊM MỚI 1: State cho modal xác nhận ===
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  // ==========================================================

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
      setErrorMessage("Không tải được danh sách món ăn");
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

      setSuccessMessage("Thêm món ăn thành công!");
      setOpenCreate(false);
      handleRefresh();
    } catch (err) {
      console.error(err);
      setErrorMessage("Lỗi khi thêm món ăn!");
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
      setSuccessMessage("Cập nhật món ăn thành công!");
      setOpenEdit(false);
      setEditingDish(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("Lỗi khi cập nhật món ăn!");
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
      setErrorMessage("Không tải được chi tiết món ăn!");
    }
  };

  // 👈 === PHẦN SỬA 2: Hàm mở modal xác nhận ===
  const handleDeleteDish = (dish) => {
    if (!dish || !dish.id) return;
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận xoá món ăn?",
      message: `Bạn có chắc muốn xoá vĩnh viễn món "${
        dish.name || "này"
      }"? Hành động này không thể hoàn tác.`,
      onConfirm: () => _executeDelete(dish.id),
    });
  };

  // 👈 === PHẦN SỬA 3: Hàm thực thi việc xoá ===
  const _executeDelete = async (id) => {
    setConfirmModal({ isOpen: false });
    try {
      await deleteDish(id);
      handleRefresh();
      setSuccessMessage("Đã xoá món ăn thành công!");
    } catch (err) {
      console.error(err);
      setErrorMessage("Không thể xoá món ăn!");
    }
  };
  // ==========================================================

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-white">Quản lý món ăn</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition shadow-lg"
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
                  {/* 👈 === PHẦN SỬA 4: Cập nhật onClick === */}
                  <button
                    onClick={() => handleDeleteDish(d)}
                    className="text-neutral-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-900/50"
                    title="Xoá món ăn"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {/* ======================================= */}
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
        <DishForm
          onSubmit={handleCreate}
          saving={saving}
          onClose={() => setOpenCreate(false)}
        />
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
        <DishForm
          initial={editingDish}
          onSubmit={handleEdit}
          saving={saving}
          onClose={() => {
            setOpenEdit(false);
            setEditingDish(null);
          }}
        />
      </Modal>

      {/* Modal xem chi tiết (ĐÃ "WOW" HƠN) */}
      <Modal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setDetailDish(null);
        }}
        title="Chi tiết món ăn"
      >
        {detailDish ? (
          <div className="space-y-4 text-neutral-700">
            {detailDish.picture ? (
              <img
                src={detailDish.picture}
                alt={detailDish.name}
                className="w-full h-64 object-cover rounded-xl border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-64 bg-neutral-100 rounded-xl flex items-center justify-center border border-neutral-200">
                <ImageIcon className="h-16 w-16 text-neutral-400" />
              </div>
            )}
            <DetailRow label="Tên món">{detailDish.name}</DetailRow>
            <DetailRow label="Mô tả">
              {detailDish.description || "Không có mô tả."}
            </DetailRow>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
              <DetailRow label="Danh mục">{detailDish.category}</DetailRow>
              <DetailRow label="Loại (Phù hợp)">{detailDish.type}</DetailRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Giá">{fmtVND(detailDish.price)}</DetailRow>
              <DetailRow label="Calories">{detailDish.calo} kcal</DetailRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Trạng thái">
                {detailDish.isAvailable ? (
                  <span className="text-green-600 font-medium">Được bán</span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Không được bán
                  </span>
                )}
              </DetailRow>
              <DetailRow label="Số lượng còn lại">
                {detailDish.remainingQuantity}
              </DetailRow>
            </div>
            <div className="pt-2 border-t border-neutral-200">
              <strong className="text-sm font-medium text-neutral-700 block mb-2">
                Toppings đi kèm:
              </strong>
              <div className="pl-4">
                {detailDish.optionalToppings?.length > 0 ? (
                  <ul className="list-disc list-outside space-y-1 text-neutral-600">
                    {detailDish.optionalToppings.map((t) => (
                      <li key={t.toppingId}>
                        {t.name} - {fmtVND(t.price)} ({t.calories} kcal)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-500 italic">
                    Không có topping nào.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-neutral-500 text-center py-8">
            Đang tải chi tiết...
          </div>
        )}
      </Modal>

      {/* 👈 === PHẦN SỬA 5: Thêm JSX của Modal Xác nhận Xoá === */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {confirmModal.title}
                </h3>
                <p className="text-neutral-300 mb-6">{confirmModal.message}</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmModal({ isOpen: false })}
                    className="px-4 py-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-all font-medium text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmModal.onConfirm}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all font-medium text-sm"
                  >
                    Xác nhận Xoá
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================== */}

      {/* Modal Thông báo (Thành công/Lỗi) */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-green-500/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Thành công!</h3>
              <p className="text-neutral-300 mb-6">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage("")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-500/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-neutral-300 mb-6">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Input Components (Đã "wow" hơn) ===================== */
const inputClass =
  "form-input-enhanced !bg-white/80 !border-neutral-300 !text-neutral-900 placeholder:!text-neutral-400 focus:!ring-orange-500";
const labelClass = "block text-sm font-medium text-neutral-700 mb-2";

function Input({ label, ...props }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input {...props} className={inputClass} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea {...props} rows={3} className={inputClass} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select {...props} className={`${inputClass} !py-[9px]`}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
