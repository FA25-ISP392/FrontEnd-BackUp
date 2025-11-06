import { useEffect, useMemo, useState } from "react";
import RestaurantTableLayout from "./RestaurantTableLayout";
import {
  createBooking,
  approveBookingWithTable,
  listBookingsByTableDate,
} from "../../lib/apiBooking";
import { LogIn, AlertTriangle } from "lucide-react";

const LEAD_MINUTES = 30;

const ALL_TABLES = [
  { id: 1, seats: 2 },
  { id: 2, seats: 2 },
  { id: 3, seats: 4 },
  { id: 4, seats: 4 },
  { id: 5, seats: 6 },
  { id: 6, seats: 6 },
  { id: 7, seats: 8 },
  { id: 8, seats: 8 },
];

export default function BookingForm({
  onSubmit,
  isLoggedIn,
  onLoginRequest,
  initialData,
}) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 1,
    tableId: "",
  });
  const [fieldErrs, setFieldErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);

  useEffect(() => {
    setForm((s) => ({
      date: initialData?.date ?? s.date,
      time: initialData?.time ?? s.time,
      guests: Number(initialData?.guests ?? s.guests) || 1,
      tableId: "",
    }));
  }, [initialData]);

  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(
      tomorrow.getMonth() + 1
    ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  }, []);

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Vui lòng chọn ngày.";
    if (!form.time) e.time = "Vui lòng chọn giờ.";
    if (!e.date && !e.time) {
      const [y, m, d] = form.date.split("-").map(Number);
      const [hh, mm] = form.time.split(":").map(Number);
      const when = new Date(y, m - 1, d, hh, mm);
      const lead = new Date(Date.now() + LEAD_MINUTES * 60 * 1000);
      const [minY, minM, minD] = minDate.split("-").map(Number);
      const minDateObj = new Date(minY, minM - 1, minD);
      minDateObj.setHours(0, 0, 0, 0);

      if (when < minDateObj) {
        e.date = "Không thể đặt bàn cho ngày trong quá khứ.";
      } else if (when < lead) {
        e.time = `Giờ đặt phải cách hiện tại ít nhất ${LEAD_MINUTES} phút.`;
      }

      if (hh < 10 || hh > 23 || (hh === 23 && mm > 0)) {
        e.time = "Giờ đặt bàn chỉ từ 10:00 đến 23:00.";
      }
    }
    const n = Number(form.guests) || 1;
    if (n < 1 || n > 8) e.guests = "Số khách từ 1 đến 8.";
    return e;
  };

  const recomputeAvailable = async (date, time, guests) => {
    if (!date || !time) {
      setAvailableTables([]);
      return;
    }
    setScanning(true);
    try {
      const when = new Date(`${date}T${time}`);
      const results = [];
      for (const tb of ALL_TABLES) {
        if (tb.seats < guests) continue;
        const list = await listBookingsByTableDate(tb.id, date);
        const overlap = list.some((b) => {
          const st = String(b.status || "").toUpperCase();
          if (["CANCELLED", "REJECTED"].includes(st)) return false;
          const booked = new Date(String(b.bookingDate).replace(" ", "T"));
          return Math.abs(booked - when) < 2 * 60 * 60 * 1000;
        });
        if (!overlap) results.push({ id: tb.id, seats: tb.seats });
      }
      setAvailableTables(results);
      if (!results.find((x) => String(x.id) === String(form.tableId))) {
        setForm((s) => ({ ...s, tableId: "" }));
      }
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    recomputeAvailable(form.date, form.time, form.guests);
  }, [form.date, form.time, form.guests]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: name === "guests" ? Number(value) : value,
    }));
    setFieldErrs((s) => ({ ...s, [name]: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!isLoggedIn) {
      onLoginRequest?.(form);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrs(errs);
      return;
    }

    let pickedId = form.tableId;
    if (!pickedId && availableTables.length === 1)
      pickedId = availableTables[0].id;
    if (!pickedId) {
      alert("Vui lòng chọn bàn trong danh sách bàn trống.");
      return;
    }

    try {
      setLoading(true);
      const res = await createBooking({
        date: form.date,
        time: form.time,
        guests: form.guests,
        preferredTable: pickedId,
      });
      const bookingId = res?.result?.bookingId ?? res?.bookingId ?? res?.id;
      await approveBookingWithTable(bookingId, pickedId);
      onSubmit?.({ ...form, tableId: pickedId, bookingId });
    } catch (err) {
      alert(err?.message || "Đặt bàn thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div>
        <RestaurantTableLayout
          date={form.date}
          time={form.time}
          guests={form.guests}
        />

        {/* === THÊM noValidate VÀO FORM === */}
        <form onSubmit={submit} className="space-y-4" noValidate>
          {!isLoggedIn && (
            <div
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between gap-4 cursor-pointer"
              onClick={() => onLoginRequest?.(form)}
            >
              <div className="flex-1">
                <p className="font-semibold text-orange-700">
                  Bạn chưa đăng nhập
                </p>
                <p className="text-sm text-orange-600">
                  Đăng nhập để đặt bàn và lưu thông tin của bạn.
                </p>
              </div>
              <button
                type="button"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium flex-shrink-0 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày đặt bàn
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              min={minDate}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {fieldErrs.date && (
              <div className="flex items-center gap-1.5 mt-1.5 p-2 rounded-md bg-red-50 border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  {fieldErrs.date}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ đặt bàn
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
              min="10:00"
              max="23:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {fieldErrs.time && (
              <div className="flex items-center gap-1.5 mt-1.5 p-2 rounded-md bg-red-50 border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  {fieldErrs.time}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng khách: {form.guests}
            </label>
            <input
              type="range"
              name="guests"
              min="1"
              max="8"
              value={form.guests}
              onChange={onChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            {fieldErrs.guests && (
              <div className="flex items-center gap-1.5 mt-1.5 p-2 rounded-md bg-red-50 border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  {fieldErrs.guests}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn bàn {scanning ? "(đang quét...)" : ""}
            </label>
            <select
              name="tableId"
              value={form.tableId}
              onChange={onChange}
              disabled={
                !form.date ||
                !form.time ||
                scanning ||
                availableTables.length === 0
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">
                {!form.date || !form.time
                  ? "Chọn ngày & giờ trước"
                  : scanning
                  ? "Đang quét bàn trống..."
                  : availableTables.length === 0
                  ? "Không còn bàn phù hợp"
                  : "— Chọn 1 bàn —"}
              </option>
              {availableTables.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                >{`Bàn ${t.id} (${t.seats} người)`}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoggedIn ? (loading ? "Đang xử lý..." : "Đặt Bàn") : "Đặt Bàn"}
          </button>
        </form>
      </div>
    </div>
  );
}
