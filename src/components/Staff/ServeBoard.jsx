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
      <div className="flex flex-col items-center justify-center p-12 bg-white/50 rounded-2xl shadow-lg h-80">
        <Loader className="h-10 w-10 animate-spin" />
        <p className="mt-3 text-neutral-700">Đang tải món sẵn sàng...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-2xl shadow-lg border border-red-200 h-80">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="mt-3 text-red-700 font-semibold">Lỗi: {error}</p>
      </div>
    );
  }

  const Card = ({ od, column }) => {
    const head =
      column === "ready"
        ? { bg: "from-emerald-50 to-green-50", border: "border-emerald-200" }
        : { bg: "from-slate-50 to-gray-50", border: "border-slate-200" };

    return (
      <div
        className={`bg-gradient-to-r ${head.bg} rounded-xl p-4 border ${head.border} hover:shadow-sm transition`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            <span className="font-semibold">{od.dishName}</span>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            #{od.orderDetailId}
          </span>
        </div>

        <div className="text-sm text-neutral-600 mb-2">
          Ghi chú: {od.note || "Không có"}
        </div>

        {od.toppings?.length > 0 && (
          <div className="mt-1 pt-2 border-t border-neutral-200">
            <h5 className="text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
              <Package className="h-3 w-3" /> Toppings
            </h5>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {od.toppings.map((t) => (
                <li key={t.toppingId} className="text-xs text-neutral-600">
                  {t.toppingName} (x{t.quantity ?? 1})
                </li>
              ))}
            </ul>
          </div>
        )}

        {column === "ready" ? (
          <button
            onClick={() => onServe?.(od)}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-600 transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Phục Vụ
          </button>
        ) : (
          <div className="mt-3 text-center text-sm text-green-700 font-medium">
            Đã phục vụ
          </div>
        )}
      </div>
    );
  };

  const Column = ({ title, headerColor, children, emptyText }) => (
    <div className="bg-white/80 rounded-2xl shadow-lg border border-white/20 flex flex-col">
      {/* sticky header */}
      <div
        className={`p-6 border-b border-neutral-100 sticky top-0 bg-white/90 backdrop-blur z-10`}
      >
        <h3 className={`text-xl font-bold ${headerColor}`}>{title}</h3>
      </div>

      {/* scrollable list: cao ~5 card */}
      <div
        className="
          p-6 space-y-4 overflow-y-auto
          h-[72vh] lg:h-[68vh] 2xl:h-[60vh]
          scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent
          pr-2
        "
      >
        {Array.isArray(children) && children.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">{emptyText}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Utensils className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-900">Phục Vụ Món</h3>
          <p className="text-sm text-neutral-600">
            Xem món đã nấu xong và phục vụ cho khách
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Column
          title="Sẵn Sàng"
          headerColor="text-emerald-700"
          emptyText="Chưa có món sẵn sàng."
        >
          {readyOrders.map((od) => (
            <Card key={od.orderDetailId} od={od} column="ready" />
          ))}
        </Column>

        <Column
          title="Phục Vụ"
          headerColor="text-slate-700"
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
