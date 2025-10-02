import { useState } from 'react';

// Hook để quản lý orders trong chef
export function useChefOrders(initialOrders = []) {
  const [orders, setOrders] = useState(initialOrders);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getOrderStats = () => {
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const preparingOrders = orders.filter(order => order.status === 'preparing').length;
    const readyOrders = orders.filter(order => order.status === 'ready').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    
    return { pendingOrders, preparingOrders, readyOrders, completedOrders };
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const assignChefToOrder = (orderId, chefName) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, assignedChef: chefName } : order
      )
    );
  };

  return {
    orders,
    setOrders,
    updateOrderStatus,
    getOrderStats,
    getOrdersByStatus,
    assignChefToOrder
  };
}

// Hook để quản lý dish quantities
export function useChefDishQuantities(initialDishes = []) {
  const [dishes, setDishes] = useState(initialDishes);
  const [quantities, setQuantities] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const handleQuantityChange = (dishId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
    }));
  };

  const updateDishAvailability = (dishId, available) => {
    setDishes(prev =>
      prev.map(dish =>
        dish.id === dishId ? { ...dish, available } : dish
      )
    );
  };

  const getDishStats = () => {
    const totalDishes = dishes.length;
    const availableDishes = dishes.filter(dish => dish.status === 'available').length;
    const outOfStockDishes = dishes.filter(dish => dish.stock === 0).length;
    
    return { totalDishes, availableDishes, outOfStockDishes };
  };

  return {
    dishes,
    setDishes,
    quantities,
    setQuantities,
    loadingId,
    setLoadingId,
    handleQuantityChange,
    updateDishAvailability,
    getDishStats
  };
}

// Hook để quản lý dish requests
export function useChefDishRequests(initialRequests = []) {
  const [dishRequests, setDishRequests] = useState(initialRequests);

  const submitDishRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      createdAt: Date.now(),
      status: 'pending',
    };
    setDishRequests((prev) => [...prev, newRequest]);
    return newRequest;
  };

  const updateRequestStatus = (requestId, status) => {
    setDishRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  const deleteRequest = (requestId) => {
    setDishRequests(prev => prev.filter(request => request.id !== requestId));
  };

  const getRequestStats = () => {
    const totalRequests = dishRequests.length;
    const pendingRequests = dishRequests.filter(req => req.status === 'pending').length;
    const approvedRequests = dishRequests.filter(req => req.status === 'approved').length;
    const rejectedRequests = dishRequests.filter(req => req.status === 'rejected').length;
    
    return { totalRequests, pendingRequests, approvedRequests, rejectedRequests };
  };

  return {
    dishRequests,
    setDishRequests,
    submitDishRequest,
    updateRequestStatus,
    deleteRequest,
    getRequestStats
  };
}

// Hook để quản lý chef stats
export function useChefStats() {
  const [totalRevenue] = useState(1250.5); // Mock total revenue

  const calculateDailyStats = (orders) => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );
    
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const ordersCompleted = todayOrders.filter(order => order.status === 'completed').length;
    
    return { todayRevenue, ordersCompleted, todayOrders: todayOrders.length };
  };

  return {
    totalRevenue,
    calculateDailyStats
  };
}
