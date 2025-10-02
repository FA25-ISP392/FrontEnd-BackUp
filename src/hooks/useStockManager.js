import { useState, useEffect, useMemo } from 'react';

/**
 * Hook quản lý kho và hiển thị món ăn
 * Trích xuất từ DishesStockVisibility.jsx
 */
export function useStockManager() {
  const HIDDEN_KEY = "hidden_dishes";
  const STOCK_KEY = "dish_stock";

  // Thuật toán load dữ liệu từ localStorage
  const loadHidden = () => {
    try {
      return JSON.parse(localStorage.getItem(HIDDEN_KEY)) || [];
    } catch (_) {
      return [];
    }
  };

  const loadStock = () => {
    try {
      return JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
    } catch (_) {
      return {};
    }
  };

  const [hidden, setHidden] = useState(loadHidden());
  const [stock, setStock] = useState(loadStock());

  // Thuật toán đồng bộ với localStorage
  useEffect(() => {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(hidden));
  }, [hidden]);

  useEffect(() => {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
  }, [stock]);

  // Thuật toán toggle hiển thị món ăn
  const toggleVisibility = (dishName) => {
    setHidden((prev) =>
      prev.includes(dishName)
        ? prev.filter((n) => n !== dishName)
        : [...prev, dishName]
    );
  };

  // Thuật toán cập nhật số lượng kho
  const updateStock = (dishName, delta) => {
    setStock((prev) => {
      const next = { ...prev };
      const current = Number.isFinite(prev[dishName]) ? prev[dishName] : 0;
      next[dishName] = Math.max(0, current + delta);
      return next;
    });
  };

  // Thuật toán set số lượng kho trực tiếp
  const setStockQuantity = (dishName, quantity) => {
    setStock((prev) => ({
      ...prev,
      [dishName]: Math.max(0, quantity)
    }));
  };

  // Thuật toán batch update nhiều món
  const batchUpdateStock = (updates) => {
    setStock((prev) => {
      const next = { ...prev };
      updates.forEach(({ dishName, quantity }) => {
        next[dishName] = Math.max(0, quantity);
      });
      return next;
    });
  };

  // Thuật toán phân tích kho
  const stockAnalysis = useMemo(() => {
    const stockEntries = Object.entries(stock);
    const totalItems = stockEntries.reduce((sum, [_, quantity]) => sum + quantity, 0);
    const outOfStock = stockEntries.filter(([_, quantity]) => quantity === 0).length;
    const lowStock = stockEntries.filter(([_, quantity]) => quantity > 0 && quantity <= 5).length;
    const inStock = stockEntries.filter(([_, quantity]) => quantity > 5).length;

    return {
      totalItems,
      outOfStock,
      lowStock,
      inStock,
      totalDishes: stockEntries.length,
      averageStock: stockEntries.length > 0 ? Math.round(totalItems / stockEntries.length) : 0
    };
  }, [stock]);

  // Thuật toán cảnh báo kho
  const getStockAlerts = (dishes = []) => {
    const alerts = [];
    
    dishes.forEach(dish => {
      const quantity = stock[dish.name] || 0;
      const isHidden = hidden.includes(dish.name);
      
      if (quantity === 0 && !isHidden) {
        alerts.push({
          type: 'danger',
          dishName: dish.name,
          message: `${dish.name} đã hết hàng nhưng vẫn hiển thị trên menu`
        });
      } else if (quantity <= 2 && quantity > 0) {
        alerts.push({
          type: 'warning',
          dishName: dish.name,
          message: `${dish.name} sắp hết hàng (còn ${quantity})`
        });
      } else if (quantity <= 5 && quantity > 2) {
        alerts.push({
          type: 'info',
          dishName: dish.name,
          message: `${dish.name} sắp cần nhập thêm (còn ${quantity})`
        });
      }
    });

    return alerts.sort((a, b) => {
      const priority = { danger: 3, warning: 2, info: 1 };
      return priority[b.type] - priority[a.type];
    });
  };

  // Thuật toán auto-hide món hết hàng
  const autoHideOutOfStock = (dishes = []) => {
    const dishesToHide = dishes
      .filter(dish => (stock[dish.name] || 0) === 0 && !hidden.includes(dish.name))
      .map(dish => dish.name);
    
    if (dishesToHide.length > 0) {
      setHidden(prev => [...prev, ...dishesToHide]);
      return dishesToHide;
    }
    return [];
  };

  // Thuật toán auto-show món có hàng
  const autoShowInStock = (dishes = []) => {
    const dishesToShow = dishes
      .filter(dish => (stock[dish.name] || 0) > 0 && hidden.includes(dish.name))
      .map(dish => dish.name);
    
    if (dishesToShow.length > 0) {
      setHidden(prev => prev.filter(name => !dishesToShow.includes(name)));
      return dishesToShow;
    }
    return [];
  };

  // Thuật toán dự đoán nhu cầu kho
  const predictStockNeeds = (dishes = [], salesHistory = []) => {
    return dishes.map(dish => {
      const currentStock = stock[dish.name] || 0;
      
      // Tính trung bình bán trong 7 ngày qua
      const recentSales = salesHistory
        .filter(sale => sale.dishName === dish.name && 
                       new Date(sale.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .reduce((sum, sale) => sum + sale.quantity, 0);
      
      const avgDailySales = recentSales / 7;
      const daysRemaining = avgDailySales > 0 ? Math.floor(currentStock / avgDailySales) : Infinity;
      
      let recommendation = 'Đủ hàng';
      let priority = 'low';
      
      if (daysRemaining <= 1) {
        recommendation = 'Cần nhập gấp';
        priority = 'high';
      } else if (daysRemaining <= 3) {
        recommendation = 'Nên nhập trong 1-2 ngày';
        priority = 'medium';
      } else if (daysRemaining <= 7) {
        recommendation = 'Chuẩn bị nhập hàng';
        priority = 'low';
      }
      
      return {
        dishName: dish.name,
        currentStock,
        avgDailySales: Math.round(avgDailySales * 10) / 10,
        daysRemaining: daysRemaining === Infinity ? '∞' : daysRemaining,
        recommendation,
        priority,
        suggestedOrder: Math.max(0, Math.ceil(avgDailySales * 14 - currentStock)) // 2 tuần
      };
    });
  };

  return {
    hidden,
    stock,
    stockAnalysis,
    toggleVisibility,
    updateStock,
    setStockQuantity,
    batchUpdateStock,
    getStockAlerts,
    autoHideOutOfStock,
    autoShowInStock,
    predictStockNeeds,
    isHidden: (dishName) => hidden.includes(dishName),
    getStock: (dishName) => stock[dishName] || 0
  };
}
