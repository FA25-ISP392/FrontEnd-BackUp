import { useState, useEffect } from "react";
import {
  listDailyPlans,
  approveAllDailyPlans,
  deleteDailyPlan,
} from "../../lib/apiDailyPlan";
import { CheckCircle, XCircle } from "lucide-react";

export default function ManagerDailyPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    (async () => {
      try {
        const allPlans = await listDailyPlans();
        const todayPlans = (allPlans || []).filter(
          (p) => p.planDate === today && p.status === false, // ✅ chỉ lấy status=false
        );
        setPlans(todayPlans);
      } catch (err) {
        console.error("❌ Lỗi load kế hoạch:", err);
      }
    })();
  }, [today]);

  const handleApproveAll = async () => {
    if (plans.length === 0) return alert("Không có kế hoạch nào để duyệt!");
    if (!window.confirm("Duyệt toàn bộ kế hoạch hôm nay?")) return;

    setLoading(true);
    try {
      await approveAllDailyPlans(plans);
      alert("✅ Đã duyệt toàn bộ!");
      setPlans([]);
    } catch (err) {
      console.error("❌ Lỗi duyệt:", err);
      alert("Không thể duyệt kế hoạch!");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (planId, itemName) => {
    if (!window.confirm(`Từ chối yêu cầu "${itemName}"?`)) return;
    try {
      await deleteDailyPlan(planId);
      setPlans((prev) => prev.filter((p) => p.planId !== planId));
      alert(`❌ Đã từ chối "${itemName}"`);
    } catch (err) {
      alert("Lỗi khi xoá yêu cầu!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Yêu Cầu Kế Hoạch Trong Ngày</h2>
        <button
          onClick={handleApproveAll}
          disabled={loading || plans.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Đang duyệt..." : "✅ Duyệt toàn bộ"}
        </button>
      </div>

      {plans.length === 0 ? (
        <p className="text-gray-600 text-center">Không có yêu cầu mới nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.planId}
              className="bg-white p-4 rounded-xl shadow border hover:shadow-md transition-all"
            >
              <h4 className="font-semibold mb-1">{p.itemName}</h4>
              <p className="text-sm text-gray-600 mb-3">
                Số lượng: {p.plannedQuantity}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-blue-600 text-sm gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Chờ duyệt</span>
                </div>
                <button
                  onClick={() => handleReject(p.planId, p.itemName)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
