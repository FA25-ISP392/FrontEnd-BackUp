import { useState, useMemo } from 'react';

/**
 * Hook phân tích doanh thu và thống kê kinh doanh
 * Trích xuất từ Manager.jsx và Admin.jsx
 */
export function useRevenueAnalyzer(revenueData = [], dishSalesData = []) {
  const [revenuePeriod, setRevenuePeriod] = useState('day');

  // Thuật toán tính tổng doanh thu
  const totalRevenue = useMemo(() => {
    return revenueData.reduce((sum, item) => sum + item.revenue, 0);
  }, [revenueData]);

  // Thuật toán lọc dữ liệu theo khoảng thời gian
  const getFilteredRevenueData = useMemo(() => {
    const now = new Date();
    return revenueData.filter(item => {
      const itemDate = new Date(item.date);
      switch (revenuePeriod) {
        case 'day':
          return itemDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'month':
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear();
        case 'year':
          return itemDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [revenueData, revenuePeriod]);

  // Thuật toán tính tăng trưởng so với kỳ trước
  const calculateGrowthRate = useMemo(() => {
    const currentPeriodRevenue = getFilteredRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    
    // Tính doanh thu kỳ trước
    const now = new Date();
    let previousPeriodStart, previousPeriodEnd;
    
    switch (revenuePeriod) {
      case 'day':
        previousPeriodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        previousPeriodEnd = now;
        break;
      case 'week':
        previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousPeriodEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        previousPeriodStart = lastMonth;
        previousPeriodEnd = lastMonthEnd;
        break;
      default:
        return 0;
    }
    
    const previousPeriodRevenue = revenueData
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= previousPeriodStart && itemDate <= previousPeriodEnd;
      })
      .reduce((sum, item) => sum + item.revenue, 0);
    
    if (previousPeriodRevenue === 0) return 0;
    return ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
  }, [getFilteredRevenueData, revenueData, revenuePeriod]);

  // Thuật toán phân tích xu hướng doanh thu
  const analyzeTrends = useMemo(() => {
    if (revenueData.length < 7) return { trend: 'insufficient_data', confidence: 0 };
    
    // Sắp xếp theo ngày
    const sortedData = [...revenueData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Tính moving average 7 ngày
    const movingAverages = [];
    for (let i = 6; i < sortedData.length; i++) {
      const avg = sortedData.slice(i - 6, i + 1).reduce((sum, item) => sum + item.revenue, 0) / 7;
      movingAverages.push({ date: sortedData[i].date, value: avg });
    }
    
    if (movingAverages.length < 2) return { trend: 'insufficient_data', confidence: 0 };
    
    // Tính slope của đường trend
    const n = movingAverages.length;
    const sumX = movingAverages.reduce((sum, _, index) => sum + index, 0);
    const sumY = movingAverages.reduce((sum, item) => sum + item.value, 0);
    const sumXY = movingAverages.reduce((sum, item, index) => sum + index * item.value, 0);
    const sumX2 = movingAverages.reduce((sum, _, index) => sum + index * index, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const confidence = Math.min(Math.abs(slope) * 100, 100);
    
    let trend = 'stable';
    if (slope > 0.1) trend = 'increasing';
    else if (slope < -0.1) trend = 'decreasing';
    
    return { trend, slope, confidence: Math.round(confidence) };
  }, [revenueData]);

  // Thuật toán dự đoán doanh thu
  const predictRevenue = useMemo(() => {
    const { slope, trend } = analyzeTrends;
    if (trend === 'insufficient_data') return null;
    
    const currentRevenue = getFilteredRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    const daysInPeriod = revenuePeriod === 'day' ? 1 : revenuePeriod === 'week' ? 7 : 30;
    
    // Dự đoán cho kỳ tiếp theo
    const predictedRevenue = currentRevenue + (slope * daysInPeriod * currentRevenue);
    
    return {
      predicted: Math.max(0, predictedRevenue),
      confidence: analyzeTrends.confidence,
      trend: trend
    };
  }, [analyzeTrends, getFilteredRevenueData, revenuePeriod]);

  // Thuật toán phân tích món ăn bán chạy
  const analyzePopularDishes = useMemo(() => {
    if (!dishSalesData.length) return [];
    
    return dishSalesData
      .map(dish => {
        const totalSold = dish.sales || 0;
        const revenue = totalSold * (dish.price || 0);
        const profitMargin = dish.profitMargin || 0.3;
        const profit = revenue * profitMargin;
        
        return {
          ...dish,
          totalSold,
          revenue,
          profit,
          profitability: profit / (dish.price || 1), // Profit per unit
          popularity: totalSold / Math.max(...dishSalesData.map(d => d.sales || 0)) * 100
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [dishSalesData]);

  // Thuật toán phân tích hiệu suất theo giờ
  const analyzeHourlyPerformance = useMemo(() => {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      revenue: 0,
      orders: 0,
      avgOrderValue: 0
    }));
    
    revenueData.forEach(item => {
      if (item.timestamp) {
        const hour = new Date(item.timestamp).getHours();
        hourlyData[hour].revenue += item.revenue;
        hourlyData[hour].orders += 1;
      }
    });
    
    // Tính average order value
    hourlyData.forEach(data => {
      data.avgOrderValue = data.orders > 0 ? data.revenue / data.orders : 0;
    });
    
    // Tìm giờ cao điểm
    const peakHour = hourlyData.reduce((peak, current) => 
      current.revenue > peak.revenue ? current : peak
    );
    
    const lowHour = hourlyData.reduce((low, current) => 
      current.revenue < low.revenue && current.revenue > 0 ? current : low
    );
    
    return {
      hourlyData,
      peakHour: peakHour.hour,
      peakRevenue: peakHour.revenue,
      lowHour: lowHour.hour,
      lowRevenue: lowHour.revenue,
      totalOrders: hourlyData.reduce((sum, data) => sum + data.orders, 0)
    };
  }, [revenueData]);

  // Thuật toán tính KPIs
  const calculateKPIs = useMemo(() => {
    const currentRevenue = getFilteredRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = getFilteredRevenueData.length;
    const avgOrderValue = totalOrders > 0 ? currentRevenue / totalOrders : 0;
    
    // Tính customer lifetime value (giả định)
    const avgCustomerOrders = 5; // Giả định trung bình 5 đơn/khách
    const customerLifetimeValue = avgOrderValue * avgCustomerOrders;
    
    // Tính conversion rate (giả định)
    const totalVisitors = totalOrders * 3; // Giả định 1/3 visitors đặt hàng
    const conversionRate = totalOrders / totalVisitors * 100;
    
    return {
      totalRevenue: currentRevenue,
      totalOrders,
      avgOrderValue,
      customerLifetimeValue,
      conversionRate,
      growthRate: calculateGrowthRate
    };
  }, [getFilteredRevenueData, calculateGrowthRate]);

  return {
    totalRevenue,
    revenuePeriod,
    setRevenuePeriod,
    filteredRevenueData: getFilteredRevenueData,
    growthRate: calculateGrowthRate,
    trends: analyzeTrends,
    prediction: predictRevenue,
    popularDishes: analyzePopularDishes,
    hourlyPerformance: analyzeHourlyPerformance,
    kpis: calculateKPIs
  };
}
