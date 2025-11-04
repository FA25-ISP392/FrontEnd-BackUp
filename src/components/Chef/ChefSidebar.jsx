import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  History,
  ChefHat,
} from "lucide-react";

export default function ChefSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { name: "Quản Lý Đơn Món", key: "overview", icon: <LayoutDashboard /> },
    { name: "Lịch Sử Đơn Món", key: "orderHistory", icon: <History /> },
    { name: "Kế Hoạch Trong Ngày", key: "dailyPlan", icon: <CalendarDays /> },
    { name: "Món Trong Ngày", key: "dailyDishes", icon: <UtensilsCrossed /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white/10 backdrop-blur-lg border-r border-white/10 flex flex-col sticky top-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Trang Bếp</h2>
            <p className="text-sm text-red-300 mt-1">Quản lý món ăn</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300 group ${
              activeSection === item.key
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                : "text-neutral-300 hover:bg-white/20 hover:text-orange-300"
            }`}
          >
            <span
              className={`w-5 h-5 ${
                activeSection === item.key
                  ? "text-white"
                  : "text-neutral-400 group-hover:text-orange-300"
              }`}
            >
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
