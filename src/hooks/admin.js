import { useState, useEffect } from 'react';
import { useLocalStorage } from './common';

// Hook để quản lý admin settings
export function useAdminSettings() {
  const [settings, setSettings] = useLocalStorage('admin_settings', {
    theme: 'light',
    language: 'vi',
    currency: 'USD',
    emailNotif: true,
    pushNotif: false,
    compactSidebar: false,
    autoSave: true,
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings, setSettings };
}

// Hook để quản lý accounts
export function useAdminAccounts(initialAccounts = []) {
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

  const getAccountStats = () => {
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter(acc => acc.status === 'active').length;
    const inactiveAccounts = accounts.filter(acc => acc.status === 'inactive').length;
    
    return { totalAccounts, activeAccounts, inactiveAccounts };
  };

  return {
    accounts,
    setAccounts,
    saveAccount,
    deleteAccount,
    getAccountStats
  };
}

// Hook để quản lý dishes trong admin
export function useAdminDishes(initialDishes = []) {
  const [dishes, setDishes] = useState(initialDishes);

  const saveDish = (dishData) => {
    if (dishData.id && dishes.find((dish) => dish.id === dishData.id)) {
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.id === dishData.id ? dishData : dish)),
      );
    } else {
      setDishes((prevDishes) => [...prevDishes, dishData]);
    }
  };

  const deleteDish = (dishId) => {
    setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId));
  };

  const getDishStats = () => {
    const totalDishes = dishes.length;
    const availableDishes = dishes.filter(dish => dish.available).length;
    const unavailableDishes = dishes.filter(dish => !dish.available).length;
    
    return { totalDishes, availableDishes, unavailableDishes };
  };

  return {
    dishes,
    setDishes,
    saveDish,
    deleteDish,
    getDishStats
  };
}

// Hook để quản lý invoices
export function useAdminInvoices(initialInvoices = []) {
  const [invoices, setInvoices] = useState(initialInvoices);

  const addInvoice = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoiceStatus = (invoiceId, status) => {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === invoiceId ? { ...invoice, status } : invoice
      )
    );
  };

  const getInvoiceStats = () => {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
    
    return { totalInvoices, totalRevenue, paidInvoices, pendingInvoices };
  };

  return {
    invoices,
    setInvoices,
    addInvoice,
    updateInvoiceStatus,
    getInvoiceStats
  };
}

// Hook để quản lý revenue data
export function useAdminRevenue(initialData = []) {
  const [revenueData, setRevenueData] = useState(initialData);
  const [revenuePeriod, setRevenuePeriod] = useState('day');

  const getFilteredRevenueData = () => {
    // Filter data based on period
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
        default:
          return true;
      }
    });
  };

  const getTotalRevenue = () => {
    return getFilteredRevenueData().reduce((sum, item) => sum + item.revenue, 0);
  };

  return {
    revenueData,
    setRevenueData,
    revenuePeriod,
    setRevenuePeriod,
    getFilteredRevenueData,
    getTotalRevenue
  };
}
