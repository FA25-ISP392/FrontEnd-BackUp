import { FileText } from "lucide-react";

export default function ManagerInvoicesToday({ invoices = [] }) {
  const today = new Date().toISOString().slice(0, 10);
  const todays = invoices.filter((inv) => inv.date === today);
  const total = todays.reduce((s, inv) => s + inv.amount, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hóa Đơn Hôm Nay
          </h3>
          <p className="text-sm text-neutral-600">
            Chỉ hiển thị hoá đơn ngày hôm nay
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
          <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-neutral-700">
            <div>#ID</div>
            <div>Bàn</div>
            <div>Số tiền</div>
            <div>Thời gian</div>
            <div>Thanh toán</div>
          </div>
        </div>
        <div className="divide-y divide-neutral-200">
          {todays.map((inv) => (
            <div key={inv.id} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="font-medium">{inv.id}</div>
                <div>Bàn {inv.table}</div>
                <div className="text-green-600 font-semibold">
                  ${inv.amount.toFixed(2)}
                </div>
                <div>{inv.time}</div>
                <div className="text-sm">{inv.paymentMethod}</div>
              </div>
            </div>
          ))}
          {todays.length === 0 && (
            <div className="px-6 py-10 text-center text-neutral-600">
              Không có hoá đơn hôm nay
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end text-sm text-neutral-700">
        Tổng hôm nay:{" "}
        <span className="ml-2 font-bold text-green-600">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

