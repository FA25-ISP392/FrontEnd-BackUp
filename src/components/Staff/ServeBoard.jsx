import {
  CheckCircle,
  Utensils,
  Package,
  Loader,
  AlertTriangle,
} from "lucide-react";

export default function ServeBoard({
  readyOrders = [],
  servedOrders = [],
  onServe,
  isLoading,
  error,
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-black/20 rounded-2xl shadow-lg h-80 border border-white/10">
        <Loader className="h-10 w-10 animate-spin text-green-400" />
        <p className="mt-3 text-neutral-300">Đang tải món sẵn sàng...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-900/20 rounded-2xl shadow-lg border border-red-500/30 h-80">
        <AlertTriangle className="h-10 w-10 text-red-400" />
        <p className="mt-3 text-red-300 font-semibold">Lỗi: {error}</p>
      </div>
    );
  }

  const Card = ({ od, column }) => {
    const head =
      column === "ready"
        ? {
            bg: "from-emerald-900/30 to-green-900/30",
            border: "border-emerald-500/30",
            iconColor: "text-emerald-400",
          }
        : {
            bg: "from-slate-900/30 to-gray-900/30",
            border: "border-slate-500/30",
            iconColor: "text-slate-400",
          };

    return (
      <div
        className={`bg-gradient-to-r ${head.bg} rounded-xl p-4 border ${head.border} hover:shadow-md transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Utensils className={`h-5 w-5 ${head.iconColor}`} />
            <span className="font-semibold text-white">{od.dishName}</span>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            #{od.orderDetailId}
          </span>
        </div>

        <div className="text-sm text-neutral-300 mb-2">
          Ghi chú: {od.note || "Không có"}
        </div>

        {od.toppings?.length > 0 && (
          <div className="mt-1 pt-2 border-t border-neutral-700/50">
            <h5 className="text-xs font-bold text-neutral-200 mb-1 flex items-center gap-1">
              <Package className="h-3 w-3" /> Toppings
            </h5>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {od.toppings.map((t) => (
                <li key={t.toppingId} className="text-xs text-neutral-300">
                  {t.toppingName} (x{t.quantity ?? 1})
                </li>
              ))}
            </ul>
          </div>
        )}

        {column === "ready" ? (
          <button
            onClick={() => onServe?.(od)}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-600 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <CheckCircle className="h-4 w-4" />
            Phục Vụ
          </button>
        ) : (
          <div className="mt-3 text-center text-sm text-green-400 font-medium">
            Đã phục vụ
          </div>
        )}
      </div>
    );
  };

  const Column = ({ title, headerColor, children, emptyText }) => (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 flex flex-col">
      {/* sticky header */}
      <div
        className={`p-6 border-b border-white/10 sticky top-0 bg-black/30 backdrop-blur-sm z-10 rounded-t-2xl`}
      >
        <h3 className={`text-xl font-bold ${headerColor}`}>{title}</h3>
      </div>

      {/* scrollable list: cao ~5 card */}
      <div
        className="
          p-6 space-y-4 overflow-y-auto
          h-[72vh] lg:h-[68vh] 2xl:h-[60vh]
          scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent
          pr-2
        "
      >
        {Array.isArray(children) && children.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">{emptyText}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Utensils className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Phục Vụ Món</h3>
          <p className="text-sm text-green-300">
            Xem món đã nấu xong và phục vụ cho khách
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Column
          title="Sẵn Sàng"
          headerColor="text-emerald-400"
          emptyText="Chưa có món sẵn sàng."
        >
          {readyOrders.map((od) => (
            <Card key={od.orderDetailId} od={od} column="ready" />
          ))}
        </Column>

        <Column
          title="Đã Phục Vụ (Hôm nay)"
          headerColor="text-slate-300"
          emptyText="Chưa có món đã phục vụ."
        >
          {servedOrders.map((od) => (
            <Card key={od.orderDetailId} od={od} column="served" />
          ))}
        </Column>
      </div>
    </div>
  );
}
