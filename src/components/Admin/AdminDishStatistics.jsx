import { useEffect, useState, useMemo } from "react"; // Thêm useMemo
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
} from "recharts"; // Bỏ Sector
import {
  getRevenueSummary,
  getBestSellingDishes,
  getWorstSellingDishes,
} from "../../lib/apiStatistics";
import { Star, Timer, PieChart as PieChartIcon, Search } from "lucide-react";

// --- START: CẤU HÌNH BIỂU ĐỒ TRÒN ---
const METHOD_LABELS = {
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
};

// 🎨 Bảng màu cho biểu đồ tròn
const COLORS = {
  CASH: "#FBBF24", // Amber-400
  BANK_TRANSFER: "#6366F1", // Indigo-500
};
// --- END: CẤU HÌNH BIỂU ĐỒ TRÒN ---

export default function AdminDishStatistics() {
  const [revenue, setRevenue] = useState([]);
  const [bestDishes, setBestDishes] = useState([]);
  const [worstDishes, setWorstDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  // --- START: STATE MỚI CHO FILTER BIỂU ĐỒ TRÒN ---
  // Mặc định cả hai đều được hiển thị
  const [activeMethods, setActiveMethods] = useState({
    CASH: true,
    BANK_TRANSFER: true,
  });
  // --- END: STATE MỚI ---

  const fmtVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

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

  const FIXED_INPUT_CLASS =
    "border rounded-lg px-3 py-2 w-full bg-white/10 text-white border-white/30 placeholder-indigo-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all";

  // --- START: LỌC DỮ LIỆU BIỂU ĐỒ TRÒN ---
  // Chỉ giữ lại những phương thức đang active
  const filteredRevenue = useMemo(
    () => revenue.filter((item) => activeMethods[item.method]),
    [revenue, activeMethods]
  );

  // Hàm để bật/tắt một phương thức
  const handleToggleMethod = (method) => {
    setActiveMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };
  // --- END: LỌC DỮ LIỆU ---

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10 mt-8">
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="w-24">
            <label className="block text-sm text-indigo-200 mb-1">Ngày</label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="VD: 15"
              className={FIXED_INPUT_CLASS}
            />
          </div>
          <div className="w-24">
            <label className="block text-sm text-indigo-200 mb-1">Tháng</label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="VD: 10"
              className={FIXED_INPUT_CLASS}
            />
          </div>
          <div className="w-28">
            <label className="block text-sm text-indigo-200 mb-1">Năm *</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className={FIXED_INPUT_CLASS}
            />
          </div>
          <button
            onClick={fetchData}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 animate-background-pan"
          >
            <Search className="w-4 h-4 inline-block mr-2" />
            Tra cứu
          </button>
        </div>

        {loading ? (
          <p className="text-indigo-200 text-center py-4">
            Đang tải dữ liệu...
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Món bán chậm nhất (Màu mới: Amber/Orange) */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Timer className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Món Bán Chậm Nhất
                </h3>
              </div>

              {worstDishes.length === 0 ? (
                <p className="text-sm text-indigo-200">Không có dữ liệu.</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={worstDishes}
                      margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.1}
                        stroke="#818CF8"
                      />
                      <XAxis
                        dataKey="itemName"
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                        height={60}
                        tick={{ fontSize: 12, fill: "#c7d2fe" }}
                        stroke="#4f46e5"
                      />
                      <YAxis
                        allowDecimals={false}
                        tickFormatter={(value) => `${value}`}
                        tick={{ fontSize: 12, fill: "#c7d2fe" }}
                        stroke="#4f46e5"
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0];
                            return (
                              <div className="bg-slate-800/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-md p-3">
                                <p className="font-semibold text-white">
                                  {label}
                                </p>
                                <p className="text-orange-400">
                                  Số lượng đã bán: {item.value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                      />
                      <Bar
                        dataKey="totalSold"
                        fill="url(#gradientWorstSelling)"
                        radius={[4, 4, 0, 0]}
                        animationBegin={800}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                      <defs>
                        <linearGradient
                          id="gradientWorstSelling"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#FBBF24"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F97316"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Doanh thu theo phương thức (Đã cập nhật) */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <PieChartIcon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Doanh Thu Theo Phương Thức
                </h3>
              </div>

              {revenue.length === 0 ? (
                <p className="text-sm text-indigo-200">Không có dữ liệu.</p>
              ) : (
                <>
                  {/* --- START: LEGEND TƯƠNG TÁC MỚI --- */}
                  <div className="flex justify-center gap-6 mb-4">
                    {revenue.map((entry) => (
                      <button
                        key={entry.method}
                        onClick={() => handleToggleMethod(entry.method)}
                        className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                          !activeMethods[entry.method]
                            ? "opacity-40"
                            : "bg-white/5"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[entry.method] }}
                        />
                        <div className="text-left">
                          <div className="text-sm text-indigo-200">
                            {METHOD_LABELS[entry.method] || entry.method}
                          </div>
                          <div className="font-bold text-white">
                            {fmtVND(entry.revenue)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* --- END: LEGEND TƯƠNG TÁC MỚI --- */}

                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          // Sử dụng dữ liệu đã lọc
                          data={filteredRevenue}
                          dataKey="revenue"
                          nameKey="method"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          cornerRadius={5}
                          labelLine={false}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                          fill="#8884d8"
                          stroke="none"
                          animationBegin={400}
                          animationDuration={1000}
                          animationEasing="ease-out"
                        >
                          {/* Map trên dữ liệu đã lọc */}
                          {filteredRevenue.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[entry.method] || "#3B82F6"}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            fmtVND(value),
                            METHOD_LABELS[name] || name,
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.9)",
                            borderColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e0e7ff" }}
                          itemStyle={{ color: "#c7d2fe" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>

            {/* Món bán chạy nhất (Màu mới: Teal/Green) */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Món Bán Chạy Nhất
                </h3>
              </div>

              {bestDishes.length === 0 ? (
                <p className="text-sm text-indigo-200">Không có dữ liệu.</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bestDishes}
                      margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.1}
                        stroke="#818CF8"
                      />
                      <XAxis
                        dataKey="itemName"
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                        height={60}
                        tick={{ fontSize: 12, fill: "#c7d2fe" }}
                        stroke="#4f46e5"
                      />
                      <YAxis
                        tickFormatter={(value) => `${value}`}
                        tick={{ fontSize: 12, fill: "#c7d2fe" }}
                        stroke="#4f46e5"
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0];
                            return (
                              <div className="bg-slate-800/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-md p-3">
                                <p className="font-semibold text-white">
                                  {label}
                                </p>
                                <p className="text-teal-400">
                                  Số lượng đã bán: {item.value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                      />
                      <Bar
                        dataKey="totalSold"
                        fill="url(#gradientBestSelling)"
                        radius={[4, 4, 0, 0]}
                        animationBegin={1200}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                      <defs>
                        <linearGradient
                          id="gradientBestSelling"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2DD4BF"
                            stopOpacity={0.95}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22C55E"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
