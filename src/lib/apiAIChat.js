// src/lib/apiAIChat.js
import apiConfig from "../api/apiConfig";

export async function sendAIChatQuery({ query, history = [] }) {
  const payload = {
    query,
    history: history.map((m) => ({ role: m.role, text: m.text })),
  };

  try {
    const res = await apiConfig.post("/ai-chat/suggest", payload, {
      timeout: 30000,
    }); // ⏱️ tăng lên 30s
    const result = res?.data?.result ?? res?.data ?? res;

    if (!result?.aiText) throw new Error("Dữ liệu phản hồi không hợp lệ.");
    return result;
  } catch (err) {
    console.error("❌ Lỗi khi gửi chat AI:", err.message);
    // ✨ Thử retry 1 lần nếu lỗi timeout hoặc network
    if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
      console.warn("⏳ Thử gửi lại yêu cầu AI...");
      return sendAIChatQuery({ query, history });
    }
    throw err;
  }
}
