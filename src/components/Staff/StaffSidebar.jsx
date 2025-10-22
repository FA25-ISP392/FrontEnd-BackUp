import { Users, ClipboardList, Home, Table, BarChart3, Utensils } from "lucide-react";

export default function StaffSidebar({ activeSection, setActiveSection }) {
  const sidebarItems = [
    { id: "tableLayout", label: "Sơ Đồ Bàn", icon: Table },
    { id: "overview", label: "Tổng Quan", icon: BarChart3 },
    { id: "ordersByTable", label: "Đơn Món Theo Bàn", icon: Utensils },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-white/20 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Staff Panel</h2>
            <p className="text-xs text-neutral-600">Service Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeSection === id
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                  : "text-neutral-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Removed Back to Home button as requested */}
      </div>
    </div>
  );
}
