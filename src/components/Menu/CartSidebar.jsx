import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOrderFood,
}) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.totalPrice || item.price) * item.quantity,
    0
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Giỏ hàng</h2>
                  <p className="text-blue-100 text-sm">{cart.length} món</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-neutral-600">Hãy thêm món ăn vào giỏ hàng</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          ${item.totalPrice || item.price}
                        </p>
                        {item.selectedOptions &&
                          Object.keys(item.selectedOptions).length > 0 && (
                            <div className="text-xs text-neutral-500 mt-1">
                              {Object.values(item.selectedOptions).map(
                                (option, index) => (
                                  <span key={index}>
                                    {option.name}
                                    {index <
                                    Object.values(item.selectedOptions).length -
                                      1
                                      ? ", "
                                      : ""}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        {item.notes && (
                          <p className="text-xs text-neutral-500 mt-1">
                            Ghi chú: {item.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-white border border-neutral-300 rounded-lg flex items-center justify-center hover:bg-neutral-50 transition"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-white border border-neutral-300 rounded-lg flex items-center justify-center hover:bg-neutral-50 transition"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="font-bold text-blue-600">
                        $
                        {(
                          (item.totalPrice || item.price) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-neutral-900">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                onClick={onOrderFood}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium"
              >
                Gọi món
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
