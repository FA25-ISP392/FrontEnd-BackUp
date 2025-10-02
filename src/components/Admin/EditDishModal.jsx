import { X, Save } from "lucide-react";

export default function AdminEditDishModal({
  isEditingDish,
  setIsEditingDish,
  editingItem,
  setEditingItem,
  saveDish,
}) {
  if (!isEditingDish) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dishData = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      calories: parseInt(formData.get("calories"), 10),
      status: formData.get("status"),
    };

    if (editingItem) {
      saveDish({ ...editingItem, ...dishData });
    } else {
      saveDish({ id: Date.now(), ...dishData });
    }

    setIsEditingDish(false);
    setEditingItem(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingItem ? "Chỉnh Sửa Món" : "Thêm Món Mới"}
            </h2>
            <button
              onClick={() => {
                setIsEditingDish(false);
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
              Tên món
            </label>
            <input
              type="text"
              name="name"
              defaultValue={editingItem?.name || ""}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Giá ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                defaultValue={editingItem?.price ?? ""}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Calories
              </label>
              <input
                type="number"
                min="0"
                name="calories"
                defaultValue={editingItem?.calories ?? ""}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Loại
              </label>
              <select
                name="category"
                defaultValue={editingItem?.category || "Pizza"}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="Pizza">Pizza</option>
                <option value="Pasta">Pasta</option>
                <option value="Main Course">Main Course</option>
                <option value="Salad">Salad</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Trạng Thái
              </label>
              <select
                name="status"
                defaultValue={editingItem?.status || "available"}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="available">Đang bán</option>
                <option value="unavailable">Tạm ẩn</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditingDish(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

