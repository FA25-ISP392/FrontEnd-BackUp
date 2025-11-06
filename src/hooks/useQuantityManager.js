import { useState, useMemo } from "react";

export function useQuantityManager(dishes = [], onSubmitRequest) {
  const [quantities, setQuantities] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);

  const handleQuantityChange = (dishId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
    }));
  };

  const setQuantity = (dishId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, quantity),
    }));
  };

  const batchSetQuantities = (quantityMap) => {
    setQuantities((prev) => {
      const next = { ...prev };
      Object.entries(quantityMap).forEach(([dishId, quantity]) => {
        next[dishId] = Math.max(0, quantity);
      });
      return next;
    });
  };

  const handleSubmitRequest = async (dishId) => {
    const dish = dishes.find((d) => d.id === dishId);
    const requestedQuantity = quantities[dishId] || 0;

    if (!dish || requestedQuantity <= 0) return;

    setLoadingId(dishId);

    try {
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
        estimatedCost: dish.price * requestedQuantity * 0.6,
      };

      setRequestHistory((prev) => [request, ...prev]);

      if (onSubmitRequest) {
        onSubmitRequest(request);
      }

      setQuantities((prev) => ({ ...prev, [dishId]: 0 }));
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoadingId(null);
    }
  };

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

  const getSuggestedQuantity = (dishId) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentRequests = requestHistory.filter(
      (req) =>
        req.dishId === dishId &&
        new Date(req.timestamp) >= thirtyDaysAgo &&
        req.status === "approved"
    );

    if (recentRequests.length === 0) {
      const categoryDefaults = {
        main: 20,
        appetizer: 15,
        dessert: 10,
        drink: 30,
        soup: 12,
      };
      return categoryDefaults[dish.category] || 10;
    }

    const avgQuantity =
      recentRequests.reduce((sum, req) => sum + req.requestedQuantity, 0) /
      recentRequests.length;
    return Math.round(avgQuantity);
  };

  const optimizeRequests = (budget = 1000) => {
    const currentQuantities = { ...quantities };
    const suggestions = [];

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

  const clearAllQuantities = () => {
    setQuantities({});
  };

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
