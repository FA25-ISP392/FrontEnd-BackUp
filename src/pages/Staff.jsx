import { useState } from "react";
import {
  Shield,
  Users,
  UserCheck,
  ChefHat,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  DollarSign,
} from "lucide-react";

export default function Staff() {
  // Single login on the right; image left
  const [activeRole, setActiveRole] = useState("");
  const [credentials, setCredentials] = useState({
    admin: { username: "", password: "" },
    manager: { username: "", password: "" },
    staff: { username: "", password: "" },
    chef: { username: "", password: "" },
  });
  const [showPasswords, setShowPasswords] = useState({
    admin: false,
    manager: false,
    staff: false,
    chef: false,
  });
  const [notifications, setNotifications] = useState("");

  const handleLogin = async (role, e) => {
    e.preventDefault();

    const { username, password } = credentials[role];

    if (!username || !password) {
      setNotifications("Please enter both username and password");
      setTimeout(() => setNotifications(""), 3000);
      return;
    }

    try {
      // Simulate API call
      const response = await fetch(`/api/auth/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Redirect to respective dashboard
        if (role === "staff") {
          window.location.href = "/staff-dashboard";
        } else {
          window.location.href = `/${role}`;
        }
      } else {
        setNotifications("Invalid credentials or role access denied");
        setTimeout(() => setNotifications(""), 3000);
      }
    } catch (error) {
      setNotifications("Login system is currently unavailable");
      setTimeout(() => setNotifications(""), 3000);
    }
  };

  const toggleLoginForm = (role) => {
    setLoginForms((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const togglePasswordVisibility = (role) => {
    setShowPasswords((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const updateCredentials = (role, field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  const staffSections = [
    {
      role: "admin",
      title: "Admin",
      description: "Full system access and management",
      icon: Shield,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
    {
      role: "manager",
      title: "Manager",
      description: "Revenue reports and product management",
      icon: Users,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      role: "staff",
      title: "Staff",
      description: "Table overview and order management",
      icon: UserCheck,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      role: "chef",
      title: "Chef",
      description: "Kitchen orders and preparation queue",
      icon: ChefHat,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Restaurant image/banner */}
        <div className="relative h-80 md:h-[28rem] rounded-2xl overflow-hidden">
          <img
            src="/api/placeholder/800/600"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-bold">Welcome to Our Restaurant</h2>
            <p className="opacity-90">Professional staff management system</p>
          </div>
        </div>

        {/* Right: Single Login */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h1 className="text-2xl font-bold mb-1">Staff Portal</h1>
          <p className="text-neutral-600 mb-6">Đăng nhập để vào hệ thống</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {staffSections.map(({ role, title, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${
                  activeRole === role
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-neutral-50"
                }`}
              >
                <div
                  className={`w-8 h-8 ${color} rounded-md text-white flex items-center justify-center`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{title}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => handleLogin(activeRole || "staff", e)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={credentials[activeRole || "staff"].username}
                onChange={(e) =>
                  updateCredentials(
                    activeRole || "staff",
                    "username",
                    e.target.value,
                  )
                }
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
                  type={
                    showPasswords[activeRole || "staff"] ? "text" : "password"
                  }
                  value={credentials[activeRole || "staff"].password}
                  onChange={(e) =>
                    updateCredentials(
                      activeRole || "staff",
                      "password",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility(activeRole || "staff")
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPasswords[activeRole || "staff"] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          </form>
        </div>
      </div>
      {notifications && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg">
          {notifications}
        </div>
      )}
    </div>
  );
}
