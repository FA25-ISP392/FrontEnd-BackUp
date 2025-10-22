import { useState, useEffect } from "react";
import { X, Plus, Minus, ImageOff } from "lucide-react";

export default function DishOptionsModal({
  isOpen,
  onClose,
  dish,
  onAddToCart,
}) {
  // 🧩 State
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [imageError, setImageError] = useState(false);

  // Reset khi mở món mới
  useEffect(() => {
    if (dish) {
      setSelectedToppings([]);
      setQuantity(1);
      setNotes("");
      setImageError(false);
    }
  }, [dish]);

  if (!isOpen || !dish) return null;

  // 🧩 Dữ liệu món
  const imageUrl = dish.picture;
  const basePrice = dish.price ?? 0;
  const baseCalo = dish.calo ?? dish.calories ?? 0;
  const toppings = dish.optionalToppings ?? [];

  // 🧮 Tính tổng giá & calo theo topping + số lượng
  const toppingsTotalPrice = selectedToppings.reduce(
    (sum, t) => sum + (t.price || 0),
    0
  );
  const toppingsTotalCalo = selectedToppings.reduce(
    (sum, t) => sum + (t.calories || t.calo || 0),
    0
  );

  const totalPrice = (basePrice + toppingsTotalPrice) * quantity;
  const totalCalories = (baseCalo + toppingsTotalCalo) * quantity;

  // 🟢 Xử lý thêm vào giỏ
  const handleAddToCart = () => {
    const dishWithOptions = {
      ...dish,
      selectedToppings,
      quantity,
      notes,
      totalPrice,
      totalCalories,
    };
    onAddToCart(dishWithOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{dish.dishName || dish.name}</h2>
            <p className="text-orange-100">Tùy chỉnh món ăn của bạn</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Thông tin món */}
          <div className="mb-6">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={dish.name}
                onError={() => setImageError(true)}
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full h-56 flex items-center justify-center bg-neutral-100 rounded-xl mb-4">
                <ImageOff className="w-10 h-10 text-neutral-400" />
              </div>
            )}

            <h3 className="text-lg font-semibold mb-1 text-gray-800">
              {dish.category} • {dish.type}
            </h3>
            <p className="text-gray-600 mb-3">{dish.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-orange-600">
                {dish.price?.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-sm text-neutral-500">
                {dish.calo ?? dish.calories} cal
              </span>
            </div>
          </div>

          {/* 🧀 Topping thêm */}
          {toppings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                Topping thêm
              </h3>
              <div className="space-y-2">
                {toppings.map((t) => {
                  const checked = selectedToppings.some(
                    (x) => x.toppingId === t.toppingId
                  );
                  return (
                    <label
                      key={t.toppingId}
                      className={`flex justify-between items-center p-3 border rounded-xl cursor-pointer transition ${
                        checked
                          ? "border-orange-400 bg-orange-50"
                          : "border-neutral-200"
                      }`}
                      onClick={() => {
                        setSelectedToppings((prev) => {
                          if (!Array.isArray(prev)) prev = [];
                          const exists = prev.some(
                            (x) => x.toppingId === t.toppingId
                          );
                          return exists
                            ? prev.filter((x) => x.toppingId !== t.toppingId)
                            : [...prev, t];
                        });
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="w-5 h-5 accent-orange-500"
                        />
                        <span className="font-medium">{t.name}</span>
                      </div>
                      <div className="text-sm text-neutral-600">
                        +{t.price?.toLocaleString("vi-VN")}₫ •{" "}
                        {t.calories ?? t.calo ?? 0} cal
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Số lượng */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">
              Số lượng
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-bold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">
              Ghi chú đặc biệt
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Không cay, ít muối..."
              className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          {/* Tổng cộng */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-neutral-900">
                  Tổng cộng
                </div>
                <div className="text-sm text-neutral-600">
                  {quantity} x {dish.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {totalPrice.toLocaleString("vi-VN")}₫
                </div>
                <div className="text-sm text-neutral-600">
                  {totalCalories} cal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
