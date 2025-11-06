// src/components/Admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import { BarChart3, Users, FileText, Shield } from "lucide-react";
import { ADMIN_ROUTES } from "../../constant/routes";

const items = [
  {
    id: "overview",
    label: "Tổng Quan",
    icon: BarChart3,
    to: ADMIN_ROUTES.OVERVIEW,
  },
  {
    id: "invoices",
    label: "Hóa Đơn",
    icon: FileText,
    to: ADMIN_ROUTES.INVOICES,
  },
  {
    id: "accounts",
    label: "Tài Khoản",
    icon: Users,
    to: ADMIN_ROUTES.ACCOUNTS,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/10 min-h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-l font-bold text-white">Chủ Nhà Hàng</h2>
        </div>

        <nav className="space-y-3">
          {items.map(({ id, label, icon: Icon, to }) => (
            <NavLink
              key={id}
              to={to}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-neutral-300 hover:bg-white/20 hover:shadow-lg hover:text-blue-300 transform hover:-translate-y-0.5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-neutral-400 group-hover:text-blue-300"
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
