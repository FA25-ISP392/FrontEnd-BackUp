import { useEffect, useState } from "react";
import { X, Minus, Plus, Save } from "lucide-react";
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

    // (async () => {
    //   try {
    //     const opts = await getToppingsByDishId(detail.dishId);
    //     setAllToppings(Array.isArray(opts) ? opts : []);
    //   } catch {
    //     setAllToppings([]);
    //   }
    // })();
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
        }));

        setAllToppings(mapped);
      } catch (e) {
        console.warn("Không lấy được optionalToppings:", e?.message || e);
        setAllToppings([]);
      }
    })();
  }, [isOpen, detail]);

  if (!isOpen || !detail) return null;

  const toggleTop = (tId) => {
    const m = new Map(picked);
    if (m.has(tId)) m.delete(tId);
    else m.set(tId, 1);
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{detail.dishName}</h3>
            <p className="text-xs text-neutral-500">Sửa topping, ghi chú</p>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-neutral-100"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <div className="text-sm font-medium mb-2">Toppings</div>
            <div className="space-y-2">
              {allToppings.map((t) => {
                const id = Number(t.toppingId ?? t.id);
                const selected = picked.has(id);
                const qty = picked.get(id) ?? 1;

                return (
                  <div
                    key={id}
                    className={`flex items-center justify-between border rounded-xl p-2 ${
                      selected ? "bg-emerald-50 border-emerald-200" : ""
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selected}
                        onChange={() => toggleTop(id)}
                      />
                      <span className="text-sm">{t.toppingName ?? t.name}</span>
                    </label>

                    {selected && (
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 rounded-lg bg-neutral-100"
                          onClick={() => changeQty(id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm">{qty}</span>
                        <button
                          className="p-1 rounded-lg bg-neutral-100"
                          onClick={() => changeQty(id, +1)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {!allToppings.length && (
                <div className="text-xs text-neutral-500">
                  Món này chưa có danh sách topping.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Ghi chú</div>
            <textarea
              className="w-full border rounded-xl p-2 text-sm"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ít cay / thêm phô mai..."
            />
          </div>
        </div>

        <div className="p-5 border-t flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-neutral-100"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
