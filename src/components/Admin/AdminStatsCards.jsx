import { useEffect, useState } from "react";
import { getRevenueSummary } from "../../lib/apiStatistics";

export default function AdminStatsCards() {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [revenueByMethod, setRevenueByMethod] = useState([]);
  const [loading, setLoading] = useState(false);

  const fmtVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  // 🧾 Lấy tổng doanh thu hôm nay và chi tiết phương thức
  const fetchTodayRevenue = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const params = {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      };

      const res = await getRevenueSummary(params);
      console.log("📊 Dữ liệu doanh thu:", res);

      // Lấy danh sách theo phương thức
      const list =
        res?.data?.result?.revenueByMethod ??
        res?.result?.revenueByMethod ??
        res?.revenueByMethod ??
        [];

      // Tổng cộng doanh thu
      const total = list.reduce(
        (sum, item) => sum + Number(item?.totalRevenue || 0),
        0,
      );

      setTodayRevenue(total);
      setRevenueByMethod(list);
    } catch (err) {
      console.error("❌ Lỗi tải doanh thu hôm nay:", err);
      setTodayRevenue(0);
      setRevenueByMethod([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayRevenue();

    // Tự reload khi qua ngày mới
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() < 5) {
        fetchTodayRevenue();
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Tìm doanh thu từng phương thức
  const cashRevenue =
    revenueByMethod.find((m) => m.method === "CASH")?.totalRevenue || 0;
  const bankRevenue =
    revenueByMethod.find((m) => m.method === "BANK_TRANSFER")?.totalRevenue ||
    0;

  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all">
        <p className="text-neutral-600 text-sm mb-2">Tổng Doanh Thu Hôm Nay</p>

        {loading ? (
          <p className="text-lg text-neutral-500">Đang tải...</p>
        ) : (
          <>
            <p className="text-4xl font-bold text-green-700 mb-4">
              {fmtVND(todayRevenue)}
            </p>

            <div className="flex flex-col gap-1 text-sm text-neutral-700">
              <p>
                💵 <span className="font-medium">Tiền mặt:</span>{" "}
                <span className="text-green-700">{fmtVND(cashRevenue)}</span>
              </p>
              <p>
                🏦 <span className="font-medium">Chuyển khoản:</span>{" "}
                <span className="text-green-700">{fmtVND(bankRevenue)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
