import { useState, useMemo } from 'react';

/**
 * Hook tính toán giỏ hàng với calories và dinh dưỡng
 * Trích xuất từ Menu.jsx
 */
export function useCartCalculator() {
  const [cart, setCart] = useState([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  // Thuật toán thêm món vào giỏ hàng
  const addToCart = (dish, notes = '') => {
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

  // Thuật toán cập nhật số lượng
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

  // Thuật toán xóa món khỏi giỏ hàng
  const removeFromCart = (itemId) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      setCaloriesConsumed(
        (prev) => prev - (item.totalCalories || item.calories) * item.quantity
      );
    }
  };

  // Tính toán thống kê giỏ hàng
  const cartStats = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Tính tổng dinh dưỡng
    const totalNutrition = cart.reduce((total, item) => {
      const quantity = item.quantity;
      return {
        protein: total.protein + (item.protein || 0) * quantity,
        carbs: total.carbs + (item.carbs || 0) * quantity,
        fat: total.fat + (item.fat || 0) * quantity,
        fiber: total.fiber + (item.fiber || 0) * quantity,
        sodium: total.sodium + (item.sodium || 0) * quantity
      };
    }, { protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 });

    return {
      itemCount,
      totalPrice,
      totalCalories: caloriesConsumed,
      totalNutrition,
      averageCaloriesPerItem: itemCount > 0 ? Math.round(caloriesConsumed / itemCount) : 0
    };
  }, [cart, caloriesConsumed]);

  // Thuật toán phân tích sức khỏe của giỏ hàng
  const healthAnalysis = useMemo(() => {
    const { totalNutrition, totalCalories } = cartStats;
    
    // Phân tích cân bằng dinh dưỡng (theo tỷ lệ khuyến nghị)
    const proteinCalories = totalNutrition.protein * 4; // 1g protein = 4 calories
    const carbsCalories = totalNutrition.carbs * 4;     // 1g carbs = 4 calories  
    const fatCalories = totalNutrition.fat * 9;         // 1g fat = 9 calories
    
    const proteinPercent = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
    const carbsPercent = totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
    const fatPercent = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

    // Đánh giá theo khuyến nghị dinh dưỡng
    const recommendations = [];
    
    if (proteinPercent < 10) {
      recommendations.push({ type: 'warning', message: 'Cần thêm protein (khuyến nghị 10-35%)' });
    } else if (proteinPercent > 35) {
      recommendations.push({ type: 'warning', message: 'Quá nhiều protein, cân bằng với carbs' });
    }
    
    if (carbsPercent < 45) {
      recommendations.push({ type: 'info', message: 'Có thể thêm carbs lành mạnh (khuyến nghị 45-65%)' });
    } else if (carbsPercent > 65) {
      recommendations.push({ type: 'warning', message: 'Quá nhiều carbs, cân bằng với protein' });
    }
    
    if (fatPercent > 35) {
      recommendations.push({ type: 'warning', message: 'Quá nhiều chất béo (khuyến nghị 20-35%)' });
    }
    
    if (totalNutrition.sodium > 2300) {
      recommendations.push({ type: 'danger', message: 'Quá nhiều sodium, hạn chế muối' });
    }

    return {
      proteinPercent: Math.round(proteinPercent),
      carbsPercent: Math.round(carbsPercent),
      fatPercent: Math.round(fatPercent),
      recommendations,
      healthScore: Math.max(0, 100 - recommendations.length * 15) // Điểm sức khỏe
    };
  }, [cartStats]);

  // Thuật toán gợi ý món bổ sung
  const getSuggestions = (allDishes, targetCalories = 2000) => {
    const remainingCalories = targetCalories - caloriesConsumed;
    const { totalNutrition } = cartStats;
    
    if (remainingCalories <= 0) return [];
    
    return allDishes
      .filter(dish => 
        dish.available && 
        dish.calories <= remainingCalories &&
        !cart.some(cartItem => cartItem.id === dish.id)
      )
      .map(dish => {
        let score = 0;
        
        // Ưu tiên món bổ sung dinh dưỡng thiếu
        if (totalNutrition.protein < 50 && dish.protein > 15) score += 30;
        if (totalNutrition.fiber < 25 && dish.fiber > 5) score += 20;
        if (dish.vitamins && dish.vitamins.length > 0) score += 10;
        
        // Ưu tiên món phù hợp với calories còn lại
        const caloriesFit = Math.abs(dish.calories - (remainingCalories / 2));
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
    getSuggestions
  };
}
