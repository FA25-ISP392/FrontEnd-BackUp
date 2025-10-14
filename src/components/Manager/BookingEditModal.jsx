import { useEffect, useState } from "react";
import { X } from "lucide-react";

// tách ISO -> yyyy-MM-dd & HH:mm theo local
const isoToParts = (iso) => {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
};

const toBookingISO = (dateStr, timeStr = "00:00") => {
  if (!dateStr) return new Date().toISOString();
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  return dt.toISOString();
};

export default function BookingEditModal({
  open = false,
  booking = null,
  onClose = () => {},
  onSave = async () => {},
  saving = false,
}) {
  const [seat, setSeat] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!open || !booking) return;
    setSeat(Number(booking.seat || 1));
    const { date: d, time: t } = isoToParts(booking.bookingDate);
    setDate(d);
    setTime(t);
  }, [open, booking]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const payload = {
      id: booking.id,
      seat: Number(seat) || 1,
      bookingDate: toBookingISO(date, time),
    };
    await onSave(payload);
  };

  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sửa đặt bàn</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tên khách hàng
            </label>
            <input
              disabled
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-neutral-50"
              value={booking.customerName || ""}
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Số người
              </label>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Ngày đến
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Giờ đến
            </label>
            <input
              type="time"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:opacity-90 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
