import apiConfig from "../api/apiConfig";

export const normalizeTable = (t = {}) => {
  const id = t.tableID ?? t.tableId ?? t.id ?? t.table_id ?? null;

  const name =
    t.tableName ?? t.name ?? t.table_name ?? (id ? `Table ${id}` : "");

  const number = parseInt(
    String(t.number ?? name).match(/\d+/)?.[0] ?? id ?? 0,
    10
  );

  const capacity =
    Number(
      t.seatTable ?? t.seats ?? t.capacity ?? t.seat ?? t.seat_table ?? 0
    ) || 0;
  const isServing = t.serving ?? t.isServing ?? t.is_serving ?? null;
  const status = isServing === true ? "serving" : "empty";
  const isAvailable = status === "empty";

  return { id, tableId: id, name, number, capacity, status, isAvailable };
};

//===== Hàm lấy ra danh sách Bàn =====
export async function listTables() {
  //===== Lấy endpoint GET để lấy hết bàn ra =====
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

  return list
    .map(normalizeTable)
    .filter((x) => x.id != null)
    .sort((a, b) => (a.number || a.id) - (b.number || b.id));
}

export async function getTable(id) {
  const res = await apiConfig.get(`/tables/${id}`);
  return normalizeTable(Array.isArray(res) ? res[0] : res);
}
