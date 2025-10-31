import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
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

// Logic và Hằng số đã được chuyển sang file utils
import {
  isWithinWindow,
  hhmm,
  DEBUG_LOG,
} from "../components/Staff/staffUtils";

// Các component con đã được tách
import StaffOverview from "../components/Staff/StaffOverview";
import StaffTableDetailModal from "../components/Staff/StaffTableDetailModal";

export default function StaffPage() {
  const [activeSection, setActiveSection] = useState("tableLayout");
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // State cho ServeBoard
  const [readyOrders, setReadyOrders] = useState([]);
  const [servedOrders, setServedOrders] = useState([]);
  const [serveLoading, setServeLoading] = useState(false);
  const [serveError, setServeError] = useState("");

  // State cho Modals thông báo
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showErrorModal, setShowErrorModal] = useState("");

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
      setShowErrorModal(e?.message || "Cập nhật trạng thái thất bại.");
    }
  };

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {showSuccessModal}
              </h3>
              <p className="text-neutral-600 mb-6">
                Hoạt động đã được ghi nhận.
              </p>
              <button
                onClick={() => setShowSuccessModal("")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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
              <p className="text-neutral-600 mb-6">{showErrorModal}</p>
              <button
                onClick={() => setShowErrorModal("")}
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
