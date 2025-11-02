import apiConfig from "../api/apiConfig";

export async function getSuggestedMenu(body) {
  try {
    console.log("📤 [getSuggestedMenu] Gửi payload:", body);
    const res = await apiConfig.post("/suggestions/menu", body);
    console.log("✅ [getSuggestedMenu] Nhận response:", res);

    // Nếu interceptor đã unwrap -> res là mảng
    if (Array.isArray(res)) return res;

    // Nếu interceptor chưa unwrap -> vẫn còn {result: [...]}
    if (res?.result && Array.isArray(res.result)) return res.result;

    throw new Error("❌ Dữ liệu trả về không hợp lệ từ BE");
  } catch (err) {
    console.error("🔥 [getSuggestedMenu] Lỗi:", err);
    throw err;
  }
}
