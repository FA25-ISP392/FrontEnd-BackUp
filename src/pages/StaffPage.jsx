import { useState, useEffect } from "react";
import {
  Users,
  ClipboardList,
  User,
  LogOut,
  X,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  Timer,
  DollarSign,
  Table,
} from "lucide-react";
import StaffSidebar from "../components/Staff/StaffSidebar";
import StaffRestaurantTableLayout from "../components/Staff/StaffRestaurantTableLayout";
import StaffTableInfoLayout from "../components/Staff/StaffTableInfoLayout";
import { listTables } from "../lib/apiTable";
import { listBookingsByTableDate } from "../lib/apiBooking";
import { getCurrentUser } from "../lib/auth";
import StaffPaymentModal from "../components/Staff/StaffPaymentModal";
import { getPayments } from "../lib/apiPayment";
import { getOrderById } from "../lib/apiOrder";

const RESERVE_WINDOW_MINUTES = 240;
const DEBUG_LOG = import.meta.env.DEV;

function isWithinWindow(
  bookingISO,
  now = new Date(),
  mins = RESERVE_WINDOW_MINUTES
) {
  const b = new Date(bookingISO);
  return Math.abs((b.getTime() - now.getTime()) / 60000) <= mins;
}

function hhmm(d) {
  const t = new Date(d);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function StaffPage() {
  const [staffName, setStaffName] = useState("");
  const [activeSection, setActiveSection] = useState("tableLayout");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [orders] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    const nm =
      u?.staff_name ||
      u?.staffName ||
      u?.fullName ||
      u?.name ||
      u?.displayName ||
      u?.username;
    setStaffName(nm || "Staff");
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    let timer;
    async function hydrate() {
      const rawTables = await listTables();
      const sorted = [...rawTables].sort(
        (a, b) => (a.number || a.id) - (b.number || b.id)
      );
      const now = new Date();

      const hydrated = await Promise.all(
        sorted.slice(0, 8).map(async (t) => {
          const tableId = t.id;
          try {
            const bookings = await listBookingsByTableDate(tableId, now);
            if (DEBUG_LOG) {
              console.log(
                `[by_tableDate] tableId=${tableId} #${t.number}`,
                bookings
              );
            }
            const active = bookings.find(
              (b) =>
                b.status === "APPROVED" && isWithinWindow(b.bookingDate, now)
            );
            return {
              ...t,
              status: active ? "reserved" : t.status ?? "empty",
              guests: active?.seat || 0,
              orderTime: active ? hhmm(active.bookingDate) : null,
            };
          } catch (e) {
            if (DEBUG_LOG)
              console.warn(`[by_tableDate] error tableId=${tableId}`, e);
            return {
              ...t,
              status: t.status ?? "empty",
              guests: 0,
              orderTime: null,
            };
          }
        })
      );

      if (DEBUG_LOG) console.log("[STAFF] tables hydrated for UI:", hydrated);
      setTables(hydrated);
    }

    hydrate();
    timer = setInterval(hydrate, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let timer;
    async function hydratePayments() {
      try {
        const pays = await getPayments();
        const pending = pays.filter(
          (p) => (p.status || "PENDING") === "PENDING"
        );
        if (!pending.length) return;
        const orderById = new Map();
        await Promise.all(
          pending.map(async (p) => {
            try {
              const o = await getOrderById(p.orderId);
              if (o) orderById.set(p.id, o);
            } catch {}
          })
        );
        setTables((prev) =>
          prev.map((tb) => {
            const matchedPay = pending.find((p) => {
              const o = orderById.get(p.id);
              return o && String(o.tableId) === String(tb.id);
            });
            if (!matchedPay) return tb;
            return {
              ...tb,
              callPayment: true,
              pendingPayment: {
                id: matchedPay.id,
                orderId: matchedPay.orderId,
                total: matchedPay.total,
                checkoutUrl: matchedPay.checkoutUrl,
                qrCode: matchedPay.qrCode,
                at: Date.now(),
              },
            };
          })
        );
      } catch (e) {
        console.warn("[Staff] hydratePayments fail:", e);
      }
    }

    hydratePayments();
    timer = setInterval(hydratePayments, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function applyCallPayment({ tableId, orderId, total, paymentId } = {}) {
      if (!tableId || !paymentId) return;
      setTables((prev) =>
        prev.map((t) =>
          String(t.id) === String(tableId)
            ? {
                ...t,
                callPayment: true,
                pendingPayment: { id: paymentId, orderId, total },
              }
            : t
        )
      );
    }
    function handleCallPayment(e) {
      applyCallPayment(e.detail);
    }
    function onStorage(ev) {
      if (!ev.key?.startsWith("signal:callPayment:")) return;
      try {
        const payload = JSON.parse(ev.newValue || "{}");
        applyCallPayment(payload);
        localStorage.removeItem(ev.key);
      } catch {}
    }
    window.addEventListener("table:callPayment", handleCallPayment);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("table:callPayment", handleCallPayment);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const getTableStatusBadge = (status) => {
    switch (status) {
      case "serving":
        return "bg-blue-500";
      case "empty":
        return "bg-green-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };
  const getTableStatusText = (status) => {
    switch (status) {
      case "serving":
        return "Đang phục vụ";
      case "empty":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      default:
        return "Không rõ";
    }
  };
  const getOrderStatusColor = (status) => {
    switch (status) {
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "done":
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
      case "done":
        return "Hoàn tất";
      case "served":
        return "Đã phục vụ";
      default:
        return status;
    }
  };

  const totalRevenue = tables.reduce(
    (sum, table) => sum + (table.totalAmount || 0),
    0
  );
  const servingTables = tables.filter(
    (table) => table.status === "serving"
  ).length;
  const emptyTables = tables.filter((table) => table.status === "empty").length;
  const reservedTables = tables.filter(
    (table) => table.status === "reserved"
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

          {activeSection === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Thông Tin Bàn</h1>

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
                        {emptyTables}
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
                        {servingTables}
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

              <StaffTableInfoLayout
                tables={tables.slice(0, 8)}
                onTableClick={setSelectedTable}
                selectedTable={selectedTable}
                orders={orders}
              />
            </div>
          )}

          {activeSection === "ordersByTable" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Đơn Món Theo Bàn</h1>

              <div className="space-y-4">
                {orders
                  .filter((order) => order.table <= 8)
                  .map((order) => (
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
                              order.status
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
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getTableStatusBadge(
                      selectedTable.status
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

                {selectedTable.status === "empty" ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Table className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-green-800 mb-2">
                      Bàn Trống
                    </h4>
                    <p className="text-green-600">
                      Bàn sẵn sàng phục vụ khách hàng mới.
                    </p>
                  </div>
                ) : selectedTable.status === "reserved" ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-orange-800">
                          Thông Tin Đặt Bàn
                        </h4>
                        <p className="text-orange-600">
                          Khách hàng đã đặt bàn này
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">
                          Số khách
                        </p>
                        <p className="font-bold text-orange-800 text-lg">
                          {selectedTable.guests} người
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">
                          Thời gian đặt
                        </p>
                        <p className="font-bold text-orange-800">
                          {selectedTable.orderTime || "Chưa xác định"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : selectedTable.status === "serving" ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-blue-800">
                          Đang Phục Vụ
                        </h4>
                        <p className="text-blue-600">
                          Khách hàng đang dùng bữa
                        </p>
                      </div>
                    </div>
                    {selectedTable.callStaff && (
                      <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-800">
                            Khách đang cần hỗ trợ
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-600">Không rõ trạng thái.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phản Hồi Gọi
                </button>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Xử Lý Thanh Toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {isPaymentModalOpen && selectedTable && (
        <StaffPaymentModal
          open={isPaymentModalOpen}
          table={selectedTable}
          onClose={(res) => {
            setIsPaymentModalOpen(false);
            if (res?.paid) {
              setTables((prev) =>
                prev.map((t) =>
                  t.id === selectedTable.id
                    ? { ...t, callPayment: false, pendingPayment: null }
                    : t
                )
              );
            }
          }}
        />
      )}
    </div>
  );
}
