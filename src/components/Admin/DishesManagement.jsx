import { Plus, Edit, Trash2, Package } from "lucide-react";

export default function AdminDishesManagement({
  dishes,
  setIsEditingDish,
  setEditingItem,
  deleteDish,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quản Lý Món Ăn
            </h3>
            <p className="text-sm text-neutral-600">
              Thêm/sửa/xoá món trong kho
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditingDish(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm Món
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-neutral-700">
            <div>Tên</div>
            <div>Giá</div>
            <div>Loại</div>
            <div>Calories</div>
            <div>Trạng Thái</div>
            <div>Hành động</div>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="px-6 py-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="font-medium text-neutral-900">{dish.name}</div>
                <div className="text-neutral-600">${dish.price}</div>
                <div className="text-neutral-600">{dish.category}</div>
                <div className="text-neutral-600">{dish.calories}</div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      dish.status === "available"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {dish.status === "available" ? "Đang bán" : "Tạm ẩn"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(dish);
                      setIsEditingDish(true);
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteDish(dish.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {dishes.length === 0 && (
            <div className="px-6 py-10 text-center text-neutral-600">
              Chưa có món nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

