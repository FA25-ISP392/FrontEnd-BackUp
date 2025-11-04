import {
  BarChart3,
  Users,
  Package,
  Salad,
  ClipboardList,
  CheckCircle,
} from "lucide-react";

const sidebarItems = [
  { id: "accounts", label: "Quản Lý Đặt Bàn", icon: Users },
  { id: "dishes", label: "Món Ăn", icon: Package },
  { id: "toppings", label: "Topping", icon: Salad },
  { id: "dailyPlan", label: "Kế Hoạch Trong Ngày", icon: ClipboardList },
  { id: "dailyDishes", label: "Món Trong Ngày", icon: CheckCircle },
];

export default function ManagerSidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/10 min-h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-l font-bold text-white">Trang Quản Lý</h2>
        </div>

        <nav className="space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                    : "text-neutral-300 hover:bg-white/20 hover:shadow-lg hover:text-orange-300 transform hover:-translate-y-0.5"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    activeSection === item.id
                      ? "text-white"
                      : "text-neutral-400 group-hover:text-orange-300"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
