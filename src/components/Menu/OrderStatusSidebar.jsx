import { X } from "lucide-react";
import { STATUS_LABEL, STATUS_COLOR } from "../../lib/apiOrderDetail";

const ORDER_FLOW = ["pending", "preparing", "served", "cancelled"];

export default function OrderStatusSidebar({ isOpen, onClose, groups = {} }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        role="button"
        aria-label="Đóng trạng thái đơn"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Trạng thái đơn hàng</h2>
              <p className="text-emerald-100 text-sm">Theo dõi món đã gọi</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              aria-label="Đóng"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {ORDER_FLOW.map((st) => {
              const items = Array.isArray(groups[st]) ? groups[st] : [];
              const badgeClass =
                STATUS_COLOR[st] ||
                "bg-neutral-100 text-neutral-700 border-neutral-200";

              return (
                <div key={st} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-neutral-800">
                      {STATUS_LABEL[st] || st}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-lg border ${badgeClass}`}
                    >
                      {items.length} món
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <div className="text-sm text-neutral-500 border rounded-xl p-3">
                      Chưa có món
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((it) => {
                        const itemStatus = String(
                          it.status || ""
                        ).toLowerCase();
                        const itemBadgeClass =
                          STATUS_COLOR[itemStatus] ||
                          "bg-neutral-100 text-neutral-700 border-neutral-200";
                        const price =
                          typeof it.totalPrice === "number" &&
                          isFinite(it.totalPrice)
                            ? it.totalPrice.toLocaleString("vi-VN") + "₫"
                            : "-";

                        return (
                          <div
                            key={it.orderDetailId}
                            className="border rounded-xl p-3 flex items-start justify-between hover:bg-neutral-50"
                          >
                            <div className="pr-3">
                              <div className="font-semibold text-neutral-900">
                                {it.dishName}
                              </div>
                              {it.note && (
                                <div className="text-xs text-neutral-500 mt-1">
                                  Ghi chú: {it.note}
                                </div>
                              )}
                              {Array.isArray(it.toppings) &&
                                it.toppings.length > 0 && (
                                  <div className="text-xs text-neutral-500 mt-1">
                                    Topping:{" "}
                                    {it.toppings
                                      .map((t) => t.toppingName)
                                      .join(", ")}
                                  </div>
                                )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-emerald-600">
                                {price}
                              </div>
                              <div
                                className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-lg border ${itemBadgeClass}`}
                              >
                                {STATUS_LABEL[itemStatus] ||
                                  itemStatus ||
                                  "unknown"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
