import { Table, Users, Clock } from "lucide-react";

export default function StaffOverview({ tables = [] }) {
  const servingTables = tables.filter(
    (table) => table.status === "serving"
  ).length;
  const emptyTables = tables.filter((table) => table.status === "empty").length;
  const reservedTables = tables.filter(
    (table) => table.status === "reserved"
  ).length;
  const callPaymentCount = tables.filter((table) => table.callPayment).length;

  const stats = [
    {
      title: "Bàn Đã Đặt",
      value: reservedTables,
      icon: Table,
      color: "text-yellow-200",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Bàn Trống",
      value: emptyTables,
      icon: Users,
      color: "text-green-200",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Bàn Đang Phục Vụ",
      value: servingTables,
      icon: Clock,
      color: "text-red-200",
      gradient: "from-red-500 to-rose-500",
    },
    {
      title: "Gọi Thanh Toán",
      value: callPaymentCount,
      icon: null,
      color: "text-blue-200",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/40 transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <p className={`text-base font-medium ${stat.color}`}>
                {stat.title}
              </p>
              <div
                className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
              >
                {stat.title === "Gọi Thanh Toán" ? (
                  <span className="text-sm font-bold text-white">VND</span>
                ) : (
                  <Icon className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
            <p className="text-4xl font-extrabold text-white shadow-text">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
