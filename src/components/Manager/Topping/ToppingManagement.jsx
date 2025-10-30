import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Salad,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

export default function ToppingManagement({
  toppings,
  setToppings,
  setIsEditingTopping,
  setEditingItem,
  loading,
  onSearch,
  page,
  pageInfo,
  onPageChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  // 🔍 Tìm kiếm topping theo tên
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      onSearch?.("");
      return;
    }
    setIsSearching(true);
    onSearch?.(searchTerm);
  };

  // ❌ Xoá tìm kiếm
  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    onSearch?.("");
  };

  // 🗑️ Xoá topping
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá topping này không?")) return;
    setToppings((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Salad className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Quản Lý Topping
            </h3>
            <p className="text-sm text-neutral-600">
              Quản lý các loại topping cho món ăn
            </p>
          </div>
        </div>

        {/* 🔍 Ô tìm kiếm + nút thêm */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm topping theo tên..."
                className="pl-9 pr-8 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-400 outline-none text-sm"
              />
              <Search
                onClick={handleSearch}
                className="absolute left-2.5 top-2.5 text-neutral-400 hover:text-emerald-500 cursor-pointer"
                size={16}
              />
              {searchTerm && (
                <X
                  onClick={clearSearch}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-red-500 cursor-pointer"
                  size={16}
                />
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
            >
              Tìm
            </button>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsEditingTopping(true);
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm Topping
          </button>
        </div>
      </div>

      {/* Danh sách topping */}
      <div className="bg-white/70 backdrop-blur rounded-2xl shadow border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-neutral-700">
            <div>Tên topping</div>
            <div>Giá</div>
            <div>Calories</div>
            <div>Gram</div>
            <div className="col-span-2">Hành động</div>
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-neutral-200">
          {loading ? (
            <div className="p-6 text-neutral-500">Đang tải danh sách...</div>
          ) : toppings.length === 0 ? (
            <div className="p-6 text-neutral-500">
              Không tìm thấy topping nào.
            </div>
          ) : (
            toppings.map((topping) => (
              <div
                key={topping.id}
                className="px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="font-medium text-neutral-900 truncate">
                    {topping.name}
                  </div>
                  <div className="text-green-600 font-semibold">
                    {formatPrice(topping.price)}
                  </div>
                  <div className="text-neutral-600">{topping.calories}</div>
                  <div className="text-neutral-600">{topping.gram}</div>

                  <div className="flex gap-2 items-center col-span-2">
                    <button
                      onClick={() => {
                        setEditingItem(topping);
                        setIsEditingTopping(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topping.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Phân trang */}
      {!loading && !isSearching && pageInfo?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-neutral-700 font-medium">
            Trang {page + 1} / {pageInfo.totalPages}
          </span>
          <button
            disabled={page + 1 >= pageInfo.totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
