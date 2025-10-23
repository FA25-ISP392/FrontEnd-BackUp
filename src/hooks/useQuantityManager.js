import { useState, useMemo } from "react";

/**
 * Hook quản lý số lượng món ăn và yêu cầu
 * Trích xuất từ DishQuantityManagement.jsx
 */
export function useQuantityManager(dishes = [], onSubmitRequest) {
  const [quantities, setQuantities] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);

  // Thuật toán thay đổi số lượng
  const handleQuantityChange = (dishId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
    }));
  };

  // Thuật toán set số lượng trực tiếp
  const setQuantity = (dishId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, quantity),
    }));
  };

  // Thuật toán batch set nhiều món
  const batchSetQuantities = (quantityMap) => {
    setQuantities((prev) => {
      const next = { ...prev };
      Object.entries(quantityMap).forEach(([dishId, quantity]) => {
        next[dishId] = Math.max(0, quantity);
      });
      return next;
    });
  };

  // Thuật toán gửi yêu cầu
  const handleSubmitRequest = async (dishId) => {
    const dish = dishes.find((d) => d.id === dishId);
    const requestedQuantity = quantities[dishId] || 0;

    if (!dish || requestedQuantity <= 0) return;

    setLoadingId(dishId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const request = {
        id: Date.now(),
        dishId,
        dishName: dish.name,
        requestedQuantity,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        timestamp: new Date().toISOString(),
        chefName: "Chef User",
        category: dish.category,
        estimatedCost: dish.price * requestedQuantity * 0.6, // Giả sử cost = 60% price
      };

      // Thêm vào lịch sử
      setRequestHistory((prev) => [request, ...prev]);

      // Callback to parent
      if (onSubmitRequest) {
        onSubmitRequest(request);
      }

      // Reset quantity sau khi gửi thành công
      setQuantities((prev) => ({ ...prev, [dishId]: 0 }));
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoadingId(null);
    }
  };

  // Thuật toán gửi nhiều yêu cầu cùng lúc
  const batchSubmitRequests = async (dishIds) => {
    const validRequests = dishIds.filter(
      (dishId) => quantities[dishId] > 0 && dishes.find((d) => d.id === dishId)
    );

    if (validRequests.length === 0) return [];

    const results = [];

    for (const dishId of validRequests) {
      try {
        await handleSubmitRequest(dishId);
        results.push({ dishId, success: true });
      } catch (error) {
        results.push({ dishId, success: false, error });
      }
    }

    return results;
  };

  // Thuật toán phân tích yêu cầu
  const requestAnalysis = useMemo(() => {
    const totalRequests = requestHistory.length;
    const pendingRequests = requestHistory.filter(
      (req) => req.status === "pending"
    ).length;
    const approvedRequests = requestHistory.filter(
      (req) => req.status === "approved"
    ).length;
    const rejectedRequests = requestHistory.filter(
      (req) => req.status === "rejected"
    ).length;

    const totalQuantityRequested = requestHistory.reduce(
      (sum, req) => sum + req.requestedQuantity,
      0
    );
    const totalEstimatedCost = requestHistory.reduce(
      (sum, req) => sum + (req.estimatedCost || 0),
      0
    );

    // Phân tích theo ngày
    const today = new Date().toISOString().split("T")[0];
    const todayRequests = requestHistory.filter((req) => req.date === today);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      approvalRate:
        totalRequests > 0
          ? Math.round((approvedRequests / totalRequests) * 100)
          : 0,
      totalQuantityRequested,
      totalEstimatedCost,
      todayRequests: todayRequests.length,
      averageQuantityPerRequest:
        totalRequests > 0
          ? Math.round(totalQuantityRequested / totalRequests)
          : 0,
    };
  }, [requestHistory]);

  // Thuật toán gợi ý số lượng dựa trên lịch sử
  const getSuggestedQuantity = (dishId) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return 0;

    // Lấy lịch sử yêu cầu của món này trong 30 ngày qua
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentRequests = requestHistory.filter(
      (req) =>
        req.dishId === dishId &&
        new Date(req.timestamp) >= thirtyDaysAgo &&
        req.status === "approved"
    );

    if (recentRequests.length === 0) {
      // Nếu không có lịch sử, gợi ý dựa trên category
      const categoryDefaults = {
        main: 20,
        appetizer: 15,
        dessert: 10,
        drink: 30,
        soup: 12,
      };
      return categoryDefaults[dish.category] || 10;
    }

    // Tính trung bình số lượng đã được approve
    const avgQuantity =
      recentRequests.reduce((sum, req) => sum + req.requestedQuantity, 0) /
      recentRequests.length;
    return Math.round(avgQuantity);
  };

  // Thuật toán tối ưu hóa yêu cầu
  const optimizeRequests = (budget = 1000) => {
    const currentQuantities = { ...quantities };
    const suggestions = [];

    // Sắp xếp món theo tỷ lệ profit/cost
    const dishProfitability = dishes
      .map((dish) => {
        const estimatedCost = dish.price * 0.6;
        const profit = dish.price - estimatedCost;
        const profitRatio = profit / estimatedCost;

        return {
          ...dish,
          estimatedCost,
          profit,
          profitRatio,
          currentQuantity: currentQuantities[dish.id] || 0,
        };
      })
      .sort((a, b) => b.profitRatio - a.profitRatio);

    let remainingBudget = budget;

    dishProfitability.forEach((dish) => {
      if (remainingBudget <= 0) return;

      const suggestedQty = getSuggestedQuantity(dish.id);
      const totalCost = suggestedQty * dish.estimatedCost;

      if (totalCost <= remainingBudget) {
        suggestions.push({
          dishId: dish.id,
          dishName: dish.name,
          suggestedQuantity: suggestedQty,
          estimatedCost: totalCost,
          profitRatio: dish.profitRatio,
          reason: "Tỷ lệ lợi nhuận cao",
        });
        remainingBudget -= totalCost;
      }
    });

    return {
      suggestions,
      totalCost: budget - remainingBudget,
      remainingBudget,
    };
  };

  // Thuật toán clear tất cả quantities
  const clearAllQuantities = () => {
    setQuantities({});
  };

  // Thuật toán copy quantities từ template
  const applyTemplate = (template) => {
    setQuantities(template);
  };

  return {
    quantities,
    loadingId,
    requestHistory,
    requestAnalysis,
    handleQuantityChange,
    setQuantity,
    batchSetQuantities,
    handleSubmitRequest,
    batchSubmitRequests,
    getSuggestedQuantity,
    optimizeRequests,
    clearAllQuantities,
    applyTemplate,
    getQuantity: (dishId) => quantities[dishId] || 0,
    hasQuantity: (dishId) => (quantities[dishId] || 0) > 0,
    isLoading: (dishId) => loadingId === dishId,
  };
}
