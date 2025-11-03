import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 text-neutral-800 p-8">
      <AlertTriangle className="w-24 h-24 text-amber-500 mb-6" />
      <h1 className="text-6xl font-bold text-neutral-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Không tìm thấy trang</h2>
      <p className="text-neutral-600 mb-8 max-w-md text-center">
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có vẻ như
        đường dẫn đã bị sai hoặc trang đã bị xóa.
      </p>
      <Link
        to="/home"
        className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-200"
      >
        Quay về Trang Chủ
      </Link>
    </div>
  );
}
