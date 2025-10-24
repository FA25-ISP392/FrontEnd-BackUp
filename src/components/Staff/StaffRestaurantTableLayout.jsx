import React from "react";

export default function StaffRestaurantTableLayout({
  tables,
  onTableClick,
  selectedTable,
}) {
  // helper để tìm bàn theo number
  const getTable = (num) =>
    tables.find((t) => Number(t.number) === Number(num)) || { status: "empty" };

  // Định nghĩa màu và hiệu ứng theo status ("empty" | "reserved" | "serving")
  const getTableStyle = (table) => {
    const base =
      "w-20 h-20 border-3 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105";

    switch (table.status) {
      case "empty":
        return `${base} bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-800 hover:from-green-200 hover:to-green-300 hover:border-green-500`;
      case "reserved":
        return `${base} bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 text-orange-800 hover:from-orange-200 hover:to-orange-300 hover:border-orange-500`;
      case "serving":
        return `${base} bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-800 hover:from-red-200 hover:to-red-300 hover:border-red-500`;
      default:
        return `${base} bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 text-gray-800 hover:from-gray-200 hover:to-gray-300 hover:border-gray-500`;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "empty":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      case "serving":
        return "Đang phục vụ";
      default:
        return "Không rõ";
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
        Sơ đồ bàn nhà hàng
      </h3>

      <div className="relative bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 rounded-2xl p-8 border-2 border-orange-200 shadow-xl h-96">
        {/* Cửa ra vào */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-orange-400 to-orange-500 rounded-b-xl shadow-lg"></div>

        <div className="absolute inset-6 border-2 border-orange-200 rounded-xl bg-white/40 backdrop-blur-sm shadow-inner"></div>

        {/* Bàn 1 & 2 (trên) */}
        <div className="absolute top-16 left-1/2 transform -translate-x-24">
          <div
            className={getTableStyle(getTable(1))}
            title={`Bàn 1 - ${getStatusText(getTable(1).status)}`}
            onClick={() => onTableClick(getTable(1))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">1</div>
              <div className="text-xs">2 người</div>
            </div>
          </div>
        </div>
        <div className="absolute top-16 left-1/2 transform translate-x-4">
          <div
            className={getTableStyle(getTable(2))}
            title={`Bàn 2 - ${getStatusText(getTable(2).status)}`}
            onClick={() => onTableClick(getTable(2))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">2</div>
              <div className="text-xs">2 người</div>
            </div>
          </div>
        </div>

        {/* Bàn 3 & 4 (dưới) */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-24">
          <div
            className={getTableStyle(getTable(3))}
            title={`Bàn 3 - ${getStatusText(getTable(3).status)}`}
            onClick={() => onTableClick(getTable(3))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">3</div>
              <div className="text-xs">4 người</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-16 left-1/2 transform translate-x-4">
          <div
            className={getTableStyle(getTable(4))}
            title={`Bàn 4 - ${getStatusText(getTable(4).status)}`}
            onClick={() => onTableClick(getTable(4))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">4</div>
              <div className="text-xs">4 người</div>
            </div>
          </div>
        </div>

        {/* Bàn 5 & 6 (bên trái) */}
        <div className="absolute top-1/2 left-12 transform -translate-y-16">
          <div
            className={getTableStyle(getTable(5))}
            title={`Bàn 5 - ${getStatusText(getTable(5).status)}`}
            onClick={() => onTableClick(getTable(5))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">5</div>
              <div className="text-xs">6 người</div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-12 transform translate-y-8">
          <div
            className={getTableStyle(getTable(6))}
            title={`Bàn 6 - ${getStatusText(getTable(6).status)}`}
            onClick={() => onTableClick(getTable(6))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">6</div>
              <div className="text-xs">6 người</div>
            </div>
          </div>
        </div>

        {/* Bàn 7 & 8 (bên phải) */}
        <div className="absolute top-1/2 right-12 transform -translate-y-16">
          <div
            className={getTableStyle(getTable(7))}
            title={`Bàn 7 - ${getStatusText(getTable(7).status)}`}
            onClick={() => onTableClick(getTable(7))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">7</div>
              <div className="text-xs">8 người</div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-12 transform translate-y-8">
          <div
            className={getTableStyle(getTable(8))}
            title={`Bàn 8 - ${getStatusText(getTable(8).status)}`}
            onClick={() => onTableClick(getTable(8))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">8</div>
              <div className="text-xs">8 người</div>
            </div>
          </div>
        </div>

        {/* Chú thích */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-orange-200">
          <div className="text-xs font-semibold text-orange-800 mb-2">
            Chú thích:
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-lg"></div>
              <span className="text-xs text-green-800 font-medium">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-lg"></div>
              <span className="text-xs text-orange-800 font-medium">
                Đã đặt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-lg"></div>
              <span className="text-xs text-red-800 font-medium">
                Đang phục vụ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
