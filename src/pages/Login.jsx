import { useState } from "react";
import { ChefHat, User, Shield, Users, ShoppingBag } from "lucide-react";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const roles = [
    {
      id: "admin",
      name: "Chủ Nhà Hàng",
      description: "Quản lý toàn bộ hệ thống",
      icon: Shield,
      color: "from-blue-500 to-purple-500",
      bgColor: "from-blue-50 to-purple-50",
      route: "/admin",
    },
    {
      id: "manager",
      name: "Quản Lý Nhà Hàng",
      description: "Quản lý nhà hàng và bàn",
      icon: User,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      route: "/manager",
    },
    {
      id: "chef",
      name: "Bếp",
      description: "Quản lý bếp và đơn hàng",
      icon: ChefHat,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      route: "/chef",
    },
    {
      id: "staff",
      name: "Nhân viên phục vụ",
      description: "Phục vụ khách hàng",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      route: "/staff",
    },
    // {
    //   id: "customer",
    //   name: "Khách hàng",
    //   description: "Xem menu và đặt món",
    //   icon: ShoppingBag,
    //   color: "from-yellow-500 to-orange-500",
    //   bgColor: "from-yellow-50 to-orange-50",
    //   route: "/menu",
    // },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole && username && password) {
      // Redirect to the appropriate page based on role
      window.location.href =
        roles.find((role) => role.id === selectedRole)?.route || "/";
    }
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    // Set default credentials for demo
    const defaultCredentials = {
      admin: { username: "admin", password: "admin123" },
      manager: { username: "manager", password: "manager123" },
      chef: { username: "chef", password: "chef123" },
      staff: { username: "staff", password: "staff123" },
      customer: { username: "customer", password: "customer123" },
    };

    const credentials = defaultCredentials[roleId];
    if (credentials) {
      setUsername(credentials.username);
      setPassword(credentials.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Hệ Thống Quản Lý Nhà Hàng
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Chọn vai trò của bạn để đăng nhập vào hệ thống quản lý nhà hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Chọn vai trò
            </h2>
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? `border-transparent bg-gradient-to-r ${role.color} text-white shadow-xl transform scale-105`
                      : `border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedRole === role.id
                          ? "bg-white/20"
                          : `bg-gradient-to-br ${role.color}`
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          selectedRole === role.id ? "text-white" : "text-white"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <h3
                        className={`text-lg font-bold ${
                          selectedRole === role.id
                            ? "text-white"
                            : "text-neutral-900"
                        }`}
                      >
                        {role.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          selectedRole === role.id
                            ? "text-white/80"
                            : "text-neutral-600"
                        }`}
                      >
                        {role.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Đăng nhập
            </h2>

            {selectedRole ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-lg"
                >
                  Đăng nhập
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Chọn vai trò để tiếp tục
                </h3>
                <p className="text-neutral-600">
                  Vui lòng chọn vai trò của bạn ở bên trái để hiển thị form đăng
                  nhập
                </p>
              </div>
            )}

            {/* Demo Credentials */}
            {selectedRole && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h4 className="text-sm font-bold text-blue-900 mb-2">
                  Thông tin demo:
                </h4>
                <div className="text-sm text-blue-800">
                  <p>
                    <strong>Tên đăng nhập:</strong> {username}
                  </p>
                  <p>
                    <strong>Mật khẩu:</strong> {password}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-neutral-500">
            © 2024 Restaurant Management System. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
}
