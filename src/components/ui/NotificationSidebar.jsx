import { Bell, X, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function NotificationSidebar({ isOpen, onClose }) {
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "Đơn hàng mới",
      message: "Bàn 5 vừa đặt món Pizza Margherita",
      time: "2 phút trước",
      isRead: false,
      icon: "🍕",
    },
    {
      id: 2,
      type: "system",
      title: "Cập nhật hệ thống",
      message: "Hệ thống đã được cập nhật lên phiên bản mới",
      time: "1 giờ trước",
      isRead: true,
      icon: "⚙️",
    },
    {
      id: 3,
      type: "warning",
      title: "Cảnh báo",
      message: "Món Pasta Carbonara sắp hết nguyên liệu",
      time: "3 giờ trước",
      isRead: false,
      icon: "⚠️",
    },
    {
      id: 4,
      type: "success",
      title: "Hoàn thành",
      message: "Đơn hàng bàn 3 đã được thanh toán thành công",
      time: "5 giờ trước",
      isRead: true,
      icon: "✅",
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <Bell className="w-4 h-4 text-blue-500" />;
      case "system":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.isRead
                      ? "bg-gray-50 border-gray-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                    <div className="text-lg">{notification.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
