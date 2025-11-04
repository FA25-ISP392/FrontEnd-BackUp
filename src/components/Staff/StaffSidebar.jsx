import { Users, Table, BarChart3, Utensils, History } from "lucide-react";
import { NavLink } from "react-router-dom";
import { STAFF_ROUTES } from "../../constant/routes";

export default function StaffSidebar({ activeSection }) {
  const sidebarItems = [
    {
      id: "tableLayout",
      label: "Sơ Đồ Bàn",
      icon: Table,
      to: STAFF_ROUTES.TABLE_LAYOUT,
    },
    {
      id: "overview",
      label: "Thông Tin Bàn",
      icon: BarChart3,
      to: STAFF_ROUTES.OVERVIEW,
    },
    {
      id: "serveBoard",
      label: "Phục Vụ Món",
      icon: Utensils,
      to: STAFF_ROUTES.SERVE_BOARD,
    },
    {
      id: "serveHistory",
      label: "Lịch Sử Phục Vụ",
      icon: History,
      to: STAFF_ROUTES.SERVE_HISTORY,
    },
  ];

  return (
    <aside className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/10 min-h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-l font-bold text-white">Trang Nhân Viên</h2>
            <p className="text-sm text-green-300 mt-1">Phục vụ khách hàng</p>
          </div>
        </div>

        <nav className="space-y-3">
          {sidebarItems.map(({ id, label, icon: Icon, to }) => {
            const isActive = activeSection === id;
            return (
              <NavLink
                key={id}
                to={to}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105"
                    : "text-neutral-300 hover:bg-white/20 hover:shadow-lg hover:text-green-300 transform hover:-translate-y-0.5"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-neutral-400 group-hover:text-green-300"
                  }`}
                />
                <span className="font-medium">{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
