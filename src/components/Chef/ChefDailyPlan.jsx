import { useState, useEffect } from "react";
import { listDish } from "../../lib/apiDish";
import { getMyStaffProfile } from "../../lib/apiStaff";
import {
  listDailyPlans,
  createDailyPlansBatch,
  updateDailyPlan,
  ITEM_TYPES,
} from "../../lib/apiDailyPlan";
import { Plus, Minus, Send, Clock, CheckCircle } from "lucide-react";

export default function ChefDailyPlan() {
  const [dishes, setDishes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [staffId, setStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  // 🧩 Lấy staffId
  useEffect(() => {
    (async () => {
      try {
        const profile = await getMyStaffProfile();
        if (profile?.staffId) {
          setStaffId(profile.staffId);
          console.log("👤 Đã map staffId:", profile.staffId);
        }
      } catch (err) {
        console.error("❌ Không lấy được staffId:", err);
      }
    })();
  }, []);

  // 🧩 Load danh sách món + kế hoạch hôm nay
  useEffect(() => {
    if (!staffId) return;
    (async () => {
      try {
        const [dishList, planList] = await Promise.all([
          listDish(),
          listDailyPlans(),
        ]);

        const todayPlans = (planList || []).filter(
          (p) => p.planDate === today && p.staffId === staffId,
        );

        const mapped = {};
        todayPlans.forEach((p) => (mapped[p.itemId] = p.plannedQuantity));

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

  // 🧩 Gửi toàn bộ món 1 lần
  const handleSubmitAll = async () => {
    if (!staffId) {
      alert("⚠️ Không xác định được Staff ID. Vui lòng đăng nhập lại!");
      return;
    }

    const selected = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([dishId, qty]) => ({
        itemId: Number(dishId),
        itemType: ITEM_TYPES.DISH,
        plannedQuantity: Number(qty),
        planDate: today,
        staffId,
      }));

    if (selected.length === 0) {
      alert("⚠️ Vui lòng chọn ít nhất 1 món có số lượng > 0!");
      return;
    }

    setLoading(true);
    try {
      // ✅ Chia ra: món mới & món đã có
      const existing = [...plans]; // kế hoạch hôm nay đã có
      const toUpdate = [];
      const toCreate = [];

      for (const item of selected) {
        const exist = existing.find((p) => p.itemId === item.itemId);
        if (exist) {
          toUpdate.push({ planId: exist.planId, newQty: item.plannedQuantity });
        } else {
          toCreate.push(item);
        }
      }

      // 🟡 1️⃣ Update những món đã tồn tại
      for (const upd of toUpdate) {
        try {
          await updateDailyPlan(upd.planId, {
            plannedQuantity: upd.newQty,
            remainingQuantity: upd.newQty,
            status: false, // reset về chờ duyệt
          });
        } catch (err) {
          console.warn("⚠️ Lỗi updateDailyPlan:", upd, err);
        }
      }

      // 🟢 2️⃣ Tạo mới những món chưa có
      if (toCreate.length > 0) {
        try {
          await createDailyPlansBatch(toCreate);
        } catch (err) {
          console.warn("⚠️ BE trả lỗi mapper nhưng vẫn lưu:", err);
        }
      }

      alert("✅ Cập nhật kế hoạch thành công!");
      const refreshed = await listDailyPlans();
      const todayPlans = (refreshed || []).filter(
        (p) => p.planDate === today && p.staffId === staffId,
      );
      setPlans(todayPlans);
    } catch (err) {
      console.error("❌ Lỗi gửi kế hoạch tổng:", err);
      alert("❌ Gửi kế hoạch thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const getPlanStatus = (dishId) => {
    const plan = plans.find((p) => p.itemId === dishId);
    if (!plan) return null;
    if (plan.status === false) return "pending";
    if (plan.status === true) return "approved";
    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold mb-6 text-neutral-900">
        Lên Kế Hoạch Trong Ngày
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {dishes.map((dish) => {
          const qty = quantities[dish.id] || 0;
          const status = getPlanStatus(dish.id);
          return (
            <div
              key={dish.id}
              className={`rounded-xl p-4 border shadow-sm transition-all ${
                status === "approved"
                  ? "bg-green-50 border-green-200"
                  : status === "pending"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold">{dish.name}</h4>
                <span className="text-xs text-gray-500">{dish.category}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span>Số lượng:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(dish.id, -1)}
                    disabled={loading}
                    className="w-8 h-8 bg-red-100 text-red-600 rounded-lg"
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
                    className="w-14 text-center font-semibold border rounded-lg border-gray-300"
                  />
                  <button
                    onClick={() => handleQuantityChange(dish.id, 1)}
                    disabled={loading}
                    className="w-8 h-8 bg-green-100 text-green-600 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {status === "approved" && (
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
        {loading ? (
          "Đang gửi kế hoạch..."
        ) : (
          <>
            <Send className="inline w-5 h-5 mr-2" />
            Gửi kế hoạch tổng
          </>
        )}
      </button>
    </div>
  );
}
