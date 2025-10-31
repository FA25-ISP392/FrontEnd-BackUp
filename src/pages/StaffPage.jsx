import { useState, useEffect } from "react";
import {
  Users,
  LogOut,
  X,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Table,
  AlertTriangle, // 👈 THÊM 1: Import icon lỗi
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
import ServeBoard from "../components/Staff/ServeBoard";
import {
  getOrderDetailsByStatus,
  updateOrderDetailStatus,
} from "../lib/apiOrderDetail";

const RESERVE_WINDOW_MINUTES = 10;
const DEBUG_LOG = import.meta.env.DEV;

function isWithinWindow(
  bookingISO,
  now = new Date(),
  mins = RESERVE_WINDOW_MINUTES
) {
  const b = new Date(bookingISO);
  const diffMins = (b.getTime() - now.getTime()) / 60000;
  return diffMins >= 0 && diffMins <= mins;
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
  const [readyOrders, setReadyOrders] = useState([]);
  const [servedOrders, setServedOrders] = useState([]);
  const [serveLoading, setServeLoading] = useState(false);
  const [serveError, setServeError] = useState("");

  // 👈 THÊM 2: State cho thông báo (thành công và lỗi)
  // (Sử dụng string để chứa nội dung thông báo)
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showErrorModal, setShowErrorModal] = useState("");

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
            const active = bookings.find(
              (b) =>
                b.status === "APPROVED" && isWithinWindow(b.bookingDate, now)
            );
            let nextStatus = t.status ?? "empty";
            if (nextStatus !== "serving" && active) nextStatus = "reserved";

            return {
              ...t,
              status: nextStatus,
              guests: active?.seat || t.guests || 0,
              orderTime: active
                ? hhmm(active.bookingDate)
                : t.orderTime ?? null,
            };
          } catch (e) {
            if (DEBUG_LOG)
              console.warn(`[by_tableDate] error tableId=${tableId}`, e);
            return { ...t };
          }
        })
      );

      if (DEBUG_LOG) console.log("[STAFF] tables hydrated for UI:", hydrated);
      setTables((prev) => {
        const mapPrev = new Map(prev.map((t) => [String(t.id), t]));
        return hydrated.map((t) => {
          const old = mapPrev.get(String(t.id));
          if (!old) return t;
          const merged = { ...t };
          if (old.callStaff === true) merged.callStaff = true;
          if (old.callPayment === true) {
            merged.callPayment = true;
            if (old.pendingPayment) merged.pendingPayment = old.pendingPayment;
          }
          return merged;
        });
      });
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

  useEffect(() => {
    function applyCallStaff({ tableId, tableNumber } = {}) {
      console.log("[STAFF] applyCallStaff called with:", {
        tableId,
        tableNumber,
      });
      if (!tableId && !tableNumber) return;
      setTables((prev) =>
        prev.map((t) => {
          const match = [t.id, t.number]
            .map((v) => String(v))
            .some((v) => v === String(tableId) || v === String(tableNumber));
          if (match) console.log(`[STAFF] ✅ matched table`, t.number);
          return match ? { ...t, callStaff: true } : t;
        })
      );
    }

    let bc = null;
    try {
      bc = new BroadcastChannel("monngon-signals");
      bc.onmessage = (ev) => {
        console.log("[STAFF] BroadcastChannel message:", ev.data);
        const data = ev?.data || {};
        if (data?.type === "callStaff") applyCallStaff(data);
      };
      console.log("[STAFF] BroadcastChannel listener ready");
    } catch (e) {
      console.warn("[STAFF] BroadcastChannel failed:", e);
    }

    function onStorage(ev) {
      if (!ev.key?.startsWith("signal:callStaff:")) return;
      console.log("[STAFF] onStorage triggered:", ev.key);
      try {
        const payload = JSON.parse(ev.newValue || "{}");
        applyCallStaff(payload);
        localStorage.removeItem(ev.key);
      } catch (e) {
        console.warn("[STAFF] parse error:", e);
      }
    }

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      try {
        bc?.close?.();
      } catch {}
    };
  }, []);

  useEffect(() => {
    function applyCallStaff({ tableId, tableNumber } = {}) {
      if (!tableId && !tableNumber) return;
      setTables((prev) =>
        prev.map((t) => {
          const match = [t.id, t.number]
            .map((v) => String(v))
            .some((v) => v === String(tableId) || v === String(tableNumber));
          return match ? { ...t, callStaff: true } : t;
        })
      );
    }
    function scanLocalSignals() {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          if (key.startsWith("signal:callStaff:")) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const payload = JSON.parse(raw);
              console.log(
                "[STAFF] picked signal from localStorage:",
                key,
                payload
              );
              applyCallStaff(payload);
            }
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.warn("[STAFF] scanLocalSignals error:", e);
      }
    }
    scanLocalSignals();
    const timer = setInterval(scanLocalSignals, 1000);
    function onStorage(e) {
      if (e.key?.startsWith("signal:callStaff:")) scanLocalSignals();
    }
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  async function fetchServeBoard() {
    try {
      setServeError("");
      setServeLoading(true);
      const [done, served] = await Promise.all([
        getOrderDetailsByStatus("DONE"),
        getOrderDetailsByStatus("SERVED"),
      ]);
      setReadyOrders(Array.isArray(done) ? done : []);
      setServedOrders(Array.isArray(served) ? served : []);
    } catch (e) {
      setServeError(e?.message || "Không tải được danh sách món.");
    } finally {
      setServeLoading(false);
    }
  }

  // 👈 THÊM 3: useEffect để tự động ẩn thông báo (nếu muốn)
  // (Nếu không muốn tự ẩn, có thể xóa 2 hook này)
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => setShowErrorModal(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  useEffect(() => {
    if (activeSection !== "serveBoard") return;
    fetchServeBoard();
  }, [activeSection]);

  const handleServe = async (od) => {
    try {
      await updateOrderDetailStatus(od.orderDetailId, od, "SERVED");
      setReadyOrders((prev) =>
        prev.filter((x) => x.orderDetailId !== od.orderDetailId)
      );
      setServedOrders((prev) => [{ ...od, status: "SERVED" }, ...prev]);
    } catch (e) {
      // alert(e?.message || "Cập nhật trạng thái thất bại."); // 👈 ĐÃ XÓA
      setShowErrorModal(e?.message || "Cập nhật trạng thái thất bại."); // 👈 THAY THẾ
    }
  };

  const getTableStatusBadge = (status) => {
    switch (status) {
      case "serving":
        return "bg-red-500";
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

          {activeSection === "serveBoard" && (
            <ServeBoard
              readyOrders={readyOrders}
              servedOrders={servedOrders}
              onServe={handleServe}
              isLoading={serveLoading}
              error={serveError}
            />
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
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-800">
                          Đang Phục Vụ
                        </h4>
                        <p className="text-red-600">Khách hàng đang dùng bữa</p>
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
                <button
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  onClick={() => {
                    if (!selectedTable) return;
                    setTables((prev) =>
                      prev.map((t) =>
                        t.id === selectedTable.id
                          ? { ...t, callStaff: false }
                          : t
                      )
                    );
                  }}
                >
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
          // 👈 THÊM 4: Logic onClose phức tạp
          onClose={(res) => {
            setIsPaymentModalOpen(false); // Luôn đóng modal

            if (res?.paid) {
              // 1. Cập nhật UI bàn ngay lập tức
              setTables((prev) =>
                prev.map((t) =>
                  t.id === selectedTable.id
                    ? { ...t, callPayment: false, pendingPayment: null }
                    : t
                )
              );

              // 2. Hiển thị Modal thành công
              if (res.method === "CASH") {
                setShowSuccessModal("Thanh toán tiền mặt thành công!");
                // Không reload, để nhân viên tự thao tác
              } else if (res.method === "QR") {
                setShowSuccessModal("Thanh toán QR thành công!");
                // Reload sau 1.5s để đảm bảo staff thấy modal
                setTimeout(() => (window.location.href = "/staff"), 1500);
              }
            } else if (res?.error) {
              // 3. Hiển thị Modal lỗi
              setShowErrorModal(res.error);
            }
          }}
        />
      )}

      {/* 👈 THÊM 5: JSX cho cả 2 loại thông báo (Kiểu Modal giống Menu.jsx) */}

      {/* ==== MODAL THÀNH CÔNG (Giống hệt Menu.jsx) ==== */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {showSuccessModal} {/* Hiển thị nội dung message */}
              </h3>
              <p className="text-neutral-600 mb-6">
                Hoạt động đã được ghi nhận.
              </p>
              <button
                onClick={() => setShowSuccessModal("")} // Bấm để đóng
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==== MODAL LỖI (Kiểu tương tự) ==== */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-neutral-600 mb-6">
                {showErrorModal} {/* Hiển thị nội dung lỗi */}
              </p>
              <button
                onClick={() => setShowErrorModal("")} // Bấm để đóng
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
