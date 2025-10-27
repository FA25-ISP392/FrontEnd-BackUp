// import { X, CreditCard, Bell } from "lucide-react";

// const vnd = (n = 0) =>
//   Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

// function readToppings(item) {
//   if (Array.isArray(item?.toppings) && item.toppings.length)
//     return item.toppings;

//   if (Array.isArray(item?.selectedToppings) && item.selectedToppings.length)
//     return item.selectedToppings.map((t) => ({
//       toppingId: Number(t.toppingId ?? t.id),
//       toppingName: t.toppingName ?? t.name ?? "",
//       quantity: Number(t.quantity ?? 1),
//       toppingPrice: Number(t.toppingPrice ?? t.price ?? 0),
//     }));

//   if (item?.selectedOptions && Object.keys(item.selectedOptions).length) {
//     return Object.values(item.selectedOptions).map((op) => ({
//       toppingId: Number(op.toppingId ?? op.id ?? 0),
//       toppingName: op.toppingName ?? op.name ?? "",
//       quantity: Number(op.quantity ?? 1),
//       toppingPrice: Number(op.toppingPrice ?? op.price ?? 0),
//     }));
//   }

//   return [];
// }

// export default function PaymentSidebar({
//   isOpen,
//   onClose,
//   cart,
//   items,
//   onRequestPayment,
// }) {
//   if (!isOpen) return null;
//   const cartItems = Array.isArray(items) && items.length ? items : cart;
//   const totalAmount = cartItems.reduce((sum, item) => {
//     const qty = Number(item.quantity ?? 1);
//     const unit = Number(item.totalPrice ?? item.price ?? 0);
//     return sum + unit * qty;
//   }, 0);

//   return (
//     <>
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//         onClick={onClose}
//       />
//       <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50">
//         <div className="flex flex-col h-full">
//           <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//                   <CreditCard className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold">Thanh toán</h2>
//                   <p className="text-orange-100 text-sm">Hoàn tất đơn hàng</p>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-white/20 rounded-lg transition"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6">
//             <h3 className="text-lg font-bold text-neutral-900 mb-4">
//               Chi tiết đơn hàng
//             </h3>

//             {cartItems.length === 0 ? (
//               <p className="text-neutral-500">Chưa có món nào trong đơn hàng</p>
//             ) : (
//               <div className="space-y-4">
//                 {cartItems.map((item, idx) => {
//                   const key = item.orderDetailId ?? item.id ?? idx;
//                   const name = item.name ?? item.dishName;
//                   const qty = Number(item.quantity ?? 1);
//                   const unit = Number(item.totalPrice ?? item.price ?? 0);
//                   const line = unit * qty;
//                   const note = item.note ?? item.notes ?? "";
//                   const toppings = readToppings(item);

//                   return (
//                     <div
//                       key={key}
//                       className="p-4 bg-neutral-50 rounded-xl shadow-sm"
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="font-semibold text-neutral-900">
//                           {name}
//                         </div>
//                         <div className="text-sm font-medium text-orange-600">
//                           {vnd(line)}
//                         </div>
//                       </div>

//                       <div className="text-sm text-neutral-600 mb-1">
//                         Số lượng: {qty}
//                       </div>

//                       {toppings.length > 0 && (
//                         <div className="text-xs text-neutral-500 mb-1">
//                           Topping:{" "}
//                           {toppings
//                             .map((t) => {
//                               const tn = t.toppingName || t.name || "";
//                               const tq = Number(t.quantity ?? 1);
//                               const tp = Number(t.toppingPrice ?? t.price ?? 0);
//                               const qtyTxt = tq > 1 ? `(${tq}×)` : "";
//                               const priceTxt = tp > 0 ? ` ${vnd(tp)}` : "";
//                               return `${tn} ${qtyTxt}${priceTxt}`.trim();
//                             })
//                             .join(", ")}
//                         </div>
//                       )}

