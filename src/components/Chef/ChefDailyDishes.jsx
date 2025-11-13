import { useEffect, useState } from "react";
import { listDailyPlans } from "../../lib/apiDailyPlan";
import { CheckCircle } from "lucide-react";

export default function ChefDailyDishes() {
  const [approvedPlans, setApprovedPlans] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await listDailyPlans();
      const today = new Date().toISOString().split("T")[0];
      setApprovedPlans(
        [...res]
          .filter(
            (p) =>
              p.status === true &&
              p.planDate === today &&
              p.itemType === "DISH",
          )
          .reverse(),
      );
    })();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-xl font-bold mb-4 text-white">
        Món Trong Ngày (Đã Được Duyệt)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {approvedPlans.map((p) => (
          <div
            key={p.planId || p.id}
            className="bg-green-900/30 border border-green-500/30 rounded-xl p-4"
          >
            <h4 className="font-semibold text-white">{p.itemName}</h4>
            <p className="text-sm text-neutral-300">
              Số lượng còn lại: {p.remainingQuantity}
            </p>

            <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              Đã được {p.approverName || "Manager"} duyệt
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
