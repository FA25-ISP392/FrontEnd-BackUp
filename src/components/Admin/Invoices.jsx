import { FileText, Search } from "lucide-react";

export default function AdminInvoices({ invoices = [] }) {
  const total = invoices.reduce((s, inv) => s + inv.amount, 0);

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
              Xem toàn bộ hóa đơn (quá khứ & hiện tại)
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            className="pl-9 pr-3 py-2 border rounded-lg text-sm"
            placeholder="Tìm theo bàn / phương thức"
          />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-neutral-700">
            <div>#ID</div>
            <div>Bàn</div>
            <div>Số tiền</div>
            <div>Thời gian</div>
            <div>Ngày</div>
            <div>Thanh toán</div>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {invoices.map((inv) => (
            <div key={inv.id} className="px-6 py-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="font-medium">{inv.id}</div>
                <div>Bàn {inv.table}</div>
                <div className="text-green-600 font-semibold">
                  ${inv.amount.toFixed(2)}
                </div>
                <div>{inv.time}</div>
                <div>{inv.date}</div>
                <div className="text-sm">{inv.paymentMethod}</div>
              </div>
            </div>
          ))}
          {invoices.length === 0 && (
            <div className="px-6 py-10 text-center text-neutral-600">
              Chưa có hóa đơn
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end text-sm text-neutral-700">
        Tổng:{" "}
        <span className="ml-2 font-bold text-green-600">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

