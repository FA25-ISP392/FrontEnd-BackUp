import apiConfig from "../api/apiConfig";
import { getCurrentUser } from "./auth";

export const ITEM_TYPES = {
  DISH: "DISH",
  TOPPING: "TOPPING",
};

// 🧩 Chuẩn hóa dữ liệu DailyPlan
export function normalizeDailyPlan(p = {}) {
  return {
    planId: p.planId ?? p.id ?? null,
    itemId: p.itemId ?? null,
    itemName: p.itemName ?? "",
    itemType: p.itemType ?? "DISH",
    planDate: p.planDate ?? "",
    plannedQuantity: Number(p.plannedQuantity ?? 0),
    remainingQuantity: Number(p.remainingQuantity ?? 0),
    status: p.status ?? false,
    staffId: p.staffId ?? null,
    staffName: p.staffName ?? "",
    approvedByStaffId: p.approvedByStaffId ?? null,
    approverName: p.approverName ?? "",
  };
}

function pickResult(res) {
  if (!res) return null;
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.result)) return res.result;
  if (res?.result && typeof res.result === "object") return res.result;
  return res;
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

/* ================= READ ================= */
export async function listDailyPlans() {
  const res = await apiConfig.get("/daily-plans", authHeaders());
  const data = pickResult(res) ?? [];
  return Array.isArray(data) ? data.map(normalizeDailyPlan) : [];
}

/* ================= CREATE (BATCH) ================= */
export async function createDailyPlansBatch(listPayload = []) {
  const user = getCurrentUser() || {};
  const staffId = user?.staffId ?? user?.id;
  const body = listPayload.map((p) => ({
    itemId: Number(p.itemId),
    itemType: String(p.itemType || ITEM_TYPES.DISH).toUpperCase(),
    plannedQuantity: Number(p.plannedQuantity),
    planDate: p.planDate,
    staffId: Number(p.staffId ?? staffId),
  }));

  console.log("📦 Payload gửi lên batch:", JSON.stringify(body, null, 2));
  try {
    const res = await apiConfig.post("/daily-plans/batch", body, authHeaders());
    const data = pickResult(res) ?? [];
    return Array.isArray(data) ? data.map(normalizeDailyPlan) : [];
  } catch (err) {
    console.warn("⚠️ BE trả lỗi mapper nhưng dữ liệu có thể vẫn lưu:", err);
    throw err;
  }
}

/* ================= UPDATE ================= */
export async function updateDailyPlan(planId, payload = {}) {
  if (!planId) throw new Error("Thiếu planId để cập nhật!");

  const body = {};
  if (payload.plannedQuantity != null)
    body.plannedQuantity = Number(payload.plannedQuantity);
  if (payload.remainingQuantity != null)
    body.remainingQuantity = Number(payload.remainingQuantity);
  if (payload.status != null) body.status = payload.status;

  console.log("📤 [PUT] Gửi updateDailyPlan:", planId, body); // ✅ log payload gửi lên

  if (Object.keys(body).length === 0) {
    console.warn("⚠️ Không có trường nào để cập nhật!");
    return;
  }

  try {
    const res = await apiConfig.put(
      `/daily-plans/${planId}`,
      body,
      authHeaders(),
    );
    console.log("✅ [PUT] BE trả về:", res);
    return normalizeDailyPlan(pickResult(res) ?? {});
  } catch (err) {
    console.error("❌ [PUT] Lỗi update plan:", err.response || err);
    throw err;
  }
}

/* ================= APPROVE BATCH ================= */
export async function approveAllDailyPlans(plans = []) {
  if (!plans.length) return [];
  const body = { planIds: plans.map((p) => p.planId) };
  const res = await apiConfig.put(
    "/daily-plans/batch-approve",
    body,
    authHeaders(),
  );
  const data = pickResult(res) ?? [];
  return Array.isArray(data) ? data.map(normalizeDailyPlan) : [];
}

/* ================= DELETE ================= */
export async function deleteDailyPlan(planId) {
  if (!planId) throw new Error("Thiếu planId để xoá!");
  const res = await apiConfig.delete(`/daily-plans/${planId}`, authHeaders());
  return pickResult(res);
}
