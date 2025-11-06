import { useState, useEffect } from "react";
import {
  listDailyPlans,
  approveAllDailyPlans,
  deleteDailyPlan,
} from "../../lib/apiDailyPlan";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function ManagerDailyPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Xác nhận",
    confirmColor: "bg-red-600 hover:bg-red-700",
  });

  // Tự động đóng modal thông báo
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    (async () => {
      try {
        const allPlans = await listDailyPlans();
        const todayPlans = (allPlans || []).filter(
          (p) =>
            p.planDate === today &&
            p.status === false &&
            p.itemType === "TOPPING",
        );
        setPlans(todayPlans);
      } catch (err) {
        console.error("❌ Lỗi load kế hoạch:", err);
        setErrorMessage("Lỗi khi tải kế hoạch.");
      }
    })();
  }, [today]);

  const _approveAll = async () => {
    setLoading(true);
    setConfirmModal({ isOpen: false });
    try {
      await approveAllDailyPlans(plans);
      setSuccessMessage("Đã duyệt toàn bộ kế hoạch!");
      setPlans([]);
    } catch (err) {
      console.error("❌ Lỗi duyệt:", err);
      setErrorMessage("Không thể duyệt kế hoạch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAll = () => {
    if (plans.length === 0) {
      setErrorMessage("Không có kế hoạch nào để duyệt!");
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận duyệt toàn bộ?",
      message: `Bạn có chắc muốn duyệt tất cả ${plans.length} kế hoạch món ăn hôm nay?`,
      onConfirm: _approveAll,
      confirmText: "Duyệt toàn bộ",
      confirmColor: "bg-green-600 hover:bg-green-700",
    });
  };

  const _reject = async (planId, itemName) => {
    setConfirmModal({ isOpen: false });
    try {
      await deleteDailyPlan(planId);
      setPlans((prev) => prev.filter((p) => p.planId !== planId));
      setSuccessMessage(`Đã từ chối "${itemName}"`);
    } catch (err) {
      setErrorMessage("Lỗi khi xoá yêu cầu. Vui lòng thử lại.");
    }
  };

  const handleReject = (planId, itemName) => {
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận từ chối?",
      message: `Bạn có chắc muốn từ chối yêu cầu cho món "${itemName}"?`,
      onConfirm: () => _reject(planId, itemName),
      confirmText: "Từ chối",
      confirmColor: "bg-red-600 hover:bg-red-700",
    });
  };

  return (
    <div className="p-0 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          Yêu Cầu Kế Hoạch Trong Ngày
        </h2>
        <button
          onClick={handleApproveAll}
          disabled={loading || plans.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="h-4 w-4" />
          {loading ? "Đang duyệt..." : "Duyệt toàn bộ"}
        </button>
      </div>
      {plans.length === 0 ? (
        <p className="text-indigo-200 text-center">Không có yêu cầu mới nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.planId}
              className="bg-black/20 p-4 rounded-xl shadow-lg border border-white/10 hover:shadow-xl transition-all"
            >
              <h4 className="font-semibold mb-1 text-white">{p.itemName}</h4>
              <p className="text-sm text-neutral-300 mb-3">
                Số lượng: {p.plannedQuantity}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-blue-400 text-sm gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Chờ duyệt</span>
                </div>
                <button
                  onClick={() => handleReject(p.planId, p.itemName)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 text-xs font-medium transition-all transform hover:scale-105"
                >
                  <XCircle className="h-4 w-4" />
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL XÁC NHẬN (CONFIRM) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${
                  confirmModal.confirmColor === "bg-red-600 hover:bg-red-700"
                    ? "bg-red-500/20"
                    : "bg-green-500/20"
                }`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${
                    confirmModal.confirmColor === "bg-red-600 hover:bg-red-700"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {confirmModal.title}
                </h3>
                <p className="text-neutral-300 mb-6">{confirmModal.message}</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmModal({ isOpen: false })}
                    className="px-4 py-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-all font-medium text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmModal.onConfirm}
                    className={`px-4 py-2 rounded-lg ${confirmModal.confirmColor} text-white transition-all font-medium text-sm`}
                  >
                    {confirmModal.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 🔽 MODAL THÔNG BÁO (ĐÃ SỬA) 🔽 --- */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-green-500/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Thành công!</h3>
              <p className="text-neutral-300 mb-6">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage("")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-500/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-neutral-300 mb-6">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- 🔼 HẾT MODAL THÔNG BÁO 🔼 --- */}
    </div>
  );
}
