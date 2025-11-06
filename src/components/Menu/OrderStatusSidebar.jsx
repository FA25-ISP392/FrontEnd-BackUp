import { X, Trash2, Edit, ListChecks } from "lucide-react";
const STATUS_LABEL = {
  pending: "Chờ nấu",
  preparing: "Đang nấu",
  served: "Đã phục vụ",
  cancelled: "Đã hủy",
  done: "Đã nấu xong",
};

const STATUS_STYLE = {
  pending: "border-yellow-500 bg-yellow-50 text-yellow-700 border-l-4",
  preparing:
    "border-blue-500 bg-blue-50 text-blue-700 border-l-4 animate-pulse",
  served: "border-green-500 bg-green-50 text-green-700 border-l-4",
  cancelled: "border-red-500 bg-red-50 text-red-700 border-l-4",
  done: "border-emerald-500 bg-emerald-50 text-emerald-700 border-l-4",
};
const fmtVND = (n) =>
  typeof n === "number" && isFinite(n) ? n.toLocaleString("vi-VN") + "₫" : "-";

function makeGroupKey(it) {
  const note = (it.note || "").trim();
  const tops = Array.isArray(it.toppings)
    ? it.toppings
        .map((t) => `${Number(t.toppingId)}x${Number(t.quantity || 1)}`)
        .sort()
        .join("|")
    : "";
  return `${Number(it.dishId)}|${note}|${tops}`;
}

export default function OrderStatusSidebar({
  isOpen,
  onClose,
  items = [],
  onEdit,
  onIncGroup,
  onDecGroup,
}) {
  if (!isOpen) return null;

  const map = new Map();
  (Array.isArray(items) ? items : []).forEach((it) => {
    const key = makeGroupKey(it);
    if (!map.has(key)) {
      map.set(key, { sample: it, ids: [it.orderDetailId], count: 1 });
    } else {
      const g = map.get(key);
      g.ids.push(it.orderDetailId);
      g.count += 1;
    }
  });

  const groups = [...map.values()].reverse();

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
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <ListChecks className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Trạng thái đơn hàng</h2>
                <p className="text-blue-100 text-sm">Theo dõi món đã gọi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
              aria-label="Đóng"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-neutral-50">
            {groups.length === 0 ? (
              <div className="text-sm text-neutral-500 border rounded-xl p-6 text-center">
                Chưa có món nào được gọi.
              </div>
            ) : (
              groups.map((g) => {
                const it = g.sample;
                const st = String(it.status || "").toLowerCase();
                const badge =
                  STATUS_STYLE[st] ||
                  "border-neutral-300 bg-neutral-100 text-neutral-700 border-l-4";
                const isEditable = st === "pending";
                const canChangeQty = st === "pending";

                return (
                  <div
                    key={`${it.orderDetailId}-group`}
                    className={`relative bg-white rounded-xl p-4 shadow-lg ${badge}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-lg">
                          {it.dishName}
                        </h4>
                        <span
                          className={`inline-block text-sm font-bold ${badge
                            .replace(/bg-[\w-]+/, "")
                            .replace(/border-[\w-]+/, "")}`}
                        >
                          {STATUS_LABEL[st] || st || "unknown"}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        {fmtVND(it.totalPrice * g.count)}
                      </div>
                    </div>

                    {Array.isArray(it.toppings) && it.toppings.length > 0 && (
                      <div className="text-sm text-neutral-600 mt-2">
                        <span className="font-medium">Topping: </span>
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
                      <div className="text-sm text-orange-700 italic mt-1">
                        Ghi chú: {it.note}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={!isEditable}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => isEditable && onEdit && onEdit(it)}
                          title={
                            isEditable
                              ? "Sửa topping/ghi chú"
                              : "Không thể sửa khi không ở trạng thái 'Chờ nấu'"
                          }
                        >
                          <Edit className="w-4 h-4" /> Sửa
                        </button>
                        <button
                          disabled={!canChangeQty}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => onDecGroup && onDecGroup(g)}
                          title={
                            canChangeQty
                              ? "Xoá 1 món (hoặc yêu cầu huỷ)"
                              : "Không thể xoá"
                          }
                        >
                          <Trash2 className="w-4 h-4" /> Xoá 1
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={!isEditable || g.count <= 1}
                          className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center hover:bg-neutral-200 disabled:opacity-50"
                          onClick={() => onDecGroup && onDecGroup(g)}
                          title={isEditable ? "Giảm 1" : "Không thể chỉnh"}
                        >
                          –
                        </button>
                        <span className="min-w-6 text-center text-lg font-bold text-neutral-900">
                          {g.count}
                        </span>
                        <button
                          disabled={!isEditable}
                          className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center hover:bg-neutral-200 disabled:opacity-50"
                          onClick={() => onIncGroup && onIncGroup(g)}
                          title={isEditable ? "Tăng 1" : "Không thể chỉnh"}
                        >
                          +
                        </button>
                      </div>
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
