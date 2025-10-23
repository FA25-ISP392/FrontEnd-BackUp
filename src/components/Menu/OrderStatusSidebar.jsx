import { X, Trash2 } from "lucide-react";

const STATUS_LABEL = {
  pending: "Chờ nấu",
  preparing: "Đang nấu",
  served: "Đã phục vụ",
  cancelled: "Đã hủy",
};
const STATUS_COLOR = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  preparing: "bg-blue-100 text-blue-700 border-blue-200",
  served: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const fmtVND = (n) =>
  typeof n === "number" && isFinite(n) ? n.toLocaleString("vi-VN") + "₫" : "-";

export default function OrderStatusSidebar({
  isOpen,
  onClose,
  items = [],
  onEdit,
  onDelete,
}) {
  if (!isOpen) return null;

  const list = Array.isArray(items) ? [...items].reverse() : [];

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

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {list.length === 0 ? (
              <div className="text-sm text-neutral-500 border rounded-xl p-4">
                Chưa có món nào được gọi.
              </div>
            ) : (
              list.map((it) => {
                const st = String(it.status || "").toLowerCase();
                const badge =
                  STATUS_COLOR[st] ||
                  "bg-neutral-100 text-neutral-700 border-neutral-200";
                return (
                  <div
                    key={it.orderDetailId}
                    className="relative border rounded-xl p-3 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => onEdit && onEdit(it)}
                    role="button"
                  >
                    {/* nút thùng rác góc phải */}
                    <button
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(it);
                      }}
                      aria-label="Xoá món"
                      title="Xoá món khỏi order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-start justify-between pr-8">
                      <div className="font-semibold text-neutral-900">
                        {it.dishName}
                      </div>
                      <div className="text-sm font-bold text-emerald-600">
                        {fmtVND(it.totalPrice)}
                      </div>
                    </div>

                    {Array.isArray(it.toppings) && it.toppings.length > 0 && (
                      <div className="text-xs text-neutral-500 mt-1">
                        Topping:{" "}
                        {it.toppings
                          .map((t) =>
                            t.quantity > 1
                              ? `${t.toppingName} x${t.quantity}`
                              : t.toppingName
                          )
                          .join(", ")}
                      </div>
                    )}

                    {it.note && (
                      <div className="text-xs text-neutral-500 mt-1">
                        Ghi chú: {it.note}
                      </div>
                    )}

                    <div className="mt-2">
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-lg border ${badge}`}
                      >
                        {STATUS_LABEL[st] || st || "unknown"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
