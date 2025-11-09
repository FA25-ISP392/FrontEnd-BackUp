import { useState, useEffect } from "react";
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
  const [debounceTimer, setDebounceTimer] = useState(null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      const trimmed = searchTerm.trim();

      if (!trimmed) {
        setIsSearching(false);
        onSearch?.("");
      } else {
        setIsSearching(true);
        onSearch?.(trimmed);
      }
    }, 400);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    onSearch?.("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá thành phần món ăn này không?"))
      return;
    setToppings((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Salad className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Quản Lý Thành Phần Món Ăn
            </h3>
            <p className="text-sm text-indigo-200">
              Quản lý các loại thành phần món ăn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm thành phần món ăn theo tên..."
              className="pl-9 pr-8 py-2 rounded-xl border border-white/30 bg-white/10 text-white placeholder-indigo-300 focus:ring-2 focus:ring-emerald-400 outline-none text-sm w-64"
            />
            <Search
              className="absolute left-2.5 top-2.5 text-neutral-400 pointer-events-none"
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
            onClick={() => {
              setEditingItem(null);
              setIsEditingTopping(true);
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Thêm Thành Phần Món Ăn
          </button>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-black/30 px-6 py-4 border-b border-white/10">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-indigo-200">
            <div>Tên thành phần món</div>
            <div>Giá</div>
            <div>Calories</div>
            <div>Gram</div>
            <div className="col-span-2">Hành động</div>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {loading ? (
            <div className="p-6 text-indigo-200">
              {isSearching ? "Đang tìm kiếm..." : "Đang tải danh sách..."}
            </div>
          ) : toppings.length === 0 ? (
            <div className="p-6 text-indigo-200 italic">
              {isSearching && searchTerm.trim()
                ? `Không tìm thấy thành phần món ăn nào với từ khóa "${searchTerm}".`
                : "Chưa có thành phần món ăn nào."}
            </div>
          ) : (
            toppings.map((topping) => (
              <div
                key={topping.id}
                className="px-6 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="font-medium text-white truncate">
                    {topping.name}
                  </div>
                  <div className="text-green-400 font-semibold">
                    {formatPrice(topping.price)}
                  </div>
                  <div className="text-neutral-300">{topping.calories}</div>
                  <div className="text-neutral-300">{topping.gram}</div>

                  <div className="flex gap-2 items-center col-span-2">
                    <button
                      onClick={() => {
                        setEditingItem(topping);
                        setIsEditingTopping(true);
                      }}
                      className="p-2 text-blue-400 hover:bg-blue-900/50 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topping.id)}
                      className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition"
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

      {!loading && !isSearching && pageInfo?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-neutral-300 hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Trang {page + 1} / {pageInfo.totalPages}
          </span>
          <button
            disabled={page + 1 >= pageInfo.totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-neutral-300 hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
