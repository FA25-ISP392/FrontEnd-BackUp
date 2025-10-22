import { useState, useEffect } from "react";
import {
  Users,
  ClipboardList,
  Home,
  User,
  LogOut,
  X,
  Phone,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  Timer,
  DollarSign,
  Table,
} from "lucide-react";
import StaffSidebar from "../components/Staff/StaffSidebar";

import { getCurrentUser } from "../lib/auth";

export default function StaffPage() {
  const [staffName, setStaffName] = useState("");
  const [activeSection, setActiveSection] = useState("tableLayout");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables] = useState([
    {
      id: 1,
      number: 1,
      status: "occupied",
      guests: 4,
      callStaff: false,
      orderTime: "14:30",
      duration: "45 min",
      totalAmount: 89.5,
    },
    {
      id: 2,
      number: 2,
      status: "available",
      guests: 0,
      callStaff: false,
      orderTime: null,
      duration: null,
      totalAmount: 0,
    },
    {
      id: 3,
      number: 3,
      status: "occupied",
      guests: 2,
      callStaff: true,
      orderTime: "15:00",
      duration: "30 min",
      totalAmount: 45.2,
    },
    {
      id: 4,
      number: 4,
      status: "reserved",
      guests: 6,
      callStaff: false,
      orderTime: "15:30",
      duration: "15 min",
      totalAmount: 0,
    },
    {
      id: 5,
      number: 5,
      status: "occupied",
      guests: 3,
      callStaff: false,
      orderTime: "14:45",
      duration: "40 min",
      totalAmount: 67.8,
    },
    {
      id: 6,
      number: 6,
      status: "available",
      guests: 0,
      callStaff: false,
      orderTime: null,
      duration: null,
      totalAmount: 0,
    },
    {
      id: 7,
      number: 7,
      status: "occupied",
      guests: 5,
      callStaff: true,
      orderTime: "15:15",
      duration: "25 min",
      totalAmount: 125.4,
    },
    {
      id: 8,
      number: 8,
      status: "occupied",
      guests: 2,
      callStaff: false,
      orderTime: "14:50",
      duration: "35 min",
      totalAmount: 52.3,
    },
    {
      id: 9,
      number: 9,
      status: "cleaning",
      guests: 0,
      callStaff: false,
      orderTime: null,
      duration: "5 min",
      totalAmount: 0,
    },
    {
      id: 10,
      number: 10,
      status: "available",
      guests: 0,
      callStaff: false,
      orderTime: null,
      duration: null,
      totalAmount: 0,
    },
    {
      id: 11,
      number: 11,
      status: "occupied",
      guests: 4,
      callStaff: false,
      orderTime: "15:20",
      duration: "20 min",
      totalAmount: 78.9,
    },
    {
      id: 12,
      number: 12,
      status: "occupied",
      guests: 2,
      callStaff: false,
      orderTime: "14:35",
      duration: "50 min",
      totalAmount: 34.6,
    },
  ]);
  const [orders] = useState([
    {
      id: 1,
      table: 1,
      dishes: ["Caesar Salad", "Grilled Chicken", "Tiramisu"],
      status: "preparing",
      total: 89.5,
      orderTime: "14:30",
      estimatedTime: "10 min",
    },
    {
      id: 2,
      table: 3,
      dishes: ["Pasta Carbonara", "Garlic Bread"],
      status: "ready",
      total: 45.2,
      orderTime: "15:00",
      estimatedTime: "Ready",
    },
    {
      id: 3,
      table: 5,
      dishes: ["Margherita Pizza", "Fish Tacos", "Caesar Salad"],
      status: "served",
      total: 67.8,
      orderTime: "14:45",
      estimatedTime: "Served",
    },
    {
      id: 4,
      table: 7,
      dishes: ["Beef Burger", "Caesar Salad", "Chocolate Cake", "Fries"],
      status: "preparing",
      total: 125.4,
      orderTime: "15:15",
      estimatedTime: "15 min",
    },
    {
      id: 5,
      table: 8,
      dishes: ["Pizza Margherita", "Coca Cola"],
      status: "served",
      total: 52.3,
      orderTime: "14:50",
      estimatedTime: "Served",
    },
    {
      id: 6,
      table: 11,
      dishes: ["Grilled Salmon", "Rice", "Vegetables"],
      status: "preparing",
      total: 78.9,
      orderTime: "15:20",
      estimatedTime: "8 min",
    },
    {
      id: 7,
      table: 12,
      dishes: ["Pasta Alfredo"],
      status: "served",
      total: 34.6,
      orderTime: "14:35",
      estimatedTime: "Served",
    },
  ]);

  //lấy tên để welcome
  useEffect(() => {
    const u = getCurrentUser();
    const name =
      u?.staff_name ||
      u?.staffName ||
      u?.fullName ||
      u?.name ||
      u?.displayName ||
      u?.username;
    setStaffName(name || "Staff");
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  // Removed sidebarItems as it's now handled in StaffSidebar component

  const getTableStatusColor = (status) => {
    switch (status) {
      case "occupied":
        return "bg-blue-500";
      case "available":
        return "bg-green-500";
      case "reserved":
        return "bg-yellow-500";
      case "cleaning":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTableStatusText = (status) => {
    switch (status) {
      case "occupied":
        return "Đang phục vụ";
      case "available":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      case "cleaning":
        return "Đang dọn";
      default:
        return status;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "served":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "preparing":
        return "Đang chuẩn bị";
      case "ready":
        return "Sẵn sàng";
      case "served":
        return "Đã phục vụ";
      default:
        return status;
    }
  };

  const totalRevenue = tables.reduce(
    (sum, table) => sum + table.totalAmount,
    0,
  );
  const occupiedTables = tables.filter(
    (table) => table.status === "occupied",
  ).length;
  const availableTables = tables.filter(
    (table) => table.status === "available",
  ).length;
  const callStaffCount = tables.filter((table) => table.callStaff).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-green-50 to-emerald-50">
      <div className="flex">
        <StaffSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 p-6">
          {/* Sơ Đồ Bàn Section */}
          {activeSection === "tableLayout" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Sơ Đồ Bàn</h1>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Sơ đồ bàn nhà hàng
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Nhấp vào bàn để xem thông tin chi tiết
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                  {tables.slice(0, 8).map((table) => (
                    <div
                      key={table.id}
                      className={`bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200 group cursor-pointer transform hover:scale-105 ${
                        selectedTable?.id === table.id
                          ? "ring-2 ring-orange-500 shadow-orange-200"
                          : ""
                      }`}
                      onClick={() => setSelectedTable(table)}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Table className="h-6 w-6 text-orange-600" />
                          </div>
                          <span className="font-bold text-neutral-900 text-lg">
                            Bàn {table.number}
                          </span>
                        </div>
                        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 border border-orange-300">
                          <div className="text-3xl font-bold text-orange-800 mb-1">
                            {table.guests || 0}
                          </div>
                          <div className="text-sm text-orange-700 font-medium">
                            khách
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tổng Quan Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Tổng Quan</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Tổng Doanh Thu</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Bàn Trống</p>
                      <p className="text-2xl font-bold text-green-600">
                        {availableTables}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">
                        Bàn Đang Phục Vụ
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {occupiedTables}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Gọi Nhân Viên</p>
                      <p className="text-2xl font-bold text-red-600">
                        {callStaffCount}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Table Status Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Trạng Thái Các Bàn
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {tables.slice(0, 8).map((table) => (
                    <div
                      key={table.id}
                      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                        table.callStaff
                          ? "ring-2 ring-red-500 bg-red-50"
                          : "bg-white border"
                      }`}
                      onClick={() => setSelectedTable(table)}
                    >
                      <div className="text-center">
                        <div
                          className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg ${getTableStatusColor(
                            table.status,
                          )}`}
                        >
                          {table.number}
                        </div>
                        <p className="text-sm font-medium">
                          {getTableStatusText(table.status)}
                        </p>
                        {table.guests > 0 && (
                          <p className="text-xs text-neutral-600">
                            {table.guests} khách
                          </p>
                        )}
                        {table.duration && (
                          <p className="text-xs text-neutral-500">
                            {table.duration}
                          </p>
                        )}
                        {table.callStaff && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <Phone className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Đơn Món Theo Bàn Section */}
          {activeSection === "ordersByTable" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Đơn Món Theo Bàn</h1>

              <div className="space-y-4">
                {orders.filter(order => order.table <= 8).map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg p-6 shadow-sm border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-neutral-600" />
                        <span className="font-semibold text-lg">
                          Bàn {order.table}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                            order.status,
                          )}`}
                        >
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-green-600">
                        ${order.total}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-sm text-neutral-600">
                        Món đã đặt:
                      </h4>
                      <div className="space-y-1">
                        {order.dishes.map((dish, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>{dish}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === "preparing" && (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Đang chuẩn bị
                        </button>
                      )}
                      {order.status === "ready" && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Phục vụ món
                        </button>
                      )}
                      {order.status === "served" && (
                        <span className="text-green-600 text-sm font-medium">
                          Đã phục vụ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Table Detail Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                Chi Tiết Bàn {selectedTable.number}
              </h2>
              <button
                onClick={() => setSelectedTable(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Table Info */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getTableStatusColor(
                      selectedTable.status,
                    )}`}
                  >
                    {selectedTable.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Bàn {selectedTable.number}
                    </h3>
                    <p className="text-neutral-600">
                      {getTableStatusText(selectedTable.status)}
                    </p>
                    {selectedTable.guests > 0 && (
                      <p className="text-sm text-neutral-500">
                        {selectedTable.guests} khách
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      Thời gian đặt bàn
                    </p>
                    <p className="font-semibold">
                      {selectedTable.orderTime || "Chưa có"}
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      Thời gian phục vụ
                    </p>
                    <p className="font-semibold">
                      {selectedTable.duration || "N/A"}
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-600">Tổng tiền</p>
                    <p className="font-semibold text-green-600">
                      ${selectedTable.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-sm text-neutral-600">Trạng thái</p>
                    <p className="font-semibold">
                      {getTableStatusText(selectedTable.status)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orders for this table */}
              <div>
                <h4 className="font-semibold mb-4">Đơn Hàng</h4>
                {orders.filter((order) => order.table === selectedTable.number)
                  .length > 0 ? (
                  <div className="space-y-3">
                    {orders
                      .filter((order) => order.table === selectedTable.number)
                      .map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                Đơn #{order.id}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                                  order.status,
                                )}`}
                              >
                                {getOrderStatusText(order.status)}
                              </span>
                            </div>
                            <span className="text-green-600 font-semibold">
                              ${order.total}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-neutral-600">
                              Món đã đặt:
                            </p>
                            <div className="space-y-1">
                              {order.dishes.map((dish, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                  <span>{dish}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="text-sm text-neutral-600">
                              <p>Thời gian đặt: {order.orderTime}</p>
                              <p>Thời gian ước tính: {order.estimatedTime}</p>
                            </div>
                            <div className="flex gap-2">
                              {order.status === "ready" && (
                                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">
                                  Phục vụ
                                </button>
                              )}
                              {order.status === "preparing" && (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                                  Đang chuẩn bị
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-600">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <p>Chưa có đơn hàng nào</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                  Thêm đơn hàng
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                  Thanh toán
                </button>
                {selectedTable.callStaff && (
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
                    Phản hồi gọi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsProfileOpen(false)}
          />
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
                <div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {staffName.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-lg">{staffName}</h3>
                <p className="text-neutral-600 text-sm">Staff</p>
                <p className="text-neutral-500 text-xs mt-1">
                  Employee ID: STF001
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Department:</span>
                  <span className="font-medium">Service</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Access Level:</span>
                  <span className="font-medium">Staff Access</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Last Login:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString()}
                  </span>
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
