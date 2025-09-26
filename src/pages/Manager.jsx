import { useState } from 'react';
import { BarChart3, Users, Package, TrendingUp, Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Clock, AlertCircle } from 'lucide-react';
import ManagerHeader from '../components/ManagerHeader';

export default function Manager() {
  const [activeSection, setActiveSection] = useState('revenue');
  const [managerName] = useState('Manager User');
  const [revenueData] = useState({ daily: 1250, cash: 450, card: 800, shiftTotal: 1250 });
  const [dishes] = useState([
    { id: 1, name: 'Caesar Salad', price: 12.99, category: 'salads', inStock: true, visible: true },
    { id: 2, name: 'Grilled Chicken', price: 18.99, category: 'mains', inStock: true, visible: true },
    { id: 3, name: 'Pasta Carbonara', price: 16.99, category: 'pasta', inStock: false, visible: false }
  ]);
  const [accounts] = useState([
    { id: 1, username: 'manager1', name: 'John Manager', email: 'john@restaurant.com', role: 'manager' },
    { id: 2, username: 'staff1', name: 'Jane Staff', email: 'jane@restaurant.com', role: 'staff' },
    { id: 3, username: 'chef1', name: 'Mike Chef', email: 'mike@restaurant.com', role: 'chef' }
  ]);

  const sidebarItems = [
    { id: 'revenue', label: 'Daily Revenue Report', icon: BarChart3 },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'accounts', label: 'Account Management', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <ManagerHeader userName={managerName} />
      
      <div className="flex">
        <div className="w-64 bg-white border-r min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Welcome, {managerName}</h2>
            <nav className="space-y-2">
              {sidebarItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === id ? 'bg-blue-100 text-blue-700' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 p-6">
          {activeSection === 'revenue' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Daily Revenue Report</h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">${revenueData.daily}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Cash Payments</p>
                      <p className="text-2xl font-bold text-blue-600">${revenueData.cash}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Card Payments</p>
                      <p className="text-2xl font-bold text-purple-600">${revenueData.card}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Shift Total</p>
                      <p className="text-2xl font-bold text-orange-600">${revenueData.shiftTotal}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Product Management</h1>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Today's Menu Items</h3>
                  <p className="text-neutral-600 text-sm">Manage dish availability and visibility</p>
                </div>
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Dish Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dishes.map((dish) => (
                      <tr key={dish.id} className="border-t">
                        <td className="px-6 py-4 text-sm font-medium">{dish.name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 capitalize">{dish.category}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">${dish.price}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dish.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {dish.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'accounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Account Management</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Account
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id} className="border-t">
                        <td className="px-6 py-4 text-sm font-medium">{account.username}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{account.name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{account.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            account.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            account.role === 'chef' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {account.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
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
          )}
        </div>
      </div>
    </div>
  );
}


