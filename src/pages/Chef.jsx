import { useState } from 'react';
import { ChefHat, Clock, CheckCircle, XCircle, Home, User, LogOut, X, AlertCircle, Timer, Users } from 'lucide-react';

export default function Chef() {
  const [chefName] = useState('Chef User');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [orders] = useState([
    { id: 1, table: 5, dish: 'Caesar Salad', status: 'preparing', time: '14:30', priority: 'high' },
    { id: 2, table: 3, dish: 'Grilled Chicken', status: 'pending', time: '14:35', priority: 'medium' },
    { id: 3, table: 8, dish: 'Pasta Carbonara', status: 'ready', time: '14:25', priority: 'low' },
    { id: 4, table: 2, dish: 'Margherita Pizza', status: 'preparing', time: '14:40', priority: 'high' }
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    // In a real app, this would update the order status via API
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleLogout = () => {
    window.location.href = '/staff';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 hover:opacity-80 transition"
            aria-label="Reload page"
          >
            <span className="inline-block h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">R</span>
            <span className="text-lg font-semibold">Restaurant</span>
          </button>
          
          <nav className="flex items-center gap-2">
            <button
              onClick={() => window.location.href = '/staff'}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {chefName.charAt(0).toUpperCase()}
              </div>
              <span className="text-neutral-700 font-medium">{chefName}</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome, {chefName}</h1>
          <p className="text-neutral-600">Kitchen orders and preparation queue</p>
        </div>

        {/* Orders by Table */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Orders by Table</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold">Table {order.table}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.priority === 'high' ? 'bg-red-100 text-red-800' :
                    order.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.priority}
                  </span>
                </div>
                
                <div className="mb-3">
                  <h3 className="font-medium">{order.dish}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Clock className="h-4 w-4" />
                    <span>{order.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'ready' ? 'bg-green-100 text-green-800' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    {order.status}
                  </span>
                  
                  <div className="flex gap-1">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="p-1 text-blue-600 hover:text-blue-800 transition"
                        title="Start preparing"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="p-1 text-green-600 hover:text-green-800 transition"
                        title="Mark as ready"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="p-1 text-red-600 hover:text-red-800 transition"
                      title="Cancel order"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation Queue */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Preparation Queue</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Current Orders</h3>
              <p className="text-neutral-600 text-sm">Orders currently being prepared</p>
            </div>
            <div className="divide-y">
              {orders.filter(order => order.status === 'preparing').map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Table {order.table} - {order.dish}</p>
                    <p className="text-sm text-neutral-600">Started at {order.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">In Progress</span>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                    >
                      Mark Ready
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsProfileOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Employee Profile</h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {chefName.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-lg">{chefName}</h3>
                <p className="text-neutral-600 text-sm">Chef</p>
                <p className="text-neutral-500 text-xs mt-1">Employee ID: CHF001</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Department:</span>
                  <span className="font-medium">Kitchen</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Access Level:</span>
                  <span className="font-medium">Chef Access</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Last Login:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


