import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getRevenueSummary,
  getBestSellingDishes,
  getWorstSellingDishes,
} from "../../lib/apiStatistics";
import { DollarSign, Star, Timer } from "lucide-react";

export default function AdminDishStatistics() {
  const [revenue, setRevenue] = useState([]);
  const [bestDishes, setBestDishes] = useState([]);
  const [worstDishes, setWorstDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    if (!year) return;
    setLoading(true);
    try {
      const params = {
        day: day ? Number(day) : undefined,
        month: month ? Number(month) : undefined,
        year: Number(year),
      };

      const [rev, best, worst] = await Promise.all([
        getRevenueSummary(params),
        getBestSellingDishes(params),
        getWorstSellingDishes(params),
      ]);

      const revenueData = rev?.revenueByMethod
        ? rev.revenueByMethod.map((m) => ({
            method: m.method,
            revenue: m.totalRevenue,
          }))
        : [];

      setRevenue(revenueData);
      setBestDishes(best || []);
      setWorstDishes(worst || []);
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu thống kê:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20 mt-8">
      {/* Bộ lọc ngày tháng năm */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm text-neutral-600 mb-1">Ngày</label>
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="VD: 15"
            className="border rounded-lg px-3 py-2 w-24"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600 mb-1">Tháng</label>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="VD: 10"
            className="border rounded-lg px-3 py-2 w-24"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600 mb-1">Năm *</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 w-28"
          />
        </div>
        <button
          onClick={fetchData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
        >
          Tra cứu
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 text-center py-4">Đang tải dữ liệu...</p>
      ) : (
        <div className="space-y-8">
          {/* 🟢 Biểu đồ Doanh thu */}
          <div className="bg-white rounded-xl p-5 shadow border">
            <div className="flex items-center gap-3 mb-4">
              {/* ❌ bỏ icon DollarSign */}
              <h3 className="text-lg font-bold text-green-700">
                Doanh Thu Theo Phương Thức
              </h3>
            </div>

            {revenue.length === 0 ? (
              <p className="text-sm text-neutral-500">Không có dữ liệu.</p>
            ) : (
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Pie
                      data={revenue}
                      dataKey="revenue"
                      nameKey="method"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ method, revenue }) => {
                        // 💬 Đổi nhãn sang tiếng Việt
                        const methodLabel =
                          method === "CASH"
                            ? "Tiền mặt"
                            : method === "BANK_TRANSFER"
                            ? "Chuyển khoản"
                            : method;

                        return `${methodLabel}: ${new Intl.NumberFormat(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          },
                        ).format(revenue)}`;
                      }}
                    >
                      {revenue.map((entry, index) => {
                        // 🎨 Gán màu cho từng phương thức
                        let color = "#10B981"; // xanh lá
                        if (entry.method === "BANK_TRANSFER")
                          color = "#FACC15"; // vàng
                        else if (entry.method === "CASH") color = "#10B981"; // xanh
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 🟣 Món bán chạy nhất */}
          <div className="bg-white rounded-xl p-5 shadow border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-700">
                Món Bán Chạy Nhất
              </h3>
            </div>

            {bestDishes.length === 0 ? (
              <p className="text-sm text-neutral-500">Không có dữ liệu.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bestDishes}
                    margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="itemName"
                      angle={-15}
                      textAnchor="end"
                      interval={0}
                      height={60}
                      tick={{ fontSize: 12, fill: "#374151" }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="totalSold"
                      fill="#4ADE80"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 🔴 Món bán chậm nhất */}
          <div className="bg-white rounded-xl p-5 shadow border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Timer className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-red-700">
                Món Bán Chậm Nhất
              </h3>
            </div>

            {worstDishes.length === 0 ? (
              <p className="text-sm text-neutral-500">Không có dữ liệu.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={worstDishes}
                    margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="itemName"
                      angle={-15}
                      textAnchor="end"
                      interval={0}
                      height={60}
                      tick={{ fontSize: 12, fill: "#374151" }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="totalSold"
                      fill="#F87171"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
