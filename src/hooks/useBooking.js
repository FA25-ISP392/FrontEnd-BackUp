import { useState, useEffect } from "react";

const KEY = "booking:draft";

//===== Khi khách hàng điền thông tin mà chưa đăng nhập thì gọi hàm này để lưu vào localStorage =====
function saveBookingDraft(draft) {
  localStorage.setItem(KEY, JSON.stringify(draft));
  window.dispatchEvent(new Event("booking:draft:changed"));
}

function loadBookingDraft() {
  try {
    const tmp = localStorage.getItem(KEY);
    return tmp ? JSON.parse(tmp) : null;
  } catch {
    return null;
  }
}

function clearBookingDraft() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("booking:draft:changed"));
}

export function useBooking() {
  const [bookingDraft, setBookingDraft] = useState(loadBookingDraft());

  useEffect(() => {
    const handleChange = () => setBookingDraft(loadBookingDraft());
    window.addEventListener("booking:draft:changed", handleChange);
    return () =>
      window.removeEventListener("booking:draft:changed", handleChange);
  }, []);

  return {
    bookingDraft,
    saveBookingDraft,
    clearBookingDraft,
    reloadBookingDraft: () => setBookingDraft(loadBookingDraft()),
  };
}
