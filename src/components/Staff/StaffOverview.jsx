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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm">Bàn Đã Đặt</p>
            <p className="text-2xl font-bold text-blue-600">{reservedTables}</p>
          </div>
          <Table className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm">Bàn Trống</p>
            <p className="text-2xl font-bold text-green-600">{emptyTables}</p>
          </div>
          <Users className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm">Bàn Đang Phục Vụ</p>
            <p className="text-2xl font-bold text-orange-600">
              {servingTables}
            </p>
          </div>
          <Clock className="h-8 w-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm">Gọi Thanh Toán</p>
            <p className="text-2xl font-bold text-green-600">
              {callPaymentCount}
            </p>
          </div>
          <span className="font-bold text-2xl text-green-600">VND</span>
        </div>
      </div>
    </div>
  );
}
