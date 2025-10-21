import { useState, useEffect } from "react";
import { listDailyPlans } from "../../lib/apiDailyPlan";
import { CheckCircle } from "lucide-react";

export default function ManagerDailyApprovedDishes() {
  const [approvedPlans, setApprovedPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd

  // 🧩 Load danh sách món đã duyệt trong ngày
  useEffect(() => {
    const fetchApprovedDishes = async () => {
      setLoading(true);
      try {
        const allPlans = await listDailyPlans();

        // ✅ Lọc ra những món hôm nay đã được duyệt (status = true)
        const approvedToday = (allPlans || []).filter(
          (p) =>
            p.itemType === "DISH" &&
            p.planDate === today &&
            (p.status === true || p.status === 1),
        );

        // 🔤 Sắp xếp theo tên món
        approvedToday.sort((a, b) => a.itemName.localeCompare(b.itemName));

        setApprovedPlans(approvedToday);
      } catch (err) {
        console.error("❌ Lỗi khi load danh sách món đã duyệt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedDishes();

    // ⏱️ Tự refresh mỗi 30 giây (nếu Manager duyệt ở tab khác)
    const interval = setInterval(fetchApprovedDishes, 30000);
    return () => clearInterval(interval);
  }, [today]);

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-900">
          Món Trong Ngày (Đã Duyệt)
        </h2>
        <span className="text-gray-500 text-sm">
          Ngày {today.split("-").reverse().join("/")}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Đang tải dữ liệu...</p>
      ) : approvedPlans.length === 0 ? (
        <p className="text-gray-600 text-center">
          Chưa có món nào được duyệt hôm nay.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedPlans.map((p) => (
            <div
              key={p.planId}
              className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">{p.itemName}</h4>
                <CheckCircle className="text-green-500 h-5 w-5" />
              </div>

              <p className="text-sm text-gray-700">
                Số lượng dự kiến:{" "}
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
