import { useState, useEffect } from "react";
import { listTopping } from "../../lib/apiTopping";
import { getMyStaffProfile } from "../../lib/apiStaff";
import {
  listDailyPlans,
  createDailyPlansBatch,
  ITEM_TYPES,
} from "../../lib/apiDailyPlan";
import { Plus, Minus, Clock, CheckCircle } from "lucide-react";

export default function ChefDailyPlanTopping() {
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
            p.itemType === ITEM_TYPES.TOPPING,
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

  // ✅ PHIÊN BẢN CHỈ DÙNG POST /daily-plans/batch
  const handleSubmitAll = async () => {
    if (!staffId) {
      alert("⚠️ Không xác định được Staff ID. Vui lòng đăng nhập lại!");
      return;
    }

    // 🔍 Chỉ lấy những topping có thay đổi hoặc chưa có plan
    const selected = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([key, qty]) => {
        const [type, id] = key.split("_");
        const existingPlan = plans.find(
          (p) => p.itemId === Number(id) && p.itemType === type,
        );

        // Nếu chưa có plan -> gửi tạo mới
        if (!existingPlan) {
          return {
            itemId: Number(id),
            itemType: type,
            plannedQuantity: Number(qty),
            planDate: today,
            staffId,
          };
        }

        // Nếu có plan nhưng số lượng thay đổi thì gửi cập nhật
        if (existingPlan.plannedQuantity !== Number(qty)) {
          return {
            itemId: Number(id),
            itemType: type,
            plannedQuantity: Number(qty),
            planDate: today,
            staffId,
          };
        }

        // Nếu không đổi thì bỏ qua
        return null;
      })
      .filter(Boolean); // Bỏ null ra

    if (selected.length === 0) {
      alert("⚠️ Không có thay đổi nào cần gửi!");
      return;
    }

    setLoading(true);
    try {
      console.log("📦 [POST] Gửi batch daily plan (chỉ thay đổi):", selected);
      await createDailyPlansBatch(selected);

      alert("✅ Cập nhật kế hoạch topping thành công!");

      const refreshed = await listDailyPlans();
      const todayPlans = (refreshed || []).filter(
        (p) => p.planDate === today && p.staffId === staffId,
      );
      setPlans(todayPlans);
    } catch (err) {
      console.error("❌ Lỗi gửi kế hoạch topping:", err);
      if (err?.response?.data?.code === 4005)
        alert("⚠️ Một số topping đã được duyệt, không thể cập nhật lại.");
      else alert("❌ Gửi kế hoạch topping thất bại!");
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
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold mb-6 text-neutral-900">
        Lên Kế Hoạch Topping Trong Ngày
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {toppings.map((t) => {
          const key = makeKey(t.id, ITEM_TYPES.TOPPING);
          const qty = quantities[key] || 0;
          const status = getPlanStatus(t.id, ITEM_TYPES.TOPPING);
          const plan = plans.find(
            (p) => p.itemId === t.id && p.itemType === ITEM_TYPES.TOPPING,
          );

          return (
            <div
              key={key}
              className={`rounded-xl p-4 border shadow-sm ${
                status === "pending"
                  ? "bg-blue-50 border-blue-200"
                  : status === "approved"
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold">{t.name}</h4>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span>Số lượng:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(t.id, -1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="number"
                    value={qty}
                    min="0"
                    onChange={(e) => handleQuantityInput(t.id, e.target.value)}
                    disabled={loading}
                    className="w-14 text-center font-semibold border rounded-lg border-gray-300"
                  />

                  <button
                    onClick={() => handleQuantityChange(t.id, 1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {status === "approved" && plan?.remainingQuantity > 0 && (
                <div className="text-green-600 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> <span>Đã duyệt</span>
                </div>
              )}
              {status === "pending" && (
                <div className="text-blue-600 text-sm flex items-center gap-2">
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
        {loading ? "Đang gửi kế hoạch topping..." : "Gửi kế hoạch topping"}
      </button>
    </div>
  );
}
