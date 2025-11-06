import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, MessageSquare } from "lucide-react";
import { sendAIChatQuery } from "../../lib/apiAIChat";
import usePersistedState from "../../hooks/usePersistedState";
console.log("🚀 AIChatBubble component loaded");

const MESSAGE_CLASSES = {
  user: "bg-orange-500 text-white rounded-t-xl rounded-bl-xl ml-auto",
  model:
    "bg-white text-neutral-800 rounded-t-xl rounded-br-xl mr-auto border border-neutral-200 shadow-sm",
};

export default function AIChatBubble({ customerId, isLoggedIn }) {
  console.log("🚀 AIChatBubble component loaded");
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Sử dụng usePersistedState để lưu lịch sử chat theo customerId
  const HISTORY_KEY = `ai_chat_history_${customerId}`;
  const [history, setHistory] = usePersistedState(HISTORY_KEY, []);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    // Clear history nếu người dùng thay đổi (chuyển đổi tài khoản)
    const oldId = localStorage.getItem("last_chat_user_id");
    if (customerId && oldId && String(oldId) !== String(customerId)) {
      setHistory([]);
    }
    if (customerId) {
      localStorage.setItem("last_chat_user_id", customerId);
    }
  }, [customerId, setHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading || !isLoggedIn) return;

    const userQuery = query.trim();
    setQuery("");
    setLoading(true);

    const newLocalHistory = [...history, { role: "user", text: userQuery }];
    setHistory(newLocalHistory);

    try {
      const response = await sendAIChatQuery({
        query: userQuery,
        history: history, // Gửi lịch sử cũ (chưa có tin nhắn mới nhất)
      });

      setHistory(response.updatedHistory);
    } catch (e) {
      // Hoàn lại history nếu API thất bại (hoặc thông báo lỗi)
      const errorMsg = {
        role: "model",
        text: e?.message || "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
      };
      setHistory([...newLocalHistory, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để sử dụng tính năng Chat AI.");
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá lịch sử chat?")) {
      setHistory([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isLoggedIn) return null; // Không hiển thị nếu chưa đăng nhập
  console.log("💬 Props:", { isLoggedIn, customerId });
  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 animate-pulse-neon"
          title="Chat với AI"
        >
          <Bot className="w-8 h-8 mx-auto" />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[80vh] max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl border border-neutral-200 transform animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-t-2xl shadow-md">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-bold">Trợ lý AI MónCủaBạn</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                className="p-1 text-sm rounded-full text-white/80 hover:text-white transition-colors"
                title="Xoá lịch sử chat"
                disabled={loading}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggle}
                className="p-1 rounded-full hover:bg-white/20 transition"
                title="Đóng chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {history.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                <Bot className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm">
                  Tôi có thể giúp bạn chọn món ăn phù hợp với mục tiêu dinh
                  dưỡng. Hãy bắt đầu!
                </p>
              </div>
            )}
            {history.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 text-sm whitespace-pre-wrap shadow-md ${
                    MESSAGE_CLASSES[msg.role]
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-2 text-sm bg-white text-neutral-800 rounded-t-xl rounded-br-xl mr-auto border border-neutral-200 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2 text-blue-500" />
                  <span>AI đang trả lời...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-neutral-200 bg-white rounded-b-2xl">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <textarea
                rows={1}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                className="flex-1 resize-none border border-neutral-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                placeholder="Hỏi AI về món ăn..."
              />
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mx-auto" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
