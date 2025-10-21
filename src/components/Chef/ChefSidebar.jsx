import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  XCircle,
  UtensilsCrossed,
  Settings,
} from "lucide-react";

export default function ChefSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { name: "Tổng Quan", key: "overview", icon: <LayoutDashboard /> },
    { name: "Kế Hoạch Trong Ngày", key: "dailyPlan", icon: <CalendarDays /> },
    { name: "Món Trong Ngày", key: "dailyDishes", icon: <UtensilsCrossed /> },
    { name: "Món Bị Từ Chối", key: "rejectedDishes", icon: <XCircle /> }, // 🆕 tab mới
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-red-600">Trang bếp</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý món ăn và đơn hàng</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key} // ✅ fix key warning
            onClick={() => setActiveSection(item.key)}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all ${
              activeSection === item.key
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                : "text-gray-700 hover:bg-orange-50"
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-center text-sm text-gray-400">
        &copy; 2025 Món Ngon 88
      </div>
    </aside>
  );
}
