import { useState, useEffect } from 'react';

// Hook để quản lý giỏ hàng
export function useCart() {
  const [cart, setCart] = useState([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

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

  const clearCart = () => {
    setCart([]);
    setCaloriesConsumed(0);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cart,
    caloriesConsumed,
    cartItemCount,
    cartTotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
  };
}

// Hook để quản lý bàn
export function useTables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const updateTableStatus = (tableId, status) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, currentOrder: updatedOrder } : table
      )
    );
  };

  const getTableStats = () => {
    const occupied = tables.filter(table => table.status === 'occupied').length;
    const available = tables.filter(table => table.status === 'available').length;
    const reserved = tables.filter(table => table.status === 'reserved').length;
    const cleaning = tables.filter(table => table.status === 'cleaning').length;
    const callStaffCount = tables.filter(table => table.callStaff).length;

    return { occupied, available, reserved, cleaning, callStaffCount };
  };

  return {
    tables,
    setTables,
    selectedTable,
    setSelectedTable,
    updateTableStatus,
    updateOrderStatus,
    getTableStats
  };
}

// Hook để quản lý đơn hàng
export function useOrders() {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrdersByTable = (tableId) => {
    return orders.filter(order => order.tableId === tableId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  return {
    orders,
    setOrders,
    addOrder,
    updateOrderStatus,
    getOrdersByTable,
    getOrdersByStatus
  };
}

// Hook để quản lý món ăn
export function useDishes() {
  const [dishes, setDishes] = useState([]);
  const [hiddenDishes, setHiddenDishes] = useState([]);

  useEffect(() => {
    // Load hidden dishes from localStorage
    try {
      const hidden = JSON.parse(localStorage.getItem('hidden_dishes')) || [];
      setHiddenDishes(hidden);
    } catch (error) {
      console.error('Error loading hidden dishes:', error);
    }
  }, []);

  const hideDish = (dishName) => {
    const newHidden = [...hiddenDishes, dishName];
    setHiddenDishes(newHidden);
    localStorage.setItem('hidden_dishes', JSON.stringify(newHidden));
  };

  const showDish = (dishName) => {
    const newHidden = hiddenDishes.filter(name => name !== dishName);
    setHiddenDishes(newHidden);
    localStorage.setItem('hidden_dishes', JSON.stringify(newHidden));
  };

  const getVisibleDishes = () => {
    return dishes.filter(dish => 
      dish.available && !hiddenDishes.includes(dish.name)
    );
  };

  const updateDishAvailability = (dishId, available) => {
    setDishes((prevDishes) =>
      prevDishes.map((dish) =>
        dish.id === dishId ? { ...dish, available } : dish
      )
    );
  };

  return {
    dishes,
    setDishes,
    hiddenDishes,
    hideDish,
    showDish,
    getVisibleDishes,
    updateDishAvailability
  };
}

// Hook để quản lý cá nhân hóa menu
export function usePersonalization() {
  const [personalizedMenu, setPersonalizedMenu] = useState([]);
  const [estimatedCalories, setEstimatedCalories] = useState(2000);

  const getPersonalizedDishes = (allDishes, form) => {
    return allDishes.filter((dish) => {
      // Filter based on preferences
      if (form.preferences.includes('spicy') && !dish.spicy) return false;
      if (form.preferences.includes('fatty') && !dish.fatty) return false;
      if (form.preferences.includes('sweet') && !dish.sweet) return false;

      // Filter based on goal
      if (form.goal === 'lose' && dish.calories > 300) return false;
      if (form.goal === 'gain' && dish.calories < 200) return false;

      return dish.available;
    });
  };

  const calculateEstimatedCalories = (form) => {
    const bmi = form.weight / Math.pow(form.height / 100, 2);
    if (bmi < 18.5) return 2200; // Underweight
    if (bmi < 25) return 2000; // Normal weight
    if (bmi < 30) return 1800; // Overweight
    return 1600; // Obese
  };

  const applyPersonalization = (allDishes, form) => {
    const personalized = getPersonalizedDishes(allDishes, form);
    setPersonalizedMenu(personalized);
    setEstimatedCalories(calculateEstimatedCalories(form));
  };

  return {
    personalizedMenu,
    estimatedCalories,
    applyPersonalization,
    getPersonalizedDishes,
    calculateEstimatedCalories
  };
}
