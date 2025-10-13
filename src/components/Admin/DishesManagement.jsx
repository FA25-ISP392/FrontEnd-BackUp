import { useState } from "react";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import AdminDishForm from "./AdminDishForm";
import { listDish, deleteDish, normalizeDish } from "../../lib/apiDish";

export default function DishesManagement({
  dishes,
  setDishes,
  setIsEditingDish,
  setEditingItem,
  loading,
}) {
  // State mở/đóng modal TẠO MỚI
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  const handleDeleteDish = async (id) => {
    try {
      await deleteDish(id);
      setDishes((prev) => prev.filter((dish) => dish.id !== id));
      alert("Xóa món ăn thành công!");
    } catch (error) {
      alert("Lỗi khi xóa món ăn: " + (error.message || "Không xác định"));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
        Có sẵn
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
        Hết hàng
      </span>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Quản Lý Món Ăn
            </h3>
            <p className="text-sm text-neutral-600">
              Quản lý thực đơn nhà hàng
            </p>
          </div>
        </div>

        {/* Thêm Món Ăn -> mở modal tạo mới */}
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm Món Ăn
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-neutral-700">
            <div className="truncate">Tên Món</div>
            <div className="truncate">Giá</div>
            <div className="truncate">Danh Mục</div>
            <div className="truncate">Calories</div>
            <div className="truncate">Trạng Thái</div>
            <div className="truncate">Hành động</div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200">
          {loading ? (
            <div className="p-6 text-neutral-500">Đang tải danh sách...</div>
          ) : dishes.length === 0 ? (
            <div className="p-6 text-neutral-500">Chưa có món ăn nào.</div>
          ) : (
            dishes.map((dish) => (
              <div
                key={dish.id}
                className="px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div
                    className="font-medium text-neutral-900 truncate"
                    title={dish.name}
                  >
                    {dish.name}
                  </div>

                  <div
                    className="text-orange-600 font-semibold truncate"
                    title={formatPrice(dish.price)}
                  >
                    {formatPrice(dish.price)}
                  </div>

                  <div
                    className="text-neutral-600 truncate"
                    title={dish.category}
                  >
                    {dish.category}
                  </div>

                  <div
                    className="text-neutral-600 truncate"
                    title={dish.calories ? `${dish.calories} cal` : "-"}
                  >
                    {dish.calories ? `${dish.calories} cal` : "-"}
                  </div>

                  <div>{getStatusBadge(dish.is_available ? 1 : 0)}</div>

                  {/* Hành động: Edit + Delete */}
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setEditingItem(dish); // chọn item để edit
                        setIsEditingDish(true); // mở modal edit
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        console.log(dish);
                        if (confirmingId === dish.id) {
                          handleDeleteDish(dish.id); // gọi API xoá
                          setConfirmingId(null);
                        } else {
                          setConfirmingId(dish.id); // lần đầu bấm thì hiện confirm
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      {confirmingId === dish.id ? (
                        "Xác nhận?"
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                    {confirmingId === dish.id && (
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="ml-2 text-neutral-500 hover:text-neutral-700 text-sm"
                      >
                        Huỷ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal tạo mới (Add) */}
      {openCreate && (
        <AdminDishForm
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreated={(newDish) => {
            const normalized = normalizeDish(newDish);
            setDishes?.((prev) => [normalized, ...(prev || [])]);
          }}
        />
      )}
    </div>
  );
}
