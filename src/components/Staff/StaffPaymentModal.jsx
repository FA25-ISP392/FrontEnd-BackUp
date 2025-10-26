import { useEffect, useMemo, useState } from "react";
import {
  X,
  Loader2,
  CreditCard,
  QrCode,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { getPaymentById, createPayment } from "../../lib/apiPayment";
import { getOrderById, getOrderDetailsByOrderId } from "../../lib/apiOrder";
import { getCustomerDetail, listCustomers } from "../../lib/apiCustomer";

export default function StaffPaymentModal({ open, onClose, table }) {
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [view, setView] = useState("default");
  const [cashInput, setCashInput] = useState("");
  const [cashError, setCashError] = useState("");

  const orderId = useMemo(() => table?.pendingPayment?.orderId, [table]);
  const fallbackTotal = useMemo(
    () => table?.pendingPayment?.total ?? 0,
    [table]
  );
  const paymentId = useMemo(() => table?.pendingPayment?.id, [table]);

  const VND = (n = 0) =>
    Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

  useEffect(() => {
    if (!open) {
      setQr("");
      setCheckoutUrl("");
      setLoading(false);
      setOrder(null);
      setItems([]);
      setView("default");
      setCashInput("");
      setCashError("");
      return;
    }
    async function fetchOrder() {
      if (!orderId) return;
      setLoading(true);
      try {
        const o = await getOrderById(orderId);

        if (!o.customerName && o.customerId) {
          try {
            const cus = await getCustomerDetail(o.customerId);
            o.customerName = cus?.fullName || cus?.username || cus?.email || "";
          } catch {
            try {
              const list = await listCustomers({ page: 0, size: 1000 });
              const hit = list.find(
                (x) => Number(x.customerId ?? x.id) === Number(o.customerId)
              );
              if (hit) {
                o.customerName =
                  hit.fullName || hit.username || hit.email || "";
              }
            } catch {}
          }
        }

        setOrder(o);

        const details =
          Array.isArray(o?.orderDetails) && o.orderDetails.length
            ? o.orderDetails
            : await getOrderDetailsByOrderId(orderId);

        setItems(details || []);
      } catch (e) {
        setOrder({ orderId, status: "PENDING" });
        setItems([]);
        console.warn("[StaffPaymentModal] load order fail:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [open, orderId]);

  useEffect(() => {
    if (!open || !orderId) return;
    const t = setInterval(async () => {
      try {
        const fresh = await getOrderById(orderId);
        setOrder((prev) => {
          const merged = { ...fresh };
          if (!merged.customerName && prev?.customerName) {
            merged.customerName = prev.customerName;
          }
          return merged;
        });
      } catch {}
    }, 5000);
    return () => clearInterval(t);
  }, [open, orderId]);

  const displayTotal = order?.total ?? fallbackTotal;

  useEffect(() => {
    if (!open || !paymentId) return;

    let stopped = false;

    const checkOnce = async () => {
      try {
        const p = await getPaymentById(paymentId);
        const st = String(p.status || "").toUpperCase();

        if (["COMPLETED", "PAID", "SUCCESS"].includes(st)) {
          if (!stopped) {
            alert("Thanh toán QR thành công!");
            onClose?.({ paid: true, method: "QR" });
          }
          return;
        }
        if (["FAILED", "CANCELLED"].includes(st)) {
          if (!stopped) {
            alert("Thanh toán bị hủy/không thành công.");
            onClose?.({ paid: false });
          }
          return;
        }
        if (!stopped) setTimeout(checkOnce, 3000);
      } catch {
        if (!stopped) setTimeout(checkOnce, 4000);
      }
    };

    const id = setTimeout(checkOnce, 2000);
    return () => {
      stopped = true;
      clearTimeout(id);
    };
  }, [open, paymentId, onClose]);

  function openCashForm() {
    setView("cash");
    setCashError("");
    setCashInput((v) => (v ? v : String(displayTotal || "")));
  }

  function goBack() {
    setView("default");
    setCashError("");
  }

  function parseNumber(s) {
    const num = Number(String(s).replace(/[^\d.-]/g, ""));
    return isFinite(num) ? num : 0;
  }

  const cashReceived = parseNumber(cashInput);
  const change = Math.max(0, cashReceived - Number(displayTotal || 0));
  const notEnough = cashReceived < Number(displayTotal || 0);

  async function confirmCashPayment() {
    if (!orderId) return;
    if (notEnough) {
      setCashError("Tiền nhận chưa đủ để thanh toán.");
      return;
    }
    setLoading(true);
    setCashError("");
    try {
      await createPayment({ orderId, method: "CASH" });
      alert("Đã hoàn tất thanh toán tiền mặt.");
      onClose?.({ paid: true });
    } catch (e) {
      alert(e?.message || "Xử lý tiền mặt thất bại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBankTransfer() {
    if (!paymentId) {
      alert(
        "Không tìm thấy paymentId. Vui lòng yêu cầu khách bấm Gọi thanh toán lại."
      );
      return;
    }
    setLoading(true);
    try {
      const p = await getPaymentById(paymentId);
      if (p.checkoutUrl) window.open(p.checkoutUrl, "_blank", "noopener");
      setCheckoutUrl(p.checkoutUrl || "");
      setQr(p.qrCode || "");
    } catch (e) {
      alert(e?.message || "Không lấy được thông tin thanh toán.");
    } finally {
      setLoading(false);
    }
  }

  if (!open || !table) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Xử Lý Thanh Toán</h3>
          <button
            onClick={() => onClose?.()}
            className="p-2 hover:bg-neutral-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-sm text-neutral-600 mb-4">
          Bàn <b>{table?.number}</b> • Order <b>#{orderId}</b>
          {" • Tổng: "}
          <b>{VND(displayTotal)}</b>
        </div>

        {view === "default" && (
          <>
            <div className="mb-4">
              {loading ? (
                <div className="flex items-center gap-2 text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải đơn
                  hàng…
                </div>
              ) : (
                <>
                  {order && (
                    <div className="mb-2 text-sm text-center">
                      <div className="font-medium">
                        Khách:{" "}
                        {order.customerName || order.customer?.name || "—"}
                      </div>
                    </div>
                  )}

                  {items?.length > 0 ? (
                    <div className="border rounded-xl p-3 bg-neutral-50 max-h-56 overflow-auto">
                      <div className="text-sm font-semibold mb-2 text-center">
                        Món đã gọi
                      </div>
                      <ul className="space-y-2">
                        {items.map((it, idx) => (
                          <li
                            key={it.orderDetailId || it.id || idx}
                            className="text-sm"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {it.dishName ||
                                  it.name ||
                                  `Món #${it.dishId || ""}`}
                              </span>
                              <span>
                                x{it.quantity ?? 1} •{" "}
                                {VND(
                                  it.lineTotal ??
                                    it.totalPrice ??
                                    it.unitPrice ??
                                    0
                                )}
                              </span>
                            </div>

                            {Array.isArray(it.toppings) &&
                              it.toppings.length > 0 && (
                                <div className="text-xs text-neutral-600 mt-0.5">
                                  Topping:{" "}
                                  {it.toppings
                                    .map(
                                      (tp) =>
                                        `${tp.toppingName}${
                                          tp.quantity > 1
                                            ? ` x${tp.quantity}`
                                            : ""
                                        }`
                                    )
                                    .join(", ")}
                                </div>
                              )}
                            {it.note && (
                              <div className="text-xs text-neutral-600">
                                Ghi chú: {it.note}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-500">
                      Chưa có chi tiết món.
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={loading}
                onClick={openCashForm}
                className="py-3 rounded-xl bg-neutral-900 text-white hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                Tiền mặt
              </button>

              <button
                disabled={loading}
                onClick={handleBankTransfer}
                className="py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4" />
                )}
                Mã QR (PayOS)
              </button>
            </div>

            {(qr || checkoutUrl) && (
              <div className="mt-5 space-y-3">
                {qr && (
                  <div className="border rounded-xl overflow-hidden">
                    <img
                      src={qr}
                      alt="QR Code"
                      className="w-full max-h-[360px] object-contain bg-white"
                    />
                  </div>
                )}
                {checkoutUrl && (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center py-3 rounded-xl bg-neutral-900 text-white hover:opacity-90"
                  >
                    Mở lại trang thanh toán
                  </a>
                )}
                <button
                  onClick={() => onClose?.({ paid: true })}
                  className="w-full py-3 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Đóng & đánh dấu đã xử lý
                </button>
              </div>
            )}
          </>
        )}

        {view === "cash" && (
          <div className="space-y-4">
            <div className="rounded-xl border p-4 bg-neutral-50">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Tiền nhận từ khách
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Nhập số tiền..."
                  value={cashInput}
                  onChange={(e) => {
                    setCashInput(e.target.value);
                    setCashError("");
                  }}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-800/20"
                />
                {cashInput && (
                  <div className="text-xs text-neutral-500 mt-1">
                    Bạn nhập: <b>{VND(parseNumber(cashInput))}</b>
                  </div>
                )}
                {cashError && (
                  <div className="text-sm text-red-600 mt-1">{cashError}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg border p-3">
                  <div className="text-neutral-500">Tổng tiền</div>
                  <div className="font-semibold">{VND(displayTotal)}</div>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    notEnough
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className={`text-neutral-500`}>Tiền thối</div>
                  <div
                    className={`font-semibold ${
                      notEnough ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    {VND(change)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={loading}
                onClick={goBack}
                className="py-3 rounded-xl bg-neutral-200 text-neutral-800 hover:bg-neutral-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay về
              </button>

              <button
                disabled={loading}
                onClick={confirmCashPayment}
                className={`py-3 rounded-xl text-white flex items-center justify-center gap-2 ${
                  notEnough
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                title={notEnough ? "Tiền nhận chưa đủ" : ""}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Hoàn tất thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
