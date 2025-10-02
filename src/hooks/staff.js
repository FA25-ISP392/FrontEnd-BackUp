import { useState } from 'react';

// Hook để quản lý staff authentication
export function useStaffAuth() {
  const [activeRole, setActiveRole] = useState('');
  const [credentials, setCredentials] = useState({
    admin: { username: '', password: '' },
    manager: { username: '', password: '' },
    staff: { username: '', password: '' },
    chef: { username: '', password: '' },
  });
  const [showPasswords, setShowPasswords] = useState({
    admin: false,
    manager: false,
    staff: false,
    chef: false,
  });
  const [notifications, setNotifications] = useState('');
  const [loginForms, setLoginForms] = useState({
    admin: false,
    manager: false,
    staff: false,
    chef: false,
  });

  const updateCredentials = (role, field, value) => {
    setCredentials(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (role) => {
    setShowPasswords(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  const toggleLoginForm = (role) => {
    setLoginForms(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  const handleLogin = async (role, e) => {
    e.preventDefault();

    const { username, password } = credentials[role];

    if (!username || !password) {
      setNotifications('Please enter both username and password');
      setTimeout(() => setNotifications(''), 3000);
      return;
    }

    try {
      // Simulate API call
      const response = await fetch(`/api/auth/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Redirect to respective dashboard
        if (role === 'staff') {
          window.location.href = '/staff-dashboard';
        } else {
          window.location.href = `/${role}`;
        }
      } else {
        setNotifications('Invalid credentials or role access denied');
        setTimeout(() => setNotifications(''), 3000);
      }
    } catch (error) {
      setNotifications('Login system is currently unavailable');
      setTimeout(() => setNotifications(''), 3000);
    }
  };

  const clearNotifications = () => setNotifications('');

  return {
    activeRole,
    setActiveRole,
    credentials,
    showPasswords,
    notifications,
    loginForms,
    updateCredentials,
    togglePasswordVisibility,
    toggleLoginForm,
    handleLogin,
    clearNotifications
  };
}

// Hook để quản lý staff dashboard
export function useStaffDashboard() {
  const [staffName] = useState('Staff User');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('staff_token');
    window.location.href = '/';
  };

  return {
    staffName,
    activeSection,
    setActiveSection,
    isProfileOpen,
    setIsProfileOpen,
    handleLogout
  };
}

// Hook để quản lý staff tables
export function useStaffTables(initialTables = []) {
  const [tables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState(null);

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'reserved': return 'bg-yellow-500';
      case 'cleaning': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTableStatusText = (status) => {
    switch (status) {
      case 'occupied': return 'Đang phục vụ';
      case 'available': return 'Trống';
      case 'reserved': return 'Đã đặt';
      case 'cleaning': return 'Đang dọn';
      default: return status;
    }
  };

  const getTableStats = () => {
    const totalRevenue = tables.reduce((sum, table) => sum + table.totalAmount, 0);
    const occupiedTables = tables.filter(table => table.status === 'occupied').length;
    const availableTables = tables.filter(table => table.status === 'available').length;
    const callStaffCount = tables.filter(table => table.callStaff).length;

    return { totalRevenue, occupiedTables, availableTables, callStaffCount };
  };

  return {
    tables,
    selectedTable,
    setSelectedTable,
    getTableStatusColor,
    getTableStatusText,
    getTableStats
  };
}

// Hook để quản lý staff orders
export function useStaffOrders(initialOrders = []) {
  const [orders] = useState(initialOrders);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Đang chuẩn bị';
      case 'ready': return 'Sẵn sàng';
      case 'served': return 'Đã phục vụ';
      default: return status;
    }
  };

  const getOrdersByTable = (tableId) => {
    return orders.filter(order => order.table === tableId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  return {
    orders,
    getOrderStatusColor,
    getOrderStatusText,
    getOrdersByTable,
    getOrdersByStatus
  };
}
