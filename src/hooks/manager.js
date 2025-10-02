import { useState } from 'react';
import { useLocalStorage } from './common';

// Hook để quản lý dish visibility và stock
export function useDishVisibility() {
  const [hidden, setHidden] = useLocalStorage('hidden_dishes', []);
  const [stock, setStock] = useLocalStorage('dish_stock', {});

  const toggleVisibility = (dishName) => {
    setHidden((prev) =>
      prev.includes(dishName)
        ? prev.filter((n) => n !== dishName)
        : [...prev, dishName],
    );
  };

  const updateStock = (dishName, delta) => {
    setStock((prev) => {
      const next = { ...prev };
      const current = Number.isFinite(prev[dishName]) ? prev[dishName] : 0;
      next[dishName] = Math.max(0, current + delta);
      return next;
    });
  };

  const isHidden = (dishName) => hidden.includes(dishName);
  const getStock = (dishName) => stock[dishName] || 0;

  return {
    hidden,
    stock,
    toggleVisibility,
    updateStock,
    isHidden,
    getStock
  };
}

// Hook để quản lý manager tables
export function useManagerTables(initialTables = []) {
  const [tables, setTables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState(null);

  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, currentOrder: updatedOrder } : table,
      ),
    );
  };

  const updateTableStatus = (tableId, status) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  const getTableStats = () => {
    const totalTables = tables.length;
    const occupiedTables = tables.filter(table => table.status === 'occupied').length;
    const availableTables = tables.filter(table => table.status === 'available').length;
    const reservedTables = tables.filter(table => table.status === 'reserved').length;
    const totalRevenue = tables.reduce((sum, table) => sum + (table.totalAmount || 0), 0);
    
    return { totalTables, occupiedTables, availableTables, reservedTables, totalRevenue };
  };

  return {
    tables,
    setTables,
    selectedTable,
    setSelectedTable,
    updateOrderStatus,
    updateTableStatus,
    getTableStats
  };
}

// Hook để quản lý dish requests trong manager
export function useManagerDishRequests() {
  const [dishRequests, setDishRequests] = useState([]);

  const handleApproveRequest = (requestId) => {
    // Update request status in data source
    updateDishRequest(requestId, { status: 'approved' });
    // Reload requests
    setDishRequests(getDishRequests());
  };

  const handleRejectRequest = (requestId) => {
    updateDishRequest(requestId, { status: 'rejected' });
    setDishRequests(getDishRequests());
  };

  const addDishRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setDishRequests(prev => [...prev, newRequest]);
    return newRequest;
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
    handleApproveRequest,
    handleRejectRequest,
    addDishRequest,
    getRequestStats
  };
}

// Hook để quản lý manager accounts
export function useManagerAccounts(initialAccounts = []) {
  const [accounts, setAccounts] = useState(initialAccounts);

  const saveAccount = (accountData) => {
    if (accountData.id && accounts.find((acc) => acc.id === accountData.id)) {
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === accountData.id ? accountData : acc,
        ),
      );
    } else {
      setAccounts((prevAccounts) => [...prevAccounts, accountData]);
    }
  };

  const deleteAccount = (accountId) => {
    setAccounts((prevAccounts) =>
      prevAccounts.filter((acc) => acc.id !== accountId),
    );
  };

  return {
    accounts,
    setAccounts,
    saveAccount,
    deleteAccount
  };
}

// Hook để quản lý revenue data trong manager
export function useManagerRevenue(initialData = []) {
  const [revenueData] = useState(initialData);
  const [revenuePeriod, setRevenuePeriod] = useState('day');

  const getTotalRevenue = () => {
    return revenueData.reduce((sum, item) => sum + item.revenue, 0);
  };

  const getRevenueByPeriod = () => {
    // Filter revenue data based on selected period
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
          return itemDate.getMonth() === now.getMonth();
        default:
          return true;
      }
    });
  };

  return {
    revenueData,
    revenuePeriod,
    setRevenuePeriod,
    getTotalRevenue,
    getRevenueByPeriod
  };
}
