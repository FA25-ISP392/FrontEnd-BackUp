import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";

/* ===== Helpers ===== */
function fmtVND(v = 0) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(v) || 0);
  } catch {
    return `${Number(v || 0).toLocaleString("vi-VN")} đ`;
  }
}

/** Cắt trực tiếp "YYYY-MM-DD HH:mm(:ss)(.ffffff)" hoặc ISO "YYYY-MM-DDTHH:mm(:ss)"
 *  -> trả "YYYY-MM-DD HH:mm". KHÔNG parse Date để không lệch UTC.
 */
function toDatetimeText(raw) {
  if (!raw) return "-";
  const s = String(raw).trim();
  const m = s.match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::\d{2})?(?:\.\d+)?/
  );
  if (m) return `${m[1]} ${m[2]}`;
  // nếu format lạ -> hiện nguyên chuỗi để còn thấy
  return s;
}

function StatusPill({ status, label }) {
  const s = String(status || "").toUpperCase();
  const vi =
    label ||
    (s === "COMPLETED"
      ? "Thành công"
      : s === "CANCELLED"
      ? "Thất bại"
      : "Đang xử lý");
  const styles =
    s === "COMPLETED"
      ? "bg-emerald-100 text-emerald-700"
      : s === "CANCELLED"
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700";
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles}`}>
      {vi}
    </span>
  );
}

function methodLabel(m, vi) {
  const M = String(m || "").toUpperCase();
  if (vi) return vi;
  if (M === "CASH") return "Tiền mặt";
  if (M === "BANK_TRANSFER") return "Thanh toán QR";
  return M;
}

/* ===== Component ===== */
export default function AdminInvoices({ invoices = [] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return invoices;
    const s = q.trim().toLowerCase();
    return invoices.filter((p) => {
      const mVi = p.methodVi || methodLabel(p.method);
      const st = String(p.status || "").toUpperCase();
      const stVi =
        p.statusVi ||
        (st === "COMPLETED"
          ? "Thành công"
          : st === "CANCELLED"
          ? "Thất bại"
          : "Đang xử lý");
      return (
        String(p.id).includes(s) ||
        String(p.orderId).includes(s) ||
        String(p.method).toLowerCase().includes(s) ||
        mVi.toLowerCase().includes(s) ||
        String(p.status).toLowerCase().includes(s) ||
        stVi.toLowerCase().includes(s)
      );
    });
  }, [q, invoices]);

  const total = filtered.reduce((sum, p) => sum + (Number(p.total) || 0), 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hóa Đơn
            </h3>
            <p className="text-sm text-neutral-600">
              Xem các hóa đơn đã thanh toán
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            className="pl-9 pr-3 py-2 border rounded-lg text-sm"
            placeholder="Tìm theo Payment ID / Order ID / Phương thức / Trạng thái"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-neutral-700">
            <div>Payment ID</div>
            <div>Order ID</div>
            <div>Số tiền</div>
            <div>Thời gian thanh toán</div>
            <div>Phương thức</div>
            <div>Trạng thái</div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200">
          {filtered.map((p) => {
            const dt =
              p.datetimeText ||
              toDatetimeText(p.paidAt || p.updatedAt || p.createdAt || "");

            return (
              <div key={p.id} className="px-6 py-4">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="font-medium">{p.id}</div>
                  <div>{p.orderId || "-"}</div>
                  <div className="text-green-600 font-semibold">
                    {fmtVND(p.total)}
                  </div>
                  <div>{p.datetimeTextPlus7 || p.datetimeText || "-"}</div>{" "}
                  <div className="text-sm">
                    {p.methodVi || methodLabel(p.method)}
                  </div>
                  <div>
                    <StatusPill status={p.status} label={p.statusVi} />
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-neutral-600">
              Chưa có hóa đơn
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end text-sm text-neutral-700">
        Tổng:{" "}
        <span className="ml-2 font-bold text-green-600">{fmtVND(total)}</span>
      </div>
    </div>
  );
}
