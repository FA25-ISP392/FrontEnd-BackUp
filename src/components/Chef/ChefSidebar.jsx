import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  History,
  ChefHat,
} from "lucide-react";
import { CHEF_ROUTES } from "../../constant/routes";

const items = [
  {
    id: "overview",
    label: "Quản Lý Đơn Món",
    icon: LayoutDashboard,
    to: CHEF_ROUTES.ORDER_MANAGEMENT,
  },
  {
    id: "orderHistory",
    label: "Lịch Sử Đơn Món",
    icon: History,
    to: CHEF_ROUTES.ORDER_HISTORY,
  },
  {
    id: "dailyPlan",
    label: "Kế Hoạch Trong Ngày",
    icon: CalendarDays,
    to: CHEF_ROUTES.DAILY_PLAN,
  },
  {
    id: "dailyDishes",
    label: "Số Lượng Món Còn Lại",
    icon: UtensilsCrossed,
    to: CHEF_ROUTES.DAILY_MENU,
  },
];

export default function ChefSidebar() {
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
        {items.map(({ id, label, icon: Icon, to }) => (
          <NavLink
            key={id}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                  : "text-neutral-300 hover:bg-white/20 hover:text-orange-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-5 w-5 ${
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
    </aside>
  );
}
