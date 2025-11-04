import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, History, Users } from "lucide-react"; // Đã thêm Users
import StaffSidebar from "../components/Staff/StaffSidebar";
import StaffRestaurantTableLayout from "../components/Staff/StaffRestaurantTableLayout";
import StaffTableInfoLayout from "../components/Staff/StaffTableInfoLayout";
import { listTables } from "../lib/apiTable";
import { listBookingsByTableDate } from "../lib/apiBooking";
import StaffPaymentModal from "../components/Staff/StaffPaymentModal";
import { getPayments } from "../lib/apiPayment";
import { getOrderById } from "../lib/apiOrder";
import ServeBoard from "../components/Staff/ServeBoard";
import {
  getOrderDetailsByStatus,
  updateOrderDetailStatus,
} from "../lib/apiOrderDetail";
import {
  isWithinWindow,
  hhmm,
  DEBUG_LOG,
} from "../components/Staff/staffUtils";
import StaffOverview from "../components/Staff/StaffOverview";
import StaffTableDetailModal from "../components/Staff/StaffTableDetailModal";
import { getCurrentUser } from "../lib/auth";

export default function StaffPage({ section = "tableLayout" }) {
  const [activeSection, setActiveSection] = useState(section);
  useEffect(() => setActiveSection(section), [section]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // ServeBoard state
  const [readyOrders, setReadyOrders] = useState([]);
  const [servedOrders, setServedOrders] = useState([]);
  const [historicalServed, setHistoricalServed] = useState([]);
  const [serveLoading, setServeLoading] = useState(false);
  const [serveError, setServeError] = useState("");

  // Noti modals
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showErrorModal, setShowErrorModal] = useState("");

  const [staffName, setStaffName] = useState("");
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

    let bc = null;
    try {
      bc = new BroadcastChannel("monngon-signals");
      bc.onmessage = (ev) => {
        const data = ev?.data || {};
        if (data?.type === "callStaff") applyCallStaff(data);
      };
    } catch (e) {
      console.warn("[STAFF] BroadcastChannel failed:", e);
    }

    function onStorage(ev) {
      if (!ev.key?.startsWith("signal:callStaff:")) return;
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

  async function loadServeBoards() {
    try {
      setServeError("");
      setServeLoading(true);
      const [done, served] = await Promise.all([
        getOrderDetailsByStatus("DONE"),
        getOrderDetailsByStatus("SERVED"),
      ]);

      const today = new Date().toISOString().split("T")[0];
      const servedToday = [];
      const servedPast = [];

      if (Array.isArray(served)) {
        for (const od of served) {
          if (od.orderDate && od.orderDate.startsWith(today)) {
            servedToday.push(od);
          } else {
            servedPast.push(od);
          }
        }
      }

      setReadyOrders(Array.isArray(done) ? done : []);
      setServedOrders(servedToday);
      setHistoricalServed(servedPast);
    } catch (e) {
      setServeError(e?.message || "Không tải được danh sách món.");
    } finally {
      setServeLoading(false);
    }
  }

  useEffect(() => {
    if (activeSection === "serveBoard" || activeSection === "serveHistory") {
      loadServeBoards();
    }
  }, [activeSection]);

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

  const handleServe = async (od) => {
    try {
      await updateOrderDetailStatus(od.orderDetailId, od, "SERVED");
      loadServeBoards();
    } catch (e) {
      setShowErrorModal(e?.message || "Cập nhật trạng thái thất bại.");
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "tableLayout":
        return "Sơ Đồ Bàn";
      case "overview":
        return "Thông Tin Bàn";
      case "serveBoard":
        return "Phục Vụ Món";
      case "serveHistory":
        return "Lịch Sử Phục Vụ";
      default:
        return "Trang Nhân Viên";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-green-900">
      <div className="flex">
        <StaffSidebar activeSection={activeSection} />

        <main className="flex-1 p-8 md:p-10">
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-white shadow-text-lg mb-2">
              Chào mừng, {staffName}!
            </h1>
            <p className="text-xl text-green-300">
              {getSectionTitle()} - Quản lý dịch vụ khách hàng
            </p>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            {activeSection === "tableLayout" && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
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
                <StaffOverview tables={tables} />

                <StaffTableInfoLayout
                  tables={tables.slice(0, 8)}
                  onTableClick={setSelectedTable}
                  selectedTable={selectedTable}
                />
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

            {activeSection === "serveHistory" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                    <History className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Lịch Sử Phục Vụ
                    </h3>
                    <p className="text-sm text-neutral-300">
                      Các món đã phục vụ từ những ngày trước
                    </p>
                  </div>
                </div>

                {serveLoading ? (
                  <p className="text-indigo-200">Đang tải lịch sử...</p>
                ) : serveError ? (
                  <p className="text-red-400">{serveError}</p>
                ) : historicalServed.length === 0 ? (
                  <p className="text-center py-8 text-neutral-400">
                    Chưa có lịch sử phục vụ.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                    {historicalServed.map((od) => (
                      <div
                        key={od.orderDetailId}
                        className="bg-black/20 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-white">
                              {od.dishName}
                            </span>
                            <span className="text-sm text-neutral-400 ml-2">
                              (ID: {od.orderDetailId})
                            </span>
                          </div>
                          <span className="text-xs font-medium text-neutral-400">
                            {od.orderDate
                              ? new Date(od.orderDate).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "Không rõ ngày"}
                          </span>
                        </div>

                        {Array.isArray(od.toppings) &&
                          od.toppings.length > 0 && (
                            <div className="text-xs text-neutral-400 mt-1 pt-1 border-t border-white/10">
                              <span className="font-medium text-neutral-200">
                                Topping:{" "}
                              </span>
                              {od.toppings
                                .map((t) =>
                                  t.quantity > 1
                                    ? `${t.toppingName} x${t.quantity}`
                                    : t.toppingName
                                )
                                .join(", ")}
                            </div>
                          )}
                        {od.note && (
                          <p className="text-xs italic text-neutral-400 mt-1">
                            Ghi chú: {od.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedTable && (
        <StaffTableDetailModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onOpenPayment={() => setIsPaymentModalOpen(true)}
        />
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
              if (res.method === "CASH") {
                setShowSuccessModal("Thanh toán tiền mặt thành công!");
              } else if (res.method === "QR") {
                setShowSuccessModal("Thanh toán QR thành công!");
                setTimeout(() => (window.location.href = "/staff"), 1500);
              }
            } else if (res?.error) {
              setShowErrorModal(res.error);
            }
          }}
        />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-300">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {showSuccessModal}
              </h3>
              <p className="text-neutral-300 mb-6">
                Hoạt động đã được ghi nhận.
              </p>
              <button
                onClick={() => setShowSuccessModal("")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-300">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-neutral-300 mb-6">{showErrorModal}</p>
              <button
                onClick={() => setShowErrorModal("")}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 font-medium"
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
