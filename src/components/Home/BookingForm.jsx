import { useState, useEffect, useMemo } from "react";
import RestaurantTableLayout from "./RestaurantTableLayout";

const LEAD_MINUTES = 30;

export default function BookingForm({
  onSubmit,
  isLoggedIn,
  onLoginClick,
  initialData,
}) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 1,
    preferredTable: "",
  });
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});

  useEffect(() => {
    setFormData((set) => ({
      date: initialData?.date ?? set?.date,
      time: initialData?.time ?? set?.time,
      guests: Number(initialData?.guests ?? set.guests) || 1,
      preferredTable: initialData?.preferredTable ?? set?.preferredTable ?? "",
    }));
  }, [initialData]);

  const minDate = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.date) errs.date = "Vui lòng chọn ngày.";
    if (!formData.time) errs.time = "Vui lòng chọn giờ.";
    if (!errs.date && !errs.time) {
      const [year, month, day] = formData.date.split("-").map(Number);
      const [hours, minutes] = formData.time.split(":").map(Number);
      const when = new Date(year, month - 1, day, hours, minutes, 0, 0);
      const lead = new Date(Date.now() + LEAD_MINUTES * 60 * 1000);
      if (when < lead)
        errs.time = `Giờ đặt phải cách hiện tại ít nhất ${LEAD_MINUTES} phút.`;
    }
    const n = Number(formData.guests) || 1;
    if (n < 1 || n > 8) errs.guests = "Số khách từ 1 đến 8.";
    return errs;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((set) => ({
      ...set,
      [name]: name === "guests" ? Number(value) : value,
    }));
    setFieldErrs((set) => ({ ...set, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      setShowLoginMessage(true);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrs(errs);
      return;
    }
    onSubmit?.(formData);
  };

  return (
    <div>
      <RestaurantTableLayout />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày đặt bàn
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            min={minDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {fieldErrs.date && (
            <p className="text-xs text-red-600 mt-1">{fieldErrs.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giờ đặt bàn
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {fieldErrs.time && (
            <p className="text-xs text-red-600 mt-1">{fieldErrs.time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng khách: {formData.guests}
          </label>
          <input
            type="range"
            name="guests"
            min="1"
            max="8"
            value={formData.guests}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          {fieldErrs.guests && (
            <p className="text-xs text-red-600 mt-1">{fieldErrs.guests}</p>
          )}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>8</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bàn mong muốn (tùy chọn)
          </label>
          <select
            name="preferredTable"
            value={formData.preferredTable}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Không có yêu cầu đặc biệt</option>
            <option value="1">Bàn 1 (2 người)</option>
            <option value="2">Bàn 2 (2 người)</option>
            <option value="3">Bàn 3 (4 người)</option>
            <option value="4">Bàn 4 (4 người)</option>
            <option value="5">Bàn 5 (6 người)</option>
            <option value="6">Bàn 6 (6 người)</option>
            <option value="7">Bàn 7 (8 người)</option>
            <option value="8">Bàn 8 (8 người)</option>
          </select>
          {fieldErrs.preferredTable && (
            <p className="text-xs text-red-600 mt-1">{fieldErrs.preferredTable}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors duration-300"
        >
          Đặt Bàn
        </button>
      </form>

      {!isLoggedIn && showLoginMessage && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800 mb-3">
            Bạn cần đăng nhập để tiếp tục đặt bàn.
          </p>
          <button
            type="button"
            onClick={() => onLoginClick?.(formData)}
            className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}
    </div>
  );
}
