import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  cartItemCount,
  onUpdateQuantity,
  onRemoveItem,
  onOrderFood,
}) {
  if (!isOpen) return null;

  const formatVND = (n) =>
    Number(n || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const asNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const toppingTotal = (item) =>
    (Array.isArray(item.selectedToppings) ? item.selectedToppings : []).reduce(
      (sum, t) =>
        sum +
        Number(t.toppingPrice ?? t.price ?? 0) *
          Math.max(1, Number(t.quantity ?? 1)),
      0
    );

  const unitPrice = (item) => {
    const hasTotal = item.totalPrice !== undefined && item.totalPrice !== null;
    const total = asNumber(item.totalPrice);
    if (hasTotal && total > 0) return total;
    return asNumber(item.price) + toppingTotal(item);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + unitPrice(item) * Number(item.quantity || 0),
    0
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Giỏ hàng</h2>
                  <p className="text-orange-100 text-sm">{cartItemCount} món</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <ShoppingCart className="w-24 h-24 opacity-30 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-800">
                  Giỏ hàng trống
                </h3>
                <p>Hãy chọn những món ăn tuyệt vời nhé!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const up = unitPrice(item);
                  const lineTotal = up * Number(item.quantity || 0);
                  const toppings = Array.isArray(item.selectedToppings)
                    ? item.selectedToppings
                    : [];

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-lg border border-neutral-200/80 p-4 flex gap-4"
                    >
                      <img
                        src={
                          item.picture ||
                          "https://via.placeholder.com/100x100?text=MonAn"
                        }
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-neutral-900 mb-1">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                              aria-label="Xoá"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {toppings.length > 0 && (
                            <p className="text-xs text-neutral-500 mt-1">
                              + {toppings.map((t) => t.name).join(", ")}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-xs text-orange-600 mt-1 italic">
                              Ghi chú: {item.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 bg-neutral-100 border border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-200 transition"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-lg text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 bg-neutral-100 border border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-200 transition"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="font-bold text-lg text-orange-600">
                            {formatVND(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-neutral-200 p-6 bg-white shadow-inner-top">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-lg font-bold text-neutral-900">
                  Tổng cộng:
                </span>
                <span className="text-3xl font-bold text-orange-600">
                  {formatVND(totalAmount)}
                </span>
              </div>
              <button
                onClick={onOrderFood}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
              >
                Gọi Món ({cartItemCount})
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
