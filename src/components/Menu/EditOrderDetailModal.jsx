import { useEffect, useState } from "react";
import { X, Minus, Plus, Save, PackagePlus, Edit2 } from "lucide-react";
import { updateOrderDetail } from "../../lib/apiOrderDetail";
import { getDish } from "../../lib/apiDish";

export default function EditOrderDetailModal({
  isOpen,
  onClose,
  detail,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [allToppings, setAllToppings] = useState([]);
  const [picked, setPicked] = useState(new Map());

  useEffect(() => {
    if (!isOpen || !detail) return;

    setNote(detail.note ?? "");
    setStatus(String(detail.status || "PENDING").toUpperCase());

    const m = new Map();
    (detail.toppings || []).forEach((t) =>
      m.set(Number(t.toppingId ?? t.id), Number(t.quantity ?? 1))
    );
    setPicked(m);

    (async () => {
      try {
        const dish = await getDish(detail.dishId);
        const opts = Array.isArray(dish.optionalToppings)
          ? dish.optionalToppings
          : [];

        const mapped = opts.map((o) => ({
          toppingId: Number(o.toppingId ?? o.id),
          toppingName: o.toppingName ?? o.name ?? "",
          price: Number(o.price ?? o.toppingPrice ?? 0),
          calories: Number(o.calories ?? o.calo ?? 0),
          isAvailable: (o.remainingQuantity ?? 1) > 0,
        }));

        setAllToppings(mapped);
      } catch (e) {
        console.warn("Không lấy được optionalToppings:", e?.message || e);
        setAllToppings([]);
      }
    })();
  }, [isOpen, detail]);

  if (!isOpen || !detail) return null;

  const toggleTop = (t) => {
    if (!t.isAvailable) return;
    const m = new Map(picked);
    const id = Number(t.toppingId ?? t.id);
    if (m.has(id)) m.delete(id);
    else m.set(id, 1);
    setPicked(m);
  };

  const changeQty = (tId, delta) => {
    const m = new Map(picked);
    const cur = m.get(tId) ?? 0;
    const next = Math.max(1, cur + delta);
    m.set(tId, next);
    setPicked(m);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const toppings = [...picked.entries()].map(([toppingId, quantity]) => ({
        toppingId,
        quantity,
      }));
      const updated = await updateOrderDetail({
        orderDetailId: detail.orderDetailId,
        note,
        status,
        toppings,
      });
      onUpdated && onUpdated(updated);
      onClose && onClose();
    } catch (e) {
      alert(e?.message || "Cập nhật món thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{detail.dishName}</h3>
              <p className="text-sm text-blue-100">
                Chỉnh sửa Topping & Ghi chú
              </p>
            </div>
          </div>
          <button
            className="p-2 rounded-full hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[calc(90vh-160px)] overflow-y-auto">
          {allToppings.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-blue-600" />
                Chọn Toppings
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allToppings.map((t) => {
                  const id = Number(t.toppingId ?? t.id);
                  const selected = picked.has(id);
                  const qty = picked.get(id) ?? 1;

                  return (
                    <div
                      key={id}
                      onClick={() => toggleTop(t)}
                      className={`flex items-center justify-between border-2 rounded-xl p-3 transition-all ${
                        !t.isAvailable
                          ? "opacity-50 cursor-not-allowed bg-neutral-100 border-neutral-200"
                          : selected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-neutral-200 cursor-pointer hover:bg-neutral-50 hover:border-blue-300"
                      }`}
                      title={
                        !t.isAvailable ? "Topping tạm hết hàng" : "Chọn topping"
                      }
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-500"
                          checked={selected}
                          readOnly
                          disabled={!t.isAvailable}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-800">
                            {t.toppingName ?? t.name}
                          </span>
                          <span className="text-xs text-blue-600">
                            +{(t.price || 0).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>

                      {selected && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center hover:bg-neutral-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              changeQty(id, -1);
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center hover:bg-neutral-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              changeQty(id, +1);
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Ghi chú (Tuỳ chọn)
            </label>
            <textarea
              className="w-full border rounded-xl p-3 text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Ít cay, không hành..."
            />
          </div>
        </div>

        <div className="p-5 border-t border-neutral-200 flex items-center justify-end gap-3 bg-neutral-50">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 flex items-center justify-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
