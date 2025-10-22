import apiConfig from "../api/apiConfig";

/**
 * 🧩 Gọi API quản lý Dish–Topping (món ăn – topping)
 * Tương thích backend Railway (chỉ có POST batch, không có DELETE)
 *
 * Base URL thực tế:
 * https://backend-production-0865.up.railway.app/isp392/api/dish-topping
 */

// 🟢 Lấy danh sách tất cả dish–topping
export async function listDishTopping() {
  const token = localStorage.getItem("token");
  try {
    const res = await apiConfig.get("/dish-topping", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách dish-topping:", err);
    throw err;
  }
}

// 🟢 Ghi đè danh sách topping của một món ăn (batch)
export async function addDishToppingsBatch(dishId, toppingIds = []) {
  if (!dishId || !Array.isArray(toppingIds)) {
    throw new Error("Thiếu dishId hoặc toppingIds không hợp lệ");
  }

  try {
    const token = localStorage.getItem("token");

    const payload = {
      dishId: Number(dishId),
      toppingIds: toppingIds.map((x) => Number(x)), // 👈 ép kiểu int
    };

    console.log("📦 Gửi batch dish-topping:", payload);

    const res = await apiConfig.post("/dish-topping", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Tạo dish-topping OK:", res);
    return res?.result ?? res;
  } catch (err) {
    if (err.response) {
      console.error(
        "❌ Backend trả lỗi:",
        err.response.status,
        err.response.data,
      );
    }
    console.error("❌ Lỗi khi tạo/ghi đè dish-toppings:", err);
    throw err;
  }
}
// 🟣 Lấy danh sách topping của một món ăn cụ thể
export async function getToppingsByDishId(dishId) {
  if (!dishId) throw new Error("Thiếu dishId khi lấy topping");

  try {
    const token = localStorage.getItem("token");
    const res = await apiConfig.get(`/dish-topping/${dishId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(`🍕 Topping của món ${dishId}:`, res);
    return Array.isArray(res) ? res : res?.result ?? [];
  } catch (err) {
    console.error("❌ Lỗi khi lấy topping của món:", err);
    throw err;
  }
}
