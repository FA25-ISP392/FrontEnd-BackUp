import { useState, useEffect } from "react";
import { X, Plus, Minus, ImageOff, ShoppingBag } from "lucide-react";

export default function DishOptionsModal({
  isOpen,
  onClose,
  dish,
  onAddToCart,
}) {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (dish) {
      setSelectedToppings([]);
      setQuantity(1);
      setNotes("");
      setImageError(false);
    }
  }, [dish]);

  if (!isOpen || !dish) return null;

  const imageUrl = dish.picture;
  const basePrice = dish.price ?? 0;
  const baseCalo = dish.calo ?? dish.calories ?? 0;
  const toppings = [...(dish.optionalToppings ?? [])].sort(
    (a, b) => (a.remainingQuantity <= 0) - (b.remainingQuantity <= 0)
  );

  const toppingsTotalPrice = selectedToppings.reduce(
    (sum, t) => sum + (t.price || 0),
    0
  );
  const toppingsTotalCalo = selectedToppings.reduce(
    (sum, t) => sum + (t.calories || t.calo || 0),
    0
  );

  const finalUnitPrice = basePrice + toppingsTotalPrice;
  const finalUnitCalo = baseCalo + toppingsTotalCalo;
  const totalPrice = finalUnitPrice * quantity;
  const totalCalories = finalUnitCalo * quantity;

  //===== Hàm xử lý việc chọn món vào giỏ hàng =====
  const handleAddToCart = () => {
    const dishWithOptions = {
      ...dish,
      selectedToppings,
      quantity,
      notes,
      totalPrice: finalUnitPrice,
      totalCalories: finalUnitCalo,
    };
    //===== Đưa các món được chọn vào giỏ hàng =====
    onAddToCart(dishWithOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{dish.dishName || dish.name}</h2>
            <p className="text-orange-100">{dish.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-white/20 rounded-full transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-r border-neutral-200">
              <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-4">
                {imageUrl && !imageError ? (
                  <img
                    src={imageUrl}
                    alt={dish.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                    <ImageOff className="w-16 h-16 text-neutral-300" />
                  </div>
                )}
              </div>
              <p className="text-neutral-600 mb-4">{dish.description}</p>
              <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <span className="font-medium text-neutral-700">Giá gốc</span>
                <span className="text-lg font-bold text-orange-600">
                  {dish.price?.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg border border-neutral-200 mt-2">
                <span className="font-medium text-neutral-700">Calories</span>
                <span className="text-lg font-bold text-orange-600">
                  {dish.calo ?? dish.calories} cal
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {toppings.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">
                    Thành phần món
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {toppings.map((t) => {
                      const checked = selectedToppings.some(
                        (x) => x.toppingId === t.toppingId
                      );
                      const isOutOfStock = t.remainingQuantity <= 0;

                      return (
                        <label
                          key={t.toppingId}
                          className={`flex justify-between items-center p-3 border-2 rounded-xl transition ${
                            isOutOfStock
                              ? "opacity-50 cursor-not-allowed bg-neutral-100 border-neutral-200"
                              : checked
                              ? "border-orange-500 bg-orange-50 cursor-pointer shadow-md"
                              : "border-neutral-200 cursor-pointer hover:bg-neutral-50 hover:border-orange-300"
                          }`}
                          onClick={() => {
                            if (isOutOfStock) return;
                            setSelectedToppings((prev) => {
                              if (!Array.isArray(prev)) prev = [];
                              const exists = prev.some(
                                (x) => x.toppingId === t.toppingId
                              );
                              return exists
                                ? prev.filter(
                                    (x) => x.toppingId !== t.toppingId
                                  )
                                : [...prev, t];
                            });
                          }}
                          title={
                            isOutOfStock
                              ? "Topping tạm hết hàng"
                              : "Chọn topping"
                          }
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              disabled={isOutOfStock}
                              className="w-5 h-5 accent-orange-500"
                            />
                            <span className="font-medium text-neutral-800">
                              {t.name}{" "}
                              {isOutOfStock && (
                                <span className="text-sm text-red-500 font-medium">
                                  (Tạm hết)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="text-sm text-neutral-600 font-medium">
                            +{t.price?.toLocaleString("vi-VN")}₫
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
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

              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  Số lượng
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-100 transition"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-3xl font-bold min-w-[3rem] text-center text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-100 transition"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-neutral-200 bg-white/80 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-neutral-600">Tổng cộng</span>
              <span className="text-3xl font-bold text-orange-600">
                {totalPrice.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-sm text-neutral-500">
                ~{totalCalories} cal
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-5 w-5" />
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
