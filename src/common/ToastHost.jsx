import { useEffect, useState } from "react";

let idCounter = 0;
export function showToast(message, type = "success", timeout = 3000) {
  window.dispatchEvent(
    new CustomEvent("toast:show", {
      detail: { id: ++idCounter, message, type, timeout },
    })
  );
}

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onShow = (e) => {
      const t = e.detail || {};
      setToasts((list) => [...list, t]);
      setTimeout(() => {
        setToasts((list) => list.filter((x) => x.id !== t.id));
      }, t.timeout || 3000);
    };
    window.addEventListener("toast:show", onShow);
    return () => window.removeEventListener("toast:show", onShow);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white ${
            t.type === "error"
              ? "bg-red-600"
              : t.type === "warning"
              ? "bg-amber-600"
              : "bg-emerald-600"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