//                       {note && (
//                         <div className="text-xs text-neutral-500 italic">
//                           Ghi chú: {note}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           <div className="mt-auto border-t border-neutral-200 p-6 space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-lg font-bold text-neutral-900">
//                 Tổng cộng:
//               </span>
//               <span className="text-2xl font-bold text-orange-600">
//                 {vnd(totalAmount)}
//               </span>
//             </div>

//             <button
//               onClick={onRequestPayment}
//               className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
//             >
//               <Bell className="h-5 w-5" />
//               <span>Gọi thanh toán</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { X, CreditCard, Bell } from "lucide-react";

const vnd = (n = 0) =>
  Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

function readToppings(item) {
  if (Array.isArray(item?.toppings) && item.toppings.length)
    return item.toppings;

  if (Array.isArray(item?.selectedToppings) && item.selectedToppings.length)
    return item.selectedToppings.map((t) => ({
      toppingId: Number(t.toppingId ?? t.id),
      toppingName: t.toppingName ?? t.name ?? "",
      quantity: Number(t.quantity ?? 1),
      toppingPrice: Number(t.toppingPrice ?? t.price ?? 0),
    }));

  if (item?.selectedOptions && Object.keys(item.selectedOptions).length) {
    return Object.values(item.selectedOptions).map((op) => ({
      toppingId: Number(op.toppingId ?? op.id ?? 0),
      toppingName: op.toppingName ?? op.name ?? "",
      quantity: Number(op.quantity ?? 1),
      toppingPrice: Number(op.toppingPrice ?? op.price ?? 0),
    }));
  }

  return [];
}

export default function PaymentSidebar({
  isOpen,
  onClose,
  cart,
  items,
  onRequestPayment,
}) {
  if (!isOpen) return null;
  const cartItems = Array.isArray(items) && items.length ? items : cart;
  const totalAmount = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity ?? 1);
    const unit = Number(item.totalPrice ?? item.price ?? 0);
    return sum + unit * qty;
  }, 0);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50">
        <div className="flex flex-col h-full">
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

          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Chi tiết đơn hàng
            </h3>

            {cartItems.length === 0 ? (
              <p className="text-neutral-500">Chưa có món nào trong đơn hàng</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => {
                  const key = item.orderDetailId ?? item.id ?? idx;
                  const name = item.name ?? item.dishName;
                  const qty = Number(item.quantity ?? 1);
                  const unit = Number(item.totalPrice ?? item.price ?? 0);
                  const line = unit * qty;
                  const note = item.note ?? item.notes ?? "";
                  const toppings = readToppings(item);

                  return (
                    <div
                      key={key}
                      className="p-4 bg-neutral-50 rounded-xl shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-neutral-900">
                          {name}
                        </div>
                        <div className="text-sm font-medium text-orange-600">
                          {vnd(line)}
                        </div>
                      </div>

                      <div className="text-sm text-neutral-600 mb-1">
                        Số lượng: {qty}
                      </div>

                      {toppings.length > 0 && (
                        <div className="text-xs text-neutral-500 mb-1">
                          Topping:{" "}
                          {toppings
                            .map((t) => {
                              const tn = t.toppingName || t.name || "";
                              const tq = Number(t.quantity ?? 1);
                              const tp = Number(t.toppingPrice ?? t.price ?? 0);
                              const qtyTxt = tq > 1 ? `(${tq}×)` : "";
                              const priceTxt = tp > 0 ? ` ${vnd(tp)}` : "";
                              return `${tn} ${qtyTxt}${priceTxt}`.trim();
                            })
                            .join(", ")}
                        </div>
                      )}

                      {note && (
                        <div className="text-xs text-neutral-500 italic">
                          Ghi chú: {note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-neutral-900">
                Tổng cộng:
              </span>
              <span className="text-2xl font-bold text-orange-600">
                {vnd(totalAmount)}
              </span>
            </div>

            <button
              onClick={onRequestPayment}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
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
