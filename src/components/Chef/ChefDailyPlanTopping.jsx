import { useState, useEffect } from "react";
import { listTopping } from "../../lib/apiTopping";
import { getMyStaffProfile } from "../../lib/apiStaff";
import {
  listDailyPlans,
  createDailyPlansBatch,
  ITEM_TYPES,
} from "../../lib/apiDailyPlan";
import { Plus, Minus, Clock, CheckCircle, Send } from "lucide-react";

export default function ChefDailyPlanTopping({
  setSuccessMessage = () => {},
  setErrorMessage = () => {},
}) {
  const [toppings, setToppings] = useState([]);
  const [plans, setPlans] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [staffId, setStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const makeKey = (itemId, itemType) => `${itemType}_${itemId}`;

  useEffect(() => {
    (async () => {
      try {
        const profile = await getMyStaffProfile();
        if (profile?.staffId) setStaffId(profile.staffId);
      } catch (err) {
        console.error("❌ Không lấy được staffId:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!staffId) return;
    (async () => {
      try {
        const [toppingList, planList] = await Promise.all([
          listTopping(),
          listDailyPlans(),
        ]);

        const todayPlans = (planList || []).filter(
          (p) =>
            p.planDate === today &&
            p.staffId === staffId &&
            p.itemType === ITEM_TYPES.TOPPING
        );

        const mapped = {};
        todayPlans.forEach((p) => {
          mapped[makeKey(p.itemId, p.itemType)] = p.plannedQuantity ?? 0;
        });

        setToppings(toppingList || []);
        setPlans(todayPlans);
        setQuantities(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải kế hoạch topping:", err);
      }
    })();
  }, [staffId, today]);

  const handleQuantityChange = (id, delta) => {
    const key = makeKey(id, ITEM_TYPES.TOPPING);
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  };

  const handleQuantityInput = (id, value) => {
    const key = makeKey(id, ITEM_TYPES.TOPPING);
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) return;
    setQuantities((prev) => ({ ...prev, [key]: parsed }));
  };

  const handleSubmitAll = async () => {
    if (!staffId) {
      setErrorMessage("Không xác định được Staff ID. Vui lòng đăng nhập lại!");
      return;
    }

    const selected = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([key, qty]) => {
        const [type, id] = key.split("_");
        const existingPlan = plans.find(
          (p) => p.itemId === Number(id) && p.itemType === type
        );

        if (!existingPlan) {
          return {
            itemId: Number(id),
            itemType: type,
            plannedQuantity: Number(qty),
            planDate: today,
            staffId,
          };
        }

        if (existingPlan.plannedQuantity !== Number(qty)) {
          return {
            itemId: Number(id),
            itemType: type,
            plannedQuantity: Number(qty),
            planDate: today,
            staffId,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (selected.length === 0) {
      setErrorMessage("Không có thay đổi nào cần gửi!");
      return;
    }

    setLoading(true);
    try {
      await createDailyPlansBatch(selected);
      setSuccessMessage("Gửi kế hoạch topping thành công!");
      const refreshed = await listDailyPlans();
      const todayPlans = (refreshed || []).filter(
        (p) => p.planDate === today && p.staffId === staffId
      );
      setPlans(todayPlans);
    } catch (err) {
      console.error("❌ Lỗi gửi kế hoạch topping:", err);
      if (err?.response?.data?.code === 4005)
        setErrorMessage(
          "Một số topping đã được duyệt, không thể cập nhật lại."
        );
      else setErrorMessage("Gửi kế hoạch topping thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const getPlanStatus = (id, type = ITEM_TYPES.TOPPING) => {
    const plan = plans.find((p) => p.itemId === id && p.itemType === type);
    if (!plan) return null;
    if (plan.status === false) return "pending";
    if (plan.status === true) return "approved";
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-xl font-bold mb-6 text-white">
        Lên Kế Hoạch Topping Trong Ngày
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {toppings.map((t) => {
          const key = makeKey(t.id, ITEM_TYPES.TOPPING);
          const qty = quantities[key] || 0;
          const status = getPlanStatus(t.id, ITEM_TYPES.TOPPING);
          const plan = plans.find(
            (p) => p.itemId === t.id && p.itemType === ITEM_TYPES.TOPPING
          );

          return (
            <div
              key={key}
              className={`rounded-xl p-4 border shadow-sm ${
                status === "pending"
                  ? "bg-blue-900/20 border-blue-500/30"
                  : status === "approved"
                  ? "bg-green-900/20 border-green-500/30"
                  : "bg-black/20 border-white/10"
              }`}
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-white">{t.name}</h4>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-300">Số lượng:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(t.id, -1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-lg bg-red-900/30 text-red-300 hover:bg-red-900/50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="number"
                    value={qty}
                    min="0"
                    onChange={(e) => handleQuantityInput(t.id, e.target.value)}
                    disabled={loading}
                    className="w-14 text-center font-semibold border rounded-lg bg-black/20 border-white/10 text-white"
                  />

                  <button
                    onClick={() => handleQuantityChange(t.id, 1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-lg bg-green-900/30 text-green-300 hover:bg-green-900/50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {status === "approved" && plan?.remainingQuantity > 0 && (
                <div className="text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> <span>Đã duyệt</span>
                </div>
              )}
              {status === "pending" && (
                <div className="text-blue-400 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />{" "}
                  <span>Chờ duyệt...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmitAll}
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition-all"
      >
        {loading ? (
          "Đang gửi kế hoạch topping..."
        ) : (
          <>
            <Send className="inline w-5 h-5 mr-2" />
            Gửi kế hoạch topping
          </>
        )}
      </button>
    </div>
  );
}
