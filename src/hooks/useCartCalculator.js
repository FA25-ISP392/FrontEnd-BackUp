import { useState, useMemo } from "react";

export function useCartCalculator() {
  const [cart, setCart] = useState([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  const addToCart = (dish, notes = "") => {
    const existingItem = cart.find(
      (item) => item.id === dish.id && item.notes === notes
    );

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === dish.id && item.notes === notes
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...dish, quantity: 1, notes }]);
    }

    setCaloriesConsumed((prev) => prev + (dish.totalCalories || dish.calories));
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const item = cart.find((item) => item.id === itemId);
    if (item) {
      const quantityDiff = newQuantity - item.quantity;
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      setCaloriesConsumed(
        (prev) => prev + quantityDiff * (item.totalCalories || item.calories)
      );
    }
  };

  const removeFromCart = (itemId) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      setCaloriesConsumed(
        (prev) => prev - (item.totalCalories || item.calories) * item.quantity
      );
    }
  };

  const cartStats = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalNutrition = cart.reduce(
      (total, item) => {
        const quantity = item.quantity;
        return {
          protein: total.protein + (item.protein || 0) * quantity,
          carbs: total.carbs + (item.carbs || 0) * quantity,
          fat: total.fat + (item.fat || 0) * quantity,
          fiber: total.fiber + (item.fiber || 0) * quantity,
          sodium: total.sodium + (item.sodium || 0) * quantity,
        };
      },
      { protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
    );

    return {
      itemCount,
      totalPrice,
      totalCalories: caloriesConsumed,
      totalNutrition,
      averageCaloriesPerItem:
        itemCount > 0 ? Math.round(caloriesConsumed / itemCount) : 0,
    };
  }, [cart, caloriesConsumed]);

  const healthAnalysis = useMemo(() => {
    const { totalNutrition, totalCalories } = cartStats;

    const proteinCalories = totalNutrition.protein * 4;
    const carbsCalories = totalNutrition.carbs * 4;
    const fatCalories = totalNutrition.fat * 9;

    const proteinPercent =
      totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
    const carbsPercent =
      totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
    const fatPercent =
      totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

    const recommendations = [];

    if (proteinPercent < 10) {
      recommendations.push({
        type: "warning",
        message: "Cần thêm protein (khuyến nghị 10-35%)",
      });
    } else if (proteinPercent > 35) {
      recommendations.push({
        type: "warning",
        message: "Quá nhiều protein, cân bằng với carbs",
      });
    }

    if (carbsPercent < 45) {
      recommendations.push({
        type: "info",
        message: "Có thể thêm carbs lành mạnh (khuyến nghị 45-65%)",
      });
    } else if (carbsPercent > 65) {
      recommendations.push({
        type: "warning",
        message: "Quá nhiều carbs, cân bằng với protein",
      });
    }

    if (fatPercent > 35) {
      recommendations.push({
        type: "warning",
        message: "Quá nhiều chất béo (khuyến nghị 20-35%)",
      });
    }

    if (totalNutrition.sodium > 2300) {
      recommendations.push({
        type: "danger",
        message: "Quá nhiều sodium, hạn chế muối",
      });
    }

    return {
      proteinPercent: Math.round(proteinPercent),
      carbsPercent: Math.round(carbsPercent),
      fatPercent: Math.round(fatPercent),
      recommendations,
      healthScore: Math.max(0, 100 - recommendations.length * 15),
    };
  }, [cartStats]);

  const getSuggestions = (allDishes, targetCalories = 2000) => {
    const remainingCalories = targetCalories - caloriesConsumed;
    const { totalNutrition } = cartStats;

    if (remainingCalories <= 0) return [];

    return allDishes
      .filter(
        (dish) =>
          dish.available &&
          dish.calories <= remainingCalories &&
          !cart.some((cartItem) => cartItem.id === dish.id)
      )
      .map((dish) => {
        let score = 0;

        if (totalNutrition.protein < 50 && dish.protein > 15) score += 30;
        if (totalNutrition.fiber < 25 && dish.fiber > 5) score += 20;
        if (dish.vitamins && dish.vitamins.length > 0) score += 10;

        const caloriesFit = Math.abs(dish.calories - remainingCalories / 2);
        score += Math.max(0, 20 - caloriesFit / 10);

        return { ...dish, suggestionScore: score };
      })
      .sort((a, b) => b.suggestionScore - a.suggestionScore)
      .slice(0, 5);
  };

  const clearCart = () => {
    setCart([]);
    setCaloriesConsumed(0);
  };

  return {
    cart,
    caloriesConsumed,
    cartStats,
    healthAnalysis,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getSuggestions,
  };
}
