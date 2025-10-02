import { Eye, EyeOff, Package, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";

// Persist hidden dishes and stock in localStorage to sync with /menu
const HIDDEN_KEY = "hidden_dishes";
const STOCK_KEY = "dish_stock";

const loadHidden = () => {
  try {
    return JSON.parse(localStorage.getItem(HIDDEN_KEY)) || [];
  } catch (_) {
    return [];
  }
};

const saveHidden = (arr) =>
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(arr));

const loadStock = () => {
  try {
    return JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
  } catch (_) {
    return {};
  }
};

const saveStock = (obj) => localStorage.setItem(STOCK_KEY, JSON.stringify(obj));

export default function DishesStockVisibility({ dishes }) {
  const [hidden, setHidden] = useState(loadHidden());
  const [stock, setStock] = useState(loadStock());

  useEffect(() => {
    saveHidden(hidden);
  }, [hidden]);

  useEffect(() => {
    saveStock(stock);
  }, [stock]);

  const toggleVisibility = (dishName) => {
    setHidden((prev) =>
      prev.includes(dishName)
        ? prev.filter((n) => n !== dishName)
        : [...prev, dishName],
    );
  };

  const updateStock = (dishName, delta) => {
    setStock((prev) => {
      const next = { ...prev };
      const current = Number.isFinite(prev[dishName]) ? prev[dishName] : 0;
      next[dishName] = Math.max(0, current + delta);
      return next;
    });
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
              Kho & Hiển thị món
            </h3>
            <p className="text-sm text-neutral-600">
              Xem số lượng, ẩn/hiện món trên menu
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-neutral-700">
            <div>Tên</div>
            <div>Loại</div>
            <div>Giá</div>
            <div>Số lượng</div>
            <div>Trạng thái</div>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {dishes.map((dish) => {
            const isHidden = hidden.includes(dish.name);
            const count = Number.isFinite(stock[dish.name])
              ? stock[dish.name]
              : 0;
            return (
              <div
                key={dish.id}
                className="px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="font-medium text-neutral-900">
                    {dish.name}
                  </div>
                  <div className="text-neutral-600">{dish.category}</div>
                  <div className="text-neutral-600">${dish.price}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStock(dish.name, -1)}
                      className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2rem] text-center font-semibold">
                      {count}
                    </span>
                    <button
                      onClick={() => updateStock(dish.name, 1)}
                      className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(dish.name)}
                      className={`p-2 rounded-lg border transition ${
                        isHidden
                          ? "text-red-600 border-red-200 hover:bg-red-50"
                          : "text-green-600 border-green-200 hover:bg-green-50"
                      }`}
                    >
                      {isHidden ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <span className="text-sm font-medium">
                      {isHidden ? "Đang ẩn trên menu" : "Đang hiển thị"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

