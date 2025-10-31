export const RESERVE_WINDOW_MINUTES = 10;
export const RESERVE_PAST_WINDOW_MINUTES = 15;
export const DEBUG_LOG = import.meta.env.DEV;

export function isWithinWindow(
  bookingISO,
  now = new Date(),
  minsBefore = RESERVE_WINDOW_MINUTES
) {
  const b = new Date(bookingISO);
  const diffMins = (b.getTime() - now.getTime()) / 60000;
  return diffMins <= minsBefore && diffMins >= -RESERVE_PAST_WINDOW_MINUTES;
}

export function hhmm(d) {
  const t = new Date(d);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const getTableStatusBadge = (status) => {
  switch (status) {
    case "serving":
      return "bg-red-500";
    case "empty":
      return "bg-green-500";
    case "reserved":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export const getTableStatusText = (status) => {
  switch (status) {
    case "serving":
      return "Đang phục vụ";
    case "empty":
      return "Trống";
    case "reserved":
      return "Đã đặt";
    default:
      return "Không rõ";
  }
};

export const getTableStatusClass = (status) => {
  switch (status) {
    case "serving":
      return "bg-red-500 border-red-700";
    case "empty":
      return "bg-green-500 border-green-700";
    case "reserved":
      return "bg-yellow-500 border-yellow-700";
    default:
      return "bg-gray-400 border-gray-600";
  }
};
