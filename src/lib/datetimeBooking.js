export const fmtVNDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} - ${pad(
    d.getDate()
  )}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
