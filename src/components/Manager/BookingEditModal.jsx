import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { isoToVNParts, buildISOFromVN } from "../../lib/datetimeBooking";

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
  const clamp = (v, lo = 1, hi = 8) => Math.max(lo, Math.min(hi, v | 0 || lo));
  const pad = (n) => String(n).padStart(2, "0");
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;
  const nowHM = `${pad(today.getHours())}:${pad(today.getMinutes())}`;

  useEffect(() => {
    if (!open || !booking) return;
    setSeat(Number(booking.seat || 1));
    const { date: d, time: t } = isoToVNParts(booking.bookingDate);
    setDate(d);
    setTime(t);
  }, [open, booking]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const seatNum = Number(seat) || 1;
    if (seatNum < 1 || seatNum > 8) {
      alert("Số người phải trong khoảng 1–8.");
      return;
    }
    const iso = buildISOFromVN(date, time);
    if (new Date(iso).getTime() < Date.now()) {
      alert("Thời điểm đến không được ở quá khứ.");
      return;
    }
    const payload = {
      id: booking.id,
      seat: seatNum,
      bookingDate: iso,
    };
    await onSave(payload);
  };

  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-neutral-900">
            Sửa đặt bàn
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tên khách hàng
            </label>
            <input
              disabled
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 bg-neutral-50 text-neutral-600"
              value={booking.customerName || ""}
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Số người
              </label>
              <input
                type="number"
                min={1}
                max={8}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                value={seat}
                onChange={(e) => setSeat(clamp(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Ngày đến
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={todayStr}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Giờ đến
            </label>
            <input
              type="time"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min={date === todayStr ? nowHM : undefined}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors duration-200 font-medium"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-60 transition-all duration-200 font-medium shadow-lg"
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
