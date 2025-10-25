import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getPaymentById } from "../lib/apiPayment";

export default function PaymentSuccess() {
  const qs = new URLSearchParams(window.location.search);
  const paymentId = qs.get("paymentId");
  const orderId = qs.get("orderId");
  const [seconds, setSeconds] = useState(5);
  const [statusText, setStatusText] = useState("Đang xác nhận giao dịch…");

  useEffect(() => {
    (async () => {
      try {
        if (paymentId) {
          const p = await getPaymentById(paymentId);
          const st = String(p.status || "").toUpperCase();
          if (["COMPLETED", "PAID", "SUCCESS"].includes(st)) {
            setStatusText("Thanh toán thành công!");
          } else if (st === "PENDING") {
            setStatusText("Giao dịch đang chờ xác nhận (PENDING)...");
          } else {
            setStatusText(`Trạng thái: ${st}`);
          }
        } else {
          setStatusText("Thanh toán thành công!");
        }
      } catch {
        setStatusText("Thanh toán thành công!");
      }
    })();
  }, [paymentId]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (seconds === 0) window.location.href = "/staff";
  }, [seconds]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-emerald-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Thanh toán thành công</h1>
        <p className="text-neutral-600 mb-4">{statusText}</p>

        {orderId && (
          <p className="text-sm text-neutral-500 mb-2">Order #{orderId}</p>
        )}
        {paymentId && (
          <p className="text-xs text-neutral-400 mb-6">
            Payment ID: {paymentId}
          </p>
        )}

        <div className="text-sm text-neutral-700 mb-6">
          Tự động quay về trang Staff sau <b>{seconds}s</b>.
        </div>

        <a
          href="/staff"
          className="inline-block px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Về trang Staff ngay
        </a>
      </div>
    </div>
  );
}
