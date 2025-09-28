import {
  BarChart3,
  Package,
  FileText,
  Settings,
  LogOut,
  ChefHat,
} from "lucide-react";

const sidebarItems = [
  { id: "overview", label: "Tổng Quan", icon: BarChart3 },
  { id: "orders", label: "Đơn Hàng", icon: ChefHat },
  { id: "dishes", label: "Món Ăn", icon: Package },
  { id: "invoices", label: "Hóa Đơn", icon: FileText },
  { id: "settings", label: "Cài Đặt", icon: Settings },
];

export default function ChefSidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="w-64 bg-white/60 backdrop-blur-sm border-r border-white/20 min-h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Chef Dashboard</h2>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                    : "text-neutral-700 hover:bg-white/50 hover:shadow-md"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    activeSection === item.id
                      ? "text-white"
                      : "text-neutral-600 group-hover:text-orange-500"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-neutral-200">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group">
            <LogOut className="h-5 w-5 text-neutral-600 group-hover:text-red-500" />
            <span className="font-medium">Đăng Xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
