import { X, CreditCard, CheckCircle, ShoppingBag } from "lucide-react";
import { useMemo } from "react";

const fmtVND = (n = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const sumTotal = (items = []) =>
  items
    .filter((it) => String(it.status).toUpperCase() === "SERVED")
    .reduce(
      (s, it) =>
        s + Number(it.totalPrice ?? it.price ?? 0) * (it.quantity ?? 1),
      0
    );

export default function PaymentSidebar({
  isOpen,
  onClose,
  items = [],
  onRequestPayment,
}) {
  if (!isOpen) return null;

  const servedItems = useMemo(
    () => items.filter((it) => String(it.status).toUpperCase() === "SERVED"),
    [items]
  );

  const totalAmount = useMemo(() => sumTotal(servedItems), [servedItems]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Xác nhận thanh toán</h2>
                  <p className="text-green-100 text-sm">
                    {servedItems.length} món đã phục vụ
                  </p>
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
            {servedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <ShoppingBag className="w-24 h-24 opacity-30 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-800">
                  Chưa có món nào
                </h3>
                <p>Bạn cần gọi món và được phục vụ trước khi thanh toán.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-neutral-800 mb-2">
                  Các món đã phục vụ:
                </h3>
                {servedItems.map((item) => (
                  <div
                    key={item.orderDetailId}
                    className="bg-white rounded-lg p-3 border border-neutral-200 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-neutral-900">
                        {item.dishName}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {fmtVND(item.totalPrice)} x {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold text-neutral-800">
                      {fmtVND(item.totalPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {servedItems.length > 0 && (
            <div className="border-t border-neutral-200 p-6 bg-white shadow-inner-top">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-lg font-bold text-neutral-900">
                  Tổng cộng:
                </span>
                <span className="text-3xl font-bold text-green-600">
                  {fmtVND(totalAmount)}
                </span>
              </div>
              <button
                onClick={onRequestPayment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5"
              >
                <CheckCircle className="h-5 w-5 inline-block mr-2" />
                Gọi nhân viên thanh toán
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
