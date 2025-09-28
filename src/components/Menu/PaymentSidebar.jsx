import { X, CreditCard, Smartphone, QrCode } from "lucide-react";

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
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const paymentMethods = [
    {
      id: "cash",
      name: "Tiền mặt",
      icon: CreditCard,
      description: "Thanh toán bằng tiền mặt",
    },
    {
      id: "card",
      name: "Thẻ",
      icon: CreditCard,
      description: "Thanh toán bằng thẻ",
    },
    {
      id: "qr",
      name: "QR Code",
      icon: QrCode,
      description: "Quét mã QR để thanh toán",
    },
    {
      id: "mobile",
      name: "Mobile Banking",
      icon: Smartphone,
      description: "Chuyển khoản qua mobile banking",
    },
  ];

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
                      {item.quantity} × ${item.price}
                      {item.notes && (
                        <span className="block text-xs text-neutral-500">
                          Ghi chú: {item.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-neutral-900">
                    ${(item.price * item.quantity).toFixed(2)}
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

          {/* Payment Methods */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Phương thức thanh toán
            </h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-orange-500 border-neutral-300 focus:ring-orange-500"
                    />
                    <Icon
                      className={`h-6 w-6 ${
                        paymentMethod === method.id
                          ? "text-orange-600"
                          : "text-neutral-600"
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          paymentMethod === method.id
                            ? "text-orange-900"
                            : "text-neutral-900"
                        }`}
                      >
                        {method.name}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {method.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Button */}
          <div className="border-t border-neutral-200 p-6">
            <button
              onClick={onPayment}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
            >
              Thanh toán ${totalAmount.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
