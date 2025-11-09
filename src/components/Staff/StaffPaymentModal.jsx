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
import { VND, parseNumber } from "../Staff/staffUtils";

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

  //===== Hàm xử lý khi ấn Xử Lý Thanh Toán =====
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
        //===== Gọi ra hàm để lấy những món thuộc orderId
        const o = await getOrderById(orderId);
        if (!o.customerName && o.customerId) {
          try {
            //===== Gọi ra hàm để lấy KH =====
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

    //===== Hàm xử lý và theo dỏi trạng thái Thanh Toán của KH =====
    const checkOnce = async () => {
      try {
        //===== Gọi hàm lấy ra payment của KH =====
        const p = await getPaymentById(paymentId);
        const st = String(p.status || "").toUpperCase();

        //===== Nếu đã Thanh Toán thì tiến hành callBack trả về =====
        if (["COMPLETED", "PAID", "SUCCESS"].includes(st)) {
          if (!stopped) {
            onClose?.({ paid: true, method: "QR" });
          }
          return;
        }
        if (["FAILED", "CANCELLED"].includes(st)) {
          if (!stopped) {
            onClose?.({ paid: false, error: "Thanh toán QR bị hủy/thất bại." });
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

  function goBack() {
    setView("default");
    setCashError("");
  }

  const cashReceived = parseNumber(cashInput);
  const change = Math.max(0, cashReceived - Number(displayTotal || 0));
  const notEnough = cashReceived < Number(displayTotal || 0);

  //===== Hàm gọi khi đã xác nhận Thanh Toán = Tiền Mặt =====
  async function confirmCashPayment() {
    if (!orderId) return;
    if (notEnough) {
      setCashError("Tiền nhận chưa đủ để thanh toán.");
      return;
    }
    setLoading(true);
    setCashError("");
    try {
      //===== Gọi hàm tạo ra Payment mới =====
      await createPayment({ orderId, method: "CASH" });
      onClose?.({ paid: true, method: "CASH" });
    } catch (e) {
      onClose?.({
        paid: false,
        error: e?.message || "Xử lý tiền mặt thất bại.",
      });
    } finally {
      setLoading(false);
    }
  }

  //===== Hàm xử lý khi Staff chọn Thanh Toán = Tiền Mặt =====
  function openCashForm() {
    setView("cash");
    setCashError("");
    setCashInput((v) => (v ? v : String(displayTotal || "")));
  }

  //===== Hàm xử lý khi Staff chọn Thanh Toán = QR =====
  async function handleBankTransfer() {
    if (!paymentId) {
      onClose?.({
        paid: false,
        error: "Không tìm thấy paymentId. Yêu cầu khách gọi thanh toán lại.",
      });
      return;
    }
    setLoading(true);
    try {
      //===== Gọi hàm để lấy ra Thanh Toán dựa trên Id =====
      const p = await getPaymentById(paymentId);
      if (p.checkoutUrl) window.open(p.checkoutUrl, "_blank", "noopener");
      //===== Sau khi gọi hàm thì sẽ checkoutURL =====
      setCheckoutUrl(p.checkoutUrl || "");
      //===== Đưa vào QR code =====
      setQr(p.qrCode || "");
    } catch (e) {
      onClose?.({
        paid: false,
        error: e?.message || "Không lấy được thông tin thanh toán.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!open || !table) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Xử Lý Thanh Toán</h3>
          <button
            onClick={() => onClose?.()}
            className="p-2 hover:bg-white/10 rounded-lg text-neutral-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-sm text-neutral-300 mb-4">
          Bàn <b>{table?.number}</b> • Order <b>#{orderId}</b>
          {" • Tổng: "}
          <b className="text-green-400">{VND(displayTotal)}</b>
        </div>

        {view === "default" && (
          <>
            <div className="mb-4">
              {loading ? (
                <div className="flex items-center gap-2 text-neutral-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải đơn
                  hàng…
                </div>
              ) : (
                <>
                  {order && (
                    <div className="mb-2 text-sm text-center text-neutral-300">
                      <div className="font-medium">
                        Khách:{" "}
                        <span className="text-white">
                          {order.customerName ||
                            order.customer?.fullName ||
                            order.customer?.name ||
                            order.customer?.email ||
                            "—"}
                        </span>
                      </div>
                    </div>
                  )}

                  {items?.length > 0 ? (
                    <div className="border rounded-xl p-3 bg-black/20 border-white/10 max-h-56 overflow-auto scrollbar-thin scrollbar-thumb-neutral-700">
                      <div className="text-sm font-semibold mb-2 text-center text-white">
                        Món đã gọi
                      </div>
                      <ul className="space-y-2">
                        {items.map((it, idx) => (
                          <li
                            key={it.orderDetailId || it.id || idx}
                            className="text-sm"
                          >
                            <div className="flex justify-between text-neutral-200">
                              <span className="font-medium">
                                {it.dishName ||
                                  it.name ||
                                  `Món #${it.dishId || ""}`}
                              </span>
                              <span className="text-neutral-300">
                                x{it.quantity ?? 1} •{" "}
                                <span className="text-green-400 font-medium">
                                  {VND(
                                    it.lineTotal ??
                                      it.totalPrice ??
                                      it.unitPrice ??
                                      0
                                  )}
                                </span>
                              </span>
                            </div>

                            {Array.isArray(it.toppings) &&
                              it.toppings.length > 0 && (
                                <div className="text-xs text-neutral-400 mt-0.5">
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
                              <div className="text-xs text-neutral-400 italic">
                                Ghi chú: {it.note}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-400">
                      Chưa có chi tiết món.
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={loading}
                //===== Bắt sự kiện Staff chọn Cash =====
                onClick={openCashForm}
                className="py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
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
                //===== Bắt sự kiện Staff chọn QR =====
                onClick={handleBankTransfer}
                className="py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4" />
                )}
                Mã QR
              </button>
            </div>

            {(qr || checkoutUrl) && (
              <div className="mt-5 space-y-3">
                {qr && (
                  <div className="border rounded-xl overflow-hidden bg-white p-2">
                    <img
                      src={qr}
                      alt="QR Code"
                      className="w-full max-h-[360px] object-contain"
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
                  onClick={() => onClose?.({ paid: true, method: "QR" })}
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
            <div className="rounded-xl border p-4 bg-black/20 border-white/10">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-neutral-300">
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
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/50 bg-gray-700 border-gray-600 text-white"
                />
                {cashInput && (
                  <div className="text-xs text-neutral-400 mt-1">
                    Bạn nhập:{" "}
                    <b className="text-white">{VND(parseNumber(cashInput))}</b>
                  </div>
                )}
                {cashError && (
                  <div className="text-sm text-red-400 mt-1">{cashError}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-700 rounded-lg border border-white/10 p-3">
                  <div className="text-neutral-400">Tổng tiền</div>
                  <div className="font-semibold text-white">
                    {VND(displayTotal)}
                  </div>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    notEnough
                      ? "bg-red-900/30 border-red-500/30"
                      : "bg-green-900/30 border-green-500/30"
                  }`}
                >
                  <div className={`text-neutral-400`}>Tiền thối</div>
                  <div
                    className={`font-semibold ${
                      notEnough ? "text-red-400" : "text-green-400"
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
                className="py-3 rounded-xl bg-neutral-600 text-white hover:bg-neutral-500 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay về
              </button>

              <button
                disabled={loading || notEnough}
                onClick={confirmCashPayment}
                className={`py-3 rounded-xl text-white flex items-center justify-center gap-2 ${
                  notEnough
                    ? "bg-neutral-500 cursor-not-allowed"
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
