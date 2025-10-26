import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { cancelPayment } from "../lib/apiPayment";

export default function PaymentFail() {
  const qs = new URLSearchParams(window.location.search);
  const id = qs.get("id") || qs.get("paymentId") || "";
  const orderCode = qs.get("orderCode") || qs.get("orderId") || "";
  const status = qs.get("status") || "CANCELLED";

  const [seconds, setSeconds] = useState(5);
  const [msg, setMsg] = useState("Giao dịch đã bị hủy.");

  useEffect(() => {
    (async () => {
      try {
        if (orderCode) {
          await cancelPayment({ id, orderCode, status });
          setMsg("Đã ghi nhận giao dịch bị hủy.");
        }
      } catch (e) {
        setMsg(e?.message || "Không ghi nhận được trạng thái hủy.");
      }
    })();
  }, [id, orderCode, status]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (seconds === 0) window.location.href = "/staff";
  }, [seconds]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-rose-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">
          Thanh toán thất bại / bị hủy
        </h1>
        <p className="text-neutral-600 mb-4">{msg}</p>
        {orderCode && (
          <p className="text-sm text-neutral-500 mb-2">Order #{orderCode}</p>
        )}
        {id && (
          <p className="text-xs text-neutral-400 mb-6">Payment ID: {id}</p>
        )}
        <div className="text-sm text-neutral-700 mb-6">
          Tự động quay về trang Staff sau <b>{seconds}s</b>.
        </div>
        <a
          href="/staff"
          className="inline-block px-4 py-2 rounded-lg bg-neutral-900 text-white hover:opacity-90"
        >
          Về trang Staff ngay
        </a>
      </div>
    </div>
  );
}
