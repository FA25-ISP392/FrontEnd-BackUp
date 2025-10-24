import { useEffect, useMemo, useState } from "react";
import { X, Loader2, CreditCard, QrCode } from "lucide-react";
import { getPaymentById, createPayment } from "../../lib/apiPayment";

export default function StaffPaymentModal({ open, onClose, table }) {
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const orderId = useMemo(() => table?.pendingPayment?.orderId, [table]);
  const total = useMemo(() => table?.pendingPayment?.total ?? 0, [table]);
  const paymentId = useMemo(() => table?.pendingPayment?.id, [table]);

  useEffect(() => {
    if (!open) {
      setQr("");
      setCheckoutUrl("");
      setLoading(false);
    }
  }, [open]);

  if (!open || !table) return null;

  const VND = (n = 0) =>
    Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

  async function handleCash() {
    if (!orderId) return;
    setLoading(true);
    try {
      await createPayment({ orderId, method: "CASH" });
      alert("Đã xác nhận thanh toán tiền mặt.");
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
          {" • Tổng ~ "}
          <b>{VND(total)}</b>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={loading}
            onClick={handleCash}
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
      </div>
    </div>
  );
}
