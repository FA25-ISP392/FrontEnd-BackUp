import { X, AlertTriangle, CalendarClock, Users, Table } from "lucide-react";

export default function ConfirmCancelModal({
  open = false,
  booking = null,
  disabled = false,
  onClose = () => {},
  onConfirm = async () => {},
}) {
  if (!open || !booking?.id) return null;

  const fmtVNDateTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const time = d.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = d.toLocaleDateString("vi-VN");
    return `${time} ${date}`;
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-rose-600 to-red-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold">Xác nhận hủy đơn #{booking.id}</h3>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-white/10"
              onClick={onClose}
              disabled={disabled}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 text-sm text-neutral-800 space-y-3">
            <p>
              Bạn chắc chắn muốn <b>hủy đơn đặt bàn</b> này? Hành động này sẽ
              đổi trạng thái đơn thành <b>CANCELLED</b>.
            </p>

            <div className="rounded-xl border bg-neutral-50 px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-neutral-600" />
                <span>
                  Thời gian: <b>{fmtVNDateTime(booking.bookingDate)}</b>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-600" />
                <span>
                  Số khách: <b>{booking.seat || 1}</b>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-neutral-600" />
                <span>
                  Bàn: <b>{booking.assignedTableId || "-"}</b>
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border text-sm hover:bg-neutral-50"
              disabled={disabled}
            >
              Để sau
            </button>
            <button
              onClick={onConfirm}
              disabled={disabled}
              className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm shadow-sm hover:shadow ring-1 ring-rose-700/20 disabled:opacity-50"
            >
              Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
