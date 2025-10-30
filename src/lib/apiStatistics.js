import apiConfig from "../api/apiConfig";

// 🟢 Món bán chạy
export const getBestSellingDishes = async ({
  year,
  month,
  day,
  limit = 10,
}) => {
  const data = await apiConfig.get("/statistics/dishes/best", {
    params: { year, month, day, limit },
  });
  console.log("🔥 Best-selling dishes:", data);
  return data || [];
};

// 🔴 Món bán tệ
export const getWorstSellingDishes = async ({
  year,
  month,
  day,
  limit = 5,
}) => {
  const data = await apiConfig.get("/statistics/dishes/worst", {
    params: { year, month, day, limit },
  });
  console.log("🔥 Worst-selling dishes:", data);
  return data || [];
};

// 🟡 Báo cáo doanh thu
export const getRevenueSummary = async ({ day, month, year, method }) => {
  const data = await apiConfig.get("/statistics/revenue/summary", {
    params: { day, month, year, method },
  });
  console.log("📊 Revenue summary:", data);
  return data || {};
};
