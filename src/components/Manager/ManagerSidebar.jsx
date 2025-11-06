import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Users,
  Package,
  Salad,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import { MANAGER_ROUTES } from "../../constant/routes";

const sidebarItems = [
  {
    id: "quanlydatban",
    label: "Quản Lý Đặt Bàn",
    icon: Users,
    to: MANAGER_ROUTES.BOOKING,
  },
  { id: "monan", label: "Món Ăn", icon: Package, to: MANAGER_ROUTES.DISH },
  {
    id: "thanhphanmon",
    label: "Thành phần món",
    icon: Salad,
    to: MANAGER_ROUTES.TOPPING,
  },
  {
    id: "kehoachtrongngay",
    label: "Kế Hoạch Trong Ngày",
    icon: ClipboardList,
    to: MANAGER_ROUTES.DAILY_PLAN,
  },
  {
    id: "montrongngay",
    label: "Món Trong Ngày",
    icon: CheckCircle,
    to: MANAGER_ROUTES.DAILY_MENU,
  },
];

export default function ManagerSidebar() {
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
          {sidebarItems.map(({ id, label, icon: Icon, to }) => (
            <NavLink
              key={id}
              to={to}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                    : "text-neutral-300 hover:bg-white/20 hover:shadow-lg hover:text-orange-300 transform hover:-translate-y-0.5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-neutral-400 group-hover:text-orange-300"
                    }`}
                  />
                  <span className="font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
