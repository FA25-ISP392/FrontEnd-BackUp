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
import StaffRestaurantTableLayout from "../components/Staff/StaffRestaurantTableLayout";
import StaffTableInfoLayout from "../components/Staff/StaffTableInfoLayout";

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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: true,
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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: false,
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
      callPayment: false,
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
  const reservedTables = tables.filter(
    (table) => table.status === "reserved",
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
                <StaffRestaurantTableLayout 
                  tables={tables.slice(0, 8)}
                  onTableClick={setSelectedTable}
                  selectedTable={selectedTable}
                />
              </div>
            </div>
          )}

          {/* Tổng Quan Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Thông Tin Bàn</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-600 text-sm">Bàn Đã Đặt</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reservedTables}
                      </p>
                    </div>
                    <Table className="h-8 w-8 text-blue-600" />
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

              {/* Table Layout with Clickable Tables */}
              <StaffTableInfoLayout 
                tables={tables.slice(0, 8)}
                onTableClick={setSelectedTable}
                selectedTable={selectedTable}
                orders={orders}
              />
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

                {/* Hiển thị thông tin theo trạng thái bàn */}
                {selectedTable.status === "available" ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Table className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Bàn Trống</h4>
                    <p className="text-green-600">Bàn này hiện đang trống và sẵn sàng phục vụ khách hàng mới.</p>
                  </div>
                ) : selectedTable.status === "reserved" ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-orange-800">Thông Tin Đặt Bàn</h4>
                        <p className="text-orange-600">Khách hàng đã đặt bàn này</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">Số khách</p>
                        <p className="font-bold text-orange-800 text-lg">{selectedTable.guests} người</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">Thời gian đặt</p>
                        <p className="font-bold text-orange-800">{selectedTable.orderTime || "Chưa xác định"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">Thời gian phục vụ</p>
                        <p className="font-bold text-orange-800">{selectedTable.duration || "Chưa bắt đầu"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">Trạng thái</p>
                        <p className="font-bold text-orange-800">Đã đặt</p>
                      </div>
                    </div>
                  </div>
                ) : selectedTable.status === "occupied" ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-800">Đang Phục Vụ</h4>
                        <p className="text-red-600">Khách hàng đang sử dụng bàn này</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Số khách</p>
                        <p className="font-bold text-red-800 text-lg">{selectedTable.guests} người</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Thời gian bắt đầu</p>
                        <p className="font-bold text-red-800">{selectedTable.orderTime || "Chưa xác định"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Thời gian phục vụ</p>
                        <p className="font-bold text-red-800">{selectedTable.duration || "Đang phục vụ"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Tổng tiền</p>
                        <p className="font-bold text-red-800">${selectedTable.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    {selectedTable.callStaff && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-800">Khách hàng đang cần hỗ trợ!</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Timer className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-purple-800 mb-2">Đang Dọn Dẹp</h4>
                    <p className="text-purple-600">Bàn đang được dọn dẹp và sẽ sẵn sàng phục vụ khách hàng mới.</p>
                  </div>
                )}
              </div>

              {/* Chỉ hiển thị thông tin món ăn và thanh toán khi bàn có khách */}
              {(selectedTable.status === "occupied" || selectedTable.status === "reserved") && (
                <>
                  {/* Orders for this table */}
                  <div>
                    <h4 className="font-semibold mb-4">Món Ăn Đã Đặt</h4>
                    {orders.filter((order) => order.table === selectedTable.number)
                      .length > 0 ? (
                      <div className="space-y-3">
                        {orders
                          .filter((order) => order.table === selectedTable.number)
                          .map((order) => (
                            <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
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
                                <p className="text-sm text-neutral-600 font-medium">
                                  Danh sách món:
                                </p>
                                <div className="space-y-1">
                                  {order.dishes.map((dish, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-sm bg-white p-2 rounded border"
                                    >
                                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                      <span className="flex-1">{dish}</span>
                                      <span className="text-xs text-gray-500">x1</span>
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

                  {/* Payment Information - chỉ hiển thị khi có đơn hàng */}
                  {selectedTable.totalAmount > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-4">Thông Tin Thanh Toán</h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-green-700">Tổng tiền:</span>
                          <span className="font-bold text-green-800 text-lg">
                            ${selectedTable.totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-green-700">Trạng thái thanh toán:</span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Chưa thanh toán
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium">
                            Xử lý thanh toán
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phản Hồi Gọi
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Xử Lý Thanh Toán
                </button>
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
