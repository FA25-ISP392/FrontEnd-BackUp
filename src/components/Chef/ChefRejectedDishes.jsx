import { useEffect, useState } from "react";
import { listDailyPlans } from "../../lib/apiDailyPlan";
import { XCircle } from "lucide-react";

export default function ChefRejectedDishes() {
  const [rejectedPlans, setRejectedPlans] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await listDailyPlans();
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
      });
      setRejectedPlans(
        res.filter((p) => p.planDate === today && p.status === false),
      );
    })();
  }, []);

  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold mb-4 text-red-700">
        Món Trong Ngày (Bị Từ Chối)
      </h3>
      {rejectedPlans.length === 0 ? (
        <p className="text-neutral-500 italic">Không có món nào bị từ chối.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rejectedPlans.map((p) => (
            <div
              key={p.id}
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <h4 className="font-semibold text-red-700">{p.itemName}</h4>
              <p className="text-sm text-neutral-600">
                Số lượng yêu cầu: {p.plannedQuantity}
              </p>
              <div className="flex items-center gap-2 mt-2 text-red-700 text-sm">
                <XCircle className="h-4 w-4" />
                <span>Đã bị từ chối bởi {p.approverName || "Manager"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
