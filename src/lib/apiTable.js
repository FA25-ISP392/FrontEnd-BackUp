import apiConfig from "../api/apiConfig";

const toStatus = (raw) => {
  const s = String(raw ?? "")
    .trim()
    .toUpperCase();
  if (["EMPTY", "RESERVED", "SERVING"].includes(s)) return s.toLowerCase();
  if (raw === true || Number(raw) === 1) return "empty";
  if (raw === false || Number(raw) === 0) return "serving";
  return "empty";
};

// 👉 ép kiểu & tính number/capacity đúng
export const normalizeTable = (t = {}) => {
  const id = t.tableID ?? t.tableId ?? t.id ?? t.table_id ?? null;
  const name =
    t.tableName ?? t.name ?? t.table_name ?? (id ? `Table ${id}` : "");

  const number = parseInt(
    String(t.number ?? name).match(/\d+/)?.[0] ?? id ?? 0,
    10
  );

  // ép số để tránh "0" (string) -> 0
  const capacity =
    Number(
      t.seatTable ?? t.seats ?? t.capacity ?? t.seat ?? t.seat_table ?? 0
    ) || 0;

  const rawStatus = t.status ?? t.isAvailable ?? t.available ?? t.is_available;
  const s = String(rawStatus ?? "")
    .trim()
    .toUpperCase();
  const status =
    s === "SERVING" ? "serving" : s === "RESERVED" ? "reserved" : "empty";
  const isAvailable = status === "empty";

  return { id, tableId: id, name, number, capacity, status, isAvailable };
};

// 👉 luôn xin size lớn + handle cả result/content/array
export async function listTables() {
  const res = await apiConfig.get("/tables", {
    params: { page: 0, size: 1000 },
  });
  const list = Array.isArray(res)
    ? res
    : Array.isArray(res?.result)
    ? res.result
    : Array.isArray(res?.content)
    ? res.content
    : [];

  const normalized = list
    .map(normalizeTable)
    .filter((x) => x.id != null)
    .sort((a, b) => (a.number || a.id) - (b.number || b.id));

  // debug nhẹ để bạn kiểm tra đúng 8 bàn & seat
  console.log("[/tables] raw:", res);
  console.log("[/tables] normalized:", normalized);

  return normalized;
}

export async function getTable(id) {
  const res = await apiConfig.get(`/tables/${id}`);
  return normalizeTable(Array.isArray(res) ? res[0] : res);
}
