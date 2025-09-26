import { useState } from 'react';
import { Shield, Users, UserCheck, ChefHat, LogIn, Eye, EyeOff, AlertCircle, Clock, DollarSign } from 'lucide-react';

export default function Staff() {
  const [loginForms, setLoginForms] = useState({
    admin: false,
    manager: false,
    staff: false,
    chef: false
  });
  const [credentials, setCredentials] = useState({
    admin: { username: '', password: '' },
    manager: { username: '', password: '' },
    staff: { username: '', password: '' },
    chef: { username: '', password: '' }
  });
  const [showPasswords, setShowPasswords] = useState({
    admin: false,
    manager: false,
    staff: false,
    chef: false
  });
  const [notifications, setNotifications] = useState('');

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
        body: JSON.stringify({ username, password })
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

  const toggleLoginForm = (role) => {
    setLoginForms(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  const togglePasswordVisibility = (role) => {
    setShowPasswords(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  const updateCredentials = (role, field, value) => {
    setCredentials(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value
      }
    }));
  };

  const staffSections = [
    {
      role: 'admin',
      title: 'Admin',
      description: 'Full system access and management',
      icon: Shield,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      role: 'manager',
      title: 'Manager',
      description: 'Revenue reports and product management',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      role: 'staff',
      title: 'Staff',
      description: 'Table overview and order management',
      icon: UserCheck,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      role: 'chef',
      title: 'Chef',
      description: 'Kitchen orders and preparation queue',
      icon: ChefHat,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Restaurant Staff Portal</h1>
          <p className="text-xl text-neutral-600">Access your role-specific dashboard</p>
        </div>

        {/* Banner */}
        <section className="mb-12">
          <div className="relative h-64 bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 h-full flex items-center justify-center text-white text-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Welcome to Our Restaurant</h2>
                <p className="text-lg opacity-90">Professional staff management system</p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {staffSections.map(({ role, title, description, icon: Icon, color, hoverColor }) => (
            <div key={role} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
              <div className="text-center">
                <div className={`w-16 h-16 ${color} ${hoverColor} rounded-full mx-auto mb-4 flex items-center justify-center text-white transition`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{description}</p>
                <button
                  onClick={() => toggleLoginForm(role)}
                  className={`w-full ${color} ${hoverColor} text-white py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2`}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Login Forms */}
        {Object.entries(loginForms).map(([role, isOpen]) => {
          if (!isOpen) return null;
          
          const section = staffSections.find(s => s.role === role);
          const Icon = section.icon;
          
          return (
            <div key={role} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 ${section.color} rounded-full flex items-center justify-center text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{section.title} Login</h3>
                    <p className="text-neutral-600 text-sm">{section.description}</p>
                  </div>
                </div>

                <form onSubmit={(e) => handleLogin(role, e)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={credentials[role].username}
                      onChange={(e) => updateCredentials(role, 'username', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords[role] ? 'text' : 'password'}
                        value={credentials[role].password}
                        onChange={(e) => updateCredentials(role, 'password', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(role)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPasswords[role] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => toggleLoginForm(role)}
                      className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 ${section.color} ${section.hoverColor} text-white py-2 px-4 rounded-lg transition font-medium`}
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })}

        {/* Notification */}
        {notifications && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg">
            {notifications}
          </div>
        )}
      </main>
    </div>
  );
}
