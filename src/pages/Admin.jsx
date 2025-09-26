import { useState } from 'react';
import { BarChart3, Users, Package, TrendingUp, Plus, Edit, Trash2, DollarSign, ChefHat, FileText, Save, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Admin() {
  const [adminName] = useState('Admin User');
  const [activeSection, setActiveSection] = useState('overview');
  const [revenuePeriod, setRevenuePeriod] = useState('day');
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Mock data
  const [accounts, setAccounts] = useState([
    { id: 1, username: 'admin', role: 'admin', email: 'admin@restaurant.com', status: 'active', created: '2024-01-01' },
    { id: 2, username: 'manager1', role: 'manager', email: 'manager1@restaurant.com', status: 'active', created: '2024-01-02' },
    { id: 3, username: 'staff1', role: 'staff', email: 'staff1@restaurant.com', status: 'active', created: '2024-01-03' },
    { id: 4, username: 'chef1', role: 'chef', email: 'chef1@restaurant.com', status: 'active', created: '2024-01-04' }
  ]);

  const [dishes, setDishes] = useState([
    { id: 1, name: 'Pizza Margherita', price: 18.99, category: 'Pizza', status: 'available', calories: 280 },
    { id: 2, name: 'Pasta Carbonara', price: 16.99, category: 'Pasta', status: 'available', calories: 320 },
    { id: 3, name: 'Grilled Salmon', price: 24.99, category: 'Main Course', status: 'available', calories: 250 },
    { id: 4, name: 'Caesar Salad', price: 12.99, category: 'Salad', status: 'unavailable', calories: 180 }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 1, table: 1, amount: 89.50, time: '14:30', date: '2024-01-15', paymentMethod: 'Cash', status: 'paid' },
    { id: 2, table: 3, amount: 45.20, time: '15:00', date: '2024-01-15', paymentMethod: 'Card', status: 'paid' },
    { id: 3, table: 5, amount: 67.80, time: '14:45', date: '2024-01-15', paymentMethod: 'Cash', status: 'paid' },
    { id: 4, table: 7, amount: 125.40, time: '15:15', date: '2024-01-15', paymentMethod: 'Card', status: 'pending' }
  ]);

  // Chart data
  const dailyRevenueData = [
    { time: '08:00', revenue: 120 },
    { time: '10:00', revenue: 180 },
    { time: '12:00', revenue: 320 },
    { time: '14:00', revenue: 280 },
    { time: '16:00', revenue: 200 },
    { time: '18:00', revenue: 450 },
    { time: '20:00', revenue: 380 },
    { time: '22:00', revenue: 150 }
  ];

  const dishSalesData = [
    { name: 'Pizza Margherita', sales: 45, color: '#f97316' },
    { name: 'Pasta Carbonara', sales: 32, color: '#dc2626' },
    { name: 'Grilled Salmon', sales: 28, color: '#10b981' },
    { name: 'Caesar Salad', sales: 38, color: '#3b82f6' },
    { name: 'Beef Burger', sales: 25, color: '#8b5cf6' }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Tổng Quan', icon: BarChart3 },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'accounts', label: 'Quản Lý Tài Khoản', icon: Users },
    { id: 'dishes', label: 'Quản Lý Món Ăn', icon: Package },
    { id: 'invoices', label: 'Hóa Đơn & Doanh Thu', icon: FileText }
  ];

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalEmployees = accounts.length;
  const totalDishes = dishes.length;
  const availableDishes = dishes.filter(dish => dish.status === 'available').length;

  const handleEditAccount = (account) => {
    setEditingItem(account);
    setIsEditingAccount(true);
  };

  const handleEditDish = (dish) => {
    setEditingItem(dish);
    setIsEditingDish(true);
  };

  const handleDeleteAccount = (id) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleDeleteDish = (id) => {
    setDishes(dishes.filter(dish => dish.id !== id));
  };

  const handleSaveAccount = (accountData) => {
    if (editingItem) {
      setAccounts(accounts.map(account => 
        account.id === editingItem.id ? { ...account, ...accountData } : account
      ));
    } else {
      setAccounts([...accounts, { ...accountData, id: Date.now() }]);
    }
    setIsEditingAccount(false);
    setEditingItem(null);
  };

  const handleSaveDish = (dishData) => {
    if (editingItem) {
      setDishes(dishes.map(dish => 
        dish.id === editingItem.id ? { ...dish, ...dishData } : dish
      ));
    } else {
      setDishes([...dishes, { ...dishData, id: Date.now() }]);
    }
    setIsEditingDish(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-neutral-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Quản Trị Hệ Thống</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Chào mừng, {adminName}!
            </h1>
            <p className="text-neutral-600">
              Quản lý toàn bộ hệ thống nhà hàng từ đây
            </p>
          </div>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card hover-lift">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-600 text-sm">Tổng Doanh Thu</p>
                        <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="card hover-lift">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-600 text-sm">Tổng Nhân Viên</p>
                        <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="card hover-lift">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-600 text-sm">Món Ăn Có Sẵn</p>
                        <p className="text-2xl font-bold text-orange-600">{availableDishes}</p>
                      </div>
                      <Package className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="card hover-lift">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-600 text-sm">Hóa Đơn Hôm Nay</p>
                        <p className="text-2xl font-bold text-purple-600">{invoices.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold">Doanh Thu Theo Giờ</h3>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dailyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold">Món Bán Chạy</h3>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dishSalesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="sales"
                        >
                          {dishSalesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Revenue Chart */}
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Biểu Đồ Doanh Thu</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setRevenuePeriod('day')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          revenuePeriod === 'day'
                            ? 'bg-orange-500 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        Ngày
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dailyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Employee Statistics */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold">Thống Kê Nhân Viên</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">Tổng Nhân Viên</p>
                      <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <ChefHat className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">Đầu Bếp</p>
                      <p className="text-2xl font-bold text-green-600">{accounts.filter(a => a.role === 'chef').length}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">Quản Lý</p>
                      <p className="text-2xl font-bold text-orange-600">{accounts.filter(a => a.role === 'manager').length}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">Nhân Viên</p>
                      <p className="text-2xl font-bold text-purple-600">{accounts.filter(a => a.role === 'staff').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Management Section */}
          {activeSection === 'accounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Quản Lý Tài Khoản</h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsEditingAccount(true);
                  }}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Tài Khoản
                </button>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 font-semibold">Tên Đăng Nhập</th>
                          <th className="text-left py-3 px-4 font-semibold">Vai Trò</th>
                          <th className="text-left py-3 px-4 font-semibold">Email</th>
                          <th className="text-left py-3 px-4 font-semibold">Trạng Thái</th>
                          <th className="text-left py-3 px-4 font-semibold">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((account) => (
                          <tr key={account.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="py-3 px-4 font-medium">{account.username}</td>
                            <td className="py-3 px-4">
                              <span className={`status-badge ${
                                account.role === 'admin' ? 'status-error' :
                                account.role === 'manager' ? 'status-warning' :
                                account.role === 'chef' ? 'status-info' : 'status-neutral'
                              }`}>
                                {account.role === 'admin' ? 'Quản trị viên' :
                                 account.role === 'manager' ? 'Quản lý' :
                                 account.role === 'chef' ? 'Đầu bếp' : 'Nhân viên'}
                              </span>
                            </td>
                            <td className="py-3 px-4">{account.email}</td>
                            <td className="py-3 px-4">
                              <span className={`status-badge ${account.status === 'active' ? 'status-success' : 'status-error'}`}>
                                {account.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditAccount(account)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAccount(account.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dish Management Section */}
          {activeSection === 'dishes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Quản Lý Món Ăn</h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsEditingDish(true);
                  }}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Món Ăn
                </button>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 font-semibold">Tên Món</th>
                          <th className="text-left py-3 px-4 font-semibold">Giá</th>
                          <th className="text-left py-3 px-4 font-semibold">Danh Mục</th>
                          <th className="text-left py-3 px-4 font-semibold">Trạng Thái</th>
                          <th className="text-left py-3 px-4 font-semibold">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dishes.map((dish) => (
                          <tr key={dish.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="py-3 px-4 font-medium">{dish.name}</td>
                            <td className="py-3 px-4">${dish.price}</td>
                            <td className="py-3 px-4">{dish.category}</td>
                            <td className="py-3 px-4">
                              <span className={`status-badge ${dish.status === 'available' ? 'status-success' : 'status-error'}`}>
                                {dish.status === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditDish(dish)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDish(dish.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoices & Revenue Section */}
          {activeSection === 'invoices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Hóa Đơn & Doanh Thu</h2>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 font-semibold">Mã Hóa Đơn</th>
                          <th className="text-left py-3 px-4 font-semibold">Bàn</th>
                          <th className="text-left py-3 px-4 font-semibold">Số Tiền</th>
                          <th className="text-left py-3 px-4 font-semibold">Thời Gian</th>
                          <th className="text-left py-3 px-4 font-semibold">Phương Thức</th>
                          <th className="text-left py-3 px-4 font-semibold">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="py-3 px-4 font-medium">#{invoice.id}</td>
                            <td className="py-3 px-4">Bàn {invoice.table}</td>
                            <td className="py-3 px-4 font-semibold text-green-600">${invoice.amount}</td>
                            <td className="py-3 px-4">{invoice.time}</td>
                            <td className="py-3 px-4">{invoice.paymentMethod}</td>
                            <td className="py-3 px-4">
                              <span className={`status-badge ${invoice.status === 'paid' ? 'status-success' : 'status-warning'}`}>
                                {invoice.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Revenue Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                  <div className="card-body text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">Tổng Doanh Thu</p>
                    <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body text-center">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">Tổng Hóa Đơn</p>
                    <p className="text-2xl font-bold text-blue-600">{invoices.length}</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body text-center">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">Trung Bình/Hóa Đơn</p>
                    <p className="text-2xl font-bold text-orange-600">${(totalRevenue / invoices.length).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Edit Modal */}
      {isEditingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingItem ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
              </h2>
              <button
                onClick={() => setIsEditingAccount(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSaveAccount({
                  username: formData.get('username'),
                  role: formData.get('role'),
                  email: formData.get('email'),
                  status: formData.get('status')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Tên Đăng Nhập</label>
                    <input
                      type="text"
                      name="username"
                      defaultValue={editingItem?.username || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Vai Trò</label>
                    <select name="role" defaultValue={editingItem?.role || ''} className="form-input" required>
                      <option value="">Chọn vai trò</option>
                      <option value="admin">Quản trị viên</option>
                      <option value="manager">Quản lý</option>
                      <option value="staff">Nhân viên</option>
                      <option value="chef">Đầu bếp</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingItem?.email || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Trạng Thái</label>
                    <select name="status" defaultValue={editingItem?.status || 'active'} className="form-input">
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button type="submit" className="flex-1 btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAccount(false)}
                    className="flex-1 btn-secondary"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dish Edit Modal */}
      {isEditingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingItem ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
              </h2>
              <button
                onClick={() => setIsEditingDish(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSaveDish({
                  name: formData.get('name'),
                  price: parseFloat(formData.get('price')),
                  category: formData.get('category'),
                  calories: parseInt(formData.get('calories')),
                  status: formData.get('status')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Tên Món Ăn</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem?.name || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Giá ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      defaultValue={editingItem?.price || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Danh Mục</label>
                    <select name="category" defaultValue={editingItem?.category || ''} className="form-input" required>
                      <option value="">Chọn danh mục</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Main Course">Món Chính</option>
                      <option value="Salad">Salad</option>
                      <option value="Dessert">Tráng Miệng</option>
                      <option value="Beverage">Đồ Uống</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Calories</label>
                    <input
                      type="number"
                      name="calories"
                      defaultValue={editingItem?.calories || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Trạng Thái</label>
                    <select name="status" defaultValue={editingItem?.status || 'available'} className="form-input">
                      <option value="available">Có sẵn</option>
                      <option value="unavailable">Không có sẵn</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button type="submit" className="flex-1 btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingDish(false)}
                    className="flex-1 btn-secondary"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

