import { useState, useEffect } from "react";
import { listDailyPlans } from "../../lib/apiDailyPlan";
import { CheckCircle } from "lucide-react";

export default function ManagerDailyApprovedToppings() {
  const [approvedPlans, setApprovedPlans] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      const allPlans = await listDailyPlans();
      const filtered = (allPlans || []).filter(
        (p) =>
          p.planDate === today &&
          (p.status === true || p.status === 1) &&
          p.itemType === "TOPPING",
      );
      setApprovedPlans(filtered);
    };
    fetchData();
  }, [today]);

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-900">
          Topping Trong Ngày (Đã Duyệt)
        </h2>
        <span className="text-gray-500 text-sm">
          Ngày {today.split("-").reverse().join("/")}
        </span>
      </div>

      {approvedPlans.length === 0 ? (
        <p className="text-gray-600 text-center">
          Chưa có topping nào được duyệt hôm nay.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedPlans.map((p) => (
            <div
              key={p.planId}
              className="bg-green-50 rounded-xl p-4 border border-green-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">{p.itemName}</h4>
                <CheckCircle className="text-green-500 h-5 w-5" />
              </div>
              <p className="text-sm text-gray-700">
                Số lượng:{" "}
                <span className="font-semibold text-gray-900">
                  {p.plannedQuantity}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                👨‍🍳 Người lập: {p.staffName || "Không rõ"}
              </p>
              <p className="text-xs text-gray-500">
                ✅ Người duyệt: {p.approverName || "Manager"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
