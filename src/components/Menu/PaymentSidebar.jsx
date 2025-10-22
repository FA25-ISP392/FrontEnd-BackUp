import { X, CreditCard, Bell } from "lucide-react";

export default function PaymentSidebar({
  isOpen,
  onClose,
  cart,
  onPayment,
  paymentMethod,
  setPaymentMethod,
}) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.totalPrice || item.price) * item.quantity,
    0,
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Thanh toán</h2>
                  <p className="text-orange-100 text-sm">Hoàn tất đơn hàng</p>
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

          {/* Order Summary */}
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Tóm tắt đơn hàng
            </h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {item.quantity} × ${item.totalPrice || item.price}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <span className="block text-xs text-neutral-500">
                          {Object.values(item.selectedOptions).map((option, index) => (
                            <span key={index}>
                              {option.name}
                              {index < Object.values(item.selectedOptions).length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </span>
                      )}
                      {item.notes && (
                        <span className="block text-xs text-neutral-500">
                          Ghi chú: {item.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-neutral-900">
                    ${((item.totalPrice || item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 mt-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-neutral-900">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Chi tiết đơn hàng
            </h3>
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500">Chưa có món nào trong đơn hàng</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-neutral-600">
                          Số lượng: {item.quantity}
                        </div>
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="text-xs text-neutral-500 mt-1">
                            {Object.values(item.selectedOptions).map((option, index) => (
                              <span key={index}>
                                {option.name}
                                {index < Object.values(item.selectedOptions).length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.notes && (
                          <div className="text-xs text-neutral-500 mt-1">
                            Ghi chú: {item.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-neutral-900">
                          ${((item.totalPrice || item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Call Staff Button */}
          <div className="border-t border-neutral-200 p-6">
            <button
              onClick={onPayment}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
            >
              <Bell className="h-5 w-5" />
              <span>Gọi thanh toán</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
