import { useMemo, useState } from "react";
import { FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";

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

function toDatetimeText(raw) {
  if (!raw) return "-";
  const s = String(raw).trim();
  const m = s.match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::\d{2})?(?:\.\d+)?/
  );
  if (m) return `${m[1]} ${m[2]}`;
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

/**
 * Phân trang giống AccountManagement:
 * - Có dải trang kèm "..."
 * - Nút Trước/Sau
 * - Hiển thị "từ–đến trong tổng số"
 *
 * Props yêu cầu:
 *   invoices: array item
 *   pageInfo: { page, size, totalPages, totalElements, first?, last? }
 *   onPageChange: (p) => void
 *   page: số trang hiện tại (1-based) -> nên truyền vào để đồng bộ với state invPage ở Admin.jsx
 */
export default function AdminInvoices({
  invoices = [],
  pageInfo = { page: 1, size: 6, totalPages: 1, totalElements: 0 },
  onPageChange = () => {},
  page, // 1-based
}) {
  const [q, setQ] = useState("");

  // Lấy current page 1-based: ưu tiên prop `page`, fallback pageInfo.page (coi như 1-based)
  const curPage = Number(page || pageInfo.page || 1);
  const pageSize = Number(pageInfo.size || 6);
  const totalPages = Number(pageInfo.totalPages || 1);
  const totalElements = Number(pageInfo.totalElements || invoices.length || 0);

  const buildPages = () => {
    const maxLength = 5;
    if (totalPages <= maxLength) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const left = Math.max(1, curPage - 2);
    const right = Math.min(totalPages, curPage + 2);
    const pages = [];
    if (left > 1) pages.push(1, "...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages) pages.push("...", totalPages);
    return pages;
  };

  // Tính khoảng hiển thị "từ–đến"
  const from = totalElements === 0 ? 0 : (curPage - 1) * pageSize + 1;
  const to = Math.min(curPage * pageSize, totalElements);

  // Tìm kiếm cục bộ (trên trang hiện tại)
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
        String(p.id).toLowerCase().includes(s) ||
        String(p.orderId || "")
          .toLowerCase()
          .includes(s) ||
        String(p.method || "")
          .toLowerCase()
          .includes(s) ||
        mVi.toLowerCase().includes(s) ||
        String(p.status || "")
          .toLowerCase()
          .includes(s) ||
        stVi.toLowerCase().includes(s)
      );
    });
  }, [q, invoices]);

  // Tổng tiền của danh sách đã lọc trên trang hiện tại
  const total = filtered.reduce((sum, p) => sum + (Number(p.total) || 0), 0);

  const isFirst = curPage <= 1;
  const isLast = curPage >= totalPages;

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
          {filtered.map((p) => (
            <div
              key={p.id}
              className="px-6 py-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="font-medium">{p.id}</div>
                <div>{p.orderId || "-"}</div>
                <div className="text-green-600 font-semibold">
                  {fmtVND(p.total)}
                </div>
                <div>
                  {p.datetimeTextPlus7 || toDatetimeText(p.createdAt) || "-"}
                </div>
                <div className="text-sm">
                  {p.methodVi || methodLabel(p.method)}
                </div>
                <div>
                  <StatusPill status={p.status} label={p.statusVi} />
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-neutral-600">
              Chưa có hóa đơn
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-700">
        <div className="flex items-center gap-3">
          <span>
            Tổng trên trang:{" "}
            <span className="ml-1 font-bold text-green-600">
              {fmtVND(total)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, curPage - 1))}
            disabled={isFirst}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isFirst
                ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
                : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </button>

          <div className="flex items-center gap-1">
            {buildPages().map((p, i) =>
              p === "..." ? (
                <span
                  key={`e-${i}`}
                  className="px-3 py-2 text-neutral-500 font-medium"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    p === curPage
                      ? "bg-orange-500 text-white shadow-lg transform scale-105"
                      : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages || 1, curPage + 1))}
            disabled={isLast}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isLast
                ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
                : "text-neutral-700 bg-white border border-neutral-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm"
            }`}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
