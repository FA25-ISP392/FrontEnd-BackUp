import { useState, useEffect } from "react";
import { listDish } from "../../lib/apiDish";
import { getMyStaffProfile } from "../../lib/apiStaff";
import {
  listDailyPlans,
  createDailyPlansBatch,
  ITEM_TYPES,
} from "../../lib/apiDailyPlan";
import { Plus, Minus, Clock, CheckCircle, Send } from "lucide-react";

export default function ChefDailyPlan({
  setSuccessMessage = () => {},
  setErrorMessage = () => {},
}) {
  const [dishes, setDishes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [staffId, setStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

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
        const [dishList, planList] = await Promise.all([
          listDish(),
          listDailyPlans(),
        ]);

        const todayPlans = (planList || []).filter(
          (p) =>
            p.planDate === today &&
            p.staffId === staffId &&
            p.itemType === ITEM_TYPES.DISH
        );

        const mapped = {};
        todayPlans.forEach((p) => {
          mapped[p.itemId] = p.plannedQuantity ?? 0;
        });

        setDishes(dishList || []);
        setPlans(todayPlans);
        setQuantities(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải kế hoạch:", err);
      }
    })();
  }, [staffId, today]);

  const handleQuantityChange = (dishId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
    }));
  };

  const handleQuantityInput = (dishId, value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) return;
    setQuantities((prev) => ({ ...prev, [dishId]: parsed }));
  };

  const handleSubmitAll = async () => {
    if (!staffId) {
      setErrorMessage("Không xác định được Staff ID. Vui lòng đăng nhập lại!");
      return;
    }

    const selected = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const existingPlan = plans.find(
          (p) => p.itemId === Number(id) && p.itemType === ITEM_TYPES.DISH
        );

        if (!existingPlan) {
          return {
            itemId: Number(id),
            itemType: ITEM_TYPES.DISH,
            plannedQuantity: Number(qty),
            planDate: today,
            staffId,
          };
        }

        if (existingPlan.plannedQuantity !== Number(qty)) {
          return {
            itemId: Number(id),
            itemType: ITEM_TYPES.DISH,
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
      setSuccessMessage("Gửi kế hoạch món ăn thành công!");

      const refreshed = await listDailyPlans();
      const todayPlans = (refreshed || []).filter(
        (p) => p.planDate === today && p.staffId === staffId
      );
      setPlans(todayPlans);
    } catch (err) {
      console.error("❌ Lỗi gửi kế hoạch món ăn:", err);
      setErrorMessage("Gửi kế hoạch thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const getPlanStatus = (dishId) => {
    const plan = plans.find(
      (p) => p.itemId === dishId && p.itemType === ITEM_TYPES.DISH
    );
    if (!plan) return null;
    if (plan.status === false) return "pending";
    if (plan.status === true) return "approved";
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-xl font-bold mb-6 text-white">
        Lên Kế Hoạch Món Ăn Trong Ngày
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {dishes.map((dish) => {
          const qty = quantities[dish.id] || 0;
          const status = getPlanStatus(dish.id);
          return (
            <div
              key={dish.id}
              className={`rounded-xl p-4 border shadow-sm ${
                status === "pending"
                  ? "bg-blue-900/20 border-blue-500/30"
                  : status === "approved"
                  ? "bg-green-900/20 border-green-500/30"
                  : "bg-black/20 border-white/10"
              }`}
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-white">{dish.name}</h4>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-300">Số lượng:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(dish.id, -1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-lg bg-red-900/30 text-red-300 hover:bg-red-900/50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="number"
                    value={qty}
                    min="0"
                    onChange={(e) =>
                      handleQuantityInput(dish.id, e.target.value)
                    }
                    disabled={loading}
                    className="w-14 text-center font-semibold border rounded-lg bg-black/20 border-white/10 text-white"
                  />

                  <button
                    onClick={() => handleQuantityChange(dish.id, 1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-lg bg-green-900/30 text-green-300 hover:bg-green-900/50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {status === "approved" && (
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
          "Đang gửi kế hoạch món ăn..."
        ) : (
          <>
            <Send className="inline w-5 h-5 mr-2" />
            Gửi kế hoạch món ăn
          </>
        )}
      </button>
    </div>
  );
}
