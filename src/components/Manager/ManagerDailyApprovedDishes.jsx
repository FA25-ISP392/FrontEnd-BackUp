import { useState, useEffect } from "react";
import { listDailyPlans } from "../../lib/apiDailyPlan";
import { CheckCircle } from "lucide-react";

export default function ManagerDailyApprovedDishes() {
  const [approvedPlans, setApprovedPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchApprovedDishes = async () => {
      setLoading(true);
      try {
        const allPlans = await listDailyPlans();

        const approvedToday = (allPlans || []).filter(
          (p) =>
            p.itemType === "DISH" &&
            p.planDate === today &&
            (p.status === true || p.status === 1)
        );

        approvedToday.sort((a, b) => a.itemName.localeCompare(b.itemName));

        setApprovedPlans(approvedToday);
      } catch (err) {
        console.error("❌ Lỗi khi load danh sách món đã duyệt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedDishes();

    const interval = setInterval(fetchApprovedDishes, 30000);
    return () => clearInterval(interval);
  }, [today]);

  return (
    <div className="p-0">
      {" "}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          Món Trong Ngày (Đã Duyệt)
        </h2>
        <span className="text-gray-400 text-sm">
          Ngày {today.split("-").reverse().join("/")}
        </span>
      </div>
      {loading ? (
        <p className="text-indigo-200 text-center">Đang tải dữ liệu...</p>
      ) : approvedPlans.length === 0 ? (
        <p className="text-indigo-200 text-center">
          Chưa có món nào được duyệt hôm nay.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedPlans.map((p) => (
            <div
              key={p.planId}
              className="bg-green-900/30 rounded-xl p-4 shadow-lg border border-green-500/30 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-white">{p.itemName}</h4>
                <CheckCircle className="text-green-400 h-5 w-5" />
              </div>

              <p className="text-sm text-neutral-300">
                Số lượng dự kiến:{" "}
                <span className="font-semibold text-white">
                  {p.plannedQuantity}
                </span>
              </p>

              <p className="text-xs text-neutral-400 mt-1">
                Người lập: {p.staffName || "Không rõ"}
              </p>
              <p className="text-xs text-neutral-400">
                Người duyệt: {p.approverName || "Manager"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
