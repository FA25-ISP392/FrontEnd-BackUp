import React from "react";

export default function StaffRestaurantTableLayout({
  tables,
  onTableClick,
  selectedTable,
}) {
  // Định nghĩa 8 bàn với số ghế tương ứng
  const tableLayout = [
    { id: 1, seats: 2, position: "top-left" },
    { id: 2, seats: 2, position: "top-right" },
    { id: 3, seats: 4, position: "center-left" },
    { id: 4, seats: 4, position: "center-right" },
    { id: 5, seats: 6, position: "bottom-left" },
    { id: 6, seats: 6, position: "bottom-right" },
    { id: 7, seats: 8, position: "bottom-center-left" },
    { id: 8, seats: 8, position: "bottom-center-right" },
  ];

  const getTableStyle = (table) => {
    let baseStyle =
      "w-20 h-20 border-3 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105";

    // Xác định màu sắc dựa trên trạng thái với hiệu ứng đẹp hơn
    switch (table.status) {
      case "available":
        return `${baseStyle} bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-800 hover:from-green-200 hover:to-green-300 hover:border-green-500`;
      case "reserved":
        return `${baseStyle} bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 text-orange-800 hover:from-orange-200 hover:to-orange-300 hover:border-orange-500`;
      case "occupied":
        return `${baseStyle} bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-800 hover:from-red-200 hover:to-red-300 hover:border-red-500`;
      case "cleaning":
        return `${baseStyle} bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400 text-purple-800 hover:from-purple-200 hover:to-purple-300 hover:border-purple-500`;
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 text-gray-800 hover:from-gray-200 hover:to-gray-300 hover:border-gray-500`;
    }
  };

  const getTableStatusText = (status) => {
    switch (status) {
      case "available":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      case "occupied":
        return "Đang phục vụ";
      case "cleaning":
        return "Đang dọn";
      default:
        return status;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
        Sơ đồ bàn nhà hàng
      </h3>
      <div className="relative bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 rounded-2xl p-8 border-2 border-orange-200 shadow-xl h-96">
        {/* Cửa ra vào với hiệu ứng đẹp hơn */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-orange-400 to-orange-500 rounded-b-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-300 to-orange-400 rounded-b-xl opacity-50"></div>
        </div>

        {/* Tường và không gian với hiệu ứng */}
        <div className="absolute inset-6 border-2 border-orange-200 rounded-xl bg-white/40 backdrop-blur-sm shadow-inner"></div>

        {/* Thêm một số chi tiết trang trí */}
        <div className="absolute top-8 left-8 w-2 h-2 bg-orange-300 rounded-full opacity-60"></div>
        <div className="absolute top-8 right-8 w-2 h-2 bg-orange-300 rounded-full opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-2 h-2 bg-orange-300 rounded-full opacity-60"></div>
        <div className="absolute bottom-8 right-8 w-2 h-2 bg-orange-300 rounded-full opacity-60"></div>

        {/* Các bàn được sắp xếp theo vị trí */}

        {/* 2 bàn ở đầu (trên) - Bàn 1, 2 (2 người) */}
        <div className="absolute top-16 left-1/2 transform -translate-x-24">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 1) || { status: "available" }
            )}
            title={`Bàn 1 - ${getTableStatusText(
              tables.find((t) => t.number === 1)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 1))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">1</div>
              <div className="text-xs">2 người</div>
            </div>
          </div>
        </div>

        <div className="absolute top-16 left-1/2 transform translate-x-4">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 2) || { status: "available" }
            )}
            title={`Bàn 2 - ${getTableStatusText(
              tables.find((t) => t.number === 2)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 2))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">2</div>
              <div className="text-xs">2 người</div>
            </div>
          </div>
        </div>

        {/* 2 bàn ở dưới - Bàn 3, 4 (4 người) */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-24">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 3) || { status: "available" }
            )}
            title={`Bàn 3 - ${getTableStatusText(
              tables.find((t) => t.number === 3)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 3))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">3</div>
              <div className="text-xs">4 người</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 transform translate-x-4">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 4) || { status: "available" }
            )}
            title={`Bàn 4 - ${getTableStatusText(
              tables.find((t) => t.number === 4)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 4))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">4</div>
              <div className="text-xs">4 người</div>
            </div>
          </div>
        </div>

        {/* 2 bàn bên trái - Bàn 5, 6 (6 người) */}
        <div className="absolute top-1/2 left-12 transform -translate-y-16">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 5) || { status: "available" }
            )}
            title={`Bàn 5 - ${getTableStatusText(
              tables.find((t) => t.number === 5)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 5))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">5</div>
              <div className="text-xs">6 người</div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-12 transform translate-y-8">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 6) || { status: "available" }
            )}
            title={`Bàn 6 - ${getTableStatusText(
              tables.find((t) => t.number === 6)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 6))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">6</div>
              <div className="text-xs">6 người</div>
            </div>
          </div>
        </div>

        {/* 2 bàn bên phải - Bàn 7, 8 (8 người) */}
        <div className="absolute top-1/2 right-12 transform -translate-y-16">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 7) || { status: "available" }
            )}
            title={`Bàn 7 - ${getTableStatusText(
              tables.find((t) => t.number === 7)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 7))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">7</div>
              <div className="text-xs">8 người</div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-12 transform translate-y-8">
          <div
            className={getTableStyle(
              tables.find((t) => t.number === 8) || { status: "available" }
            )}
            title={`Bàn 8 - ${getTableStatusText(
              tables.find((t) => t.number === 8)?.status || "available"
            )}`}
            onClick={() => onTableClick(tables.find((t) => t.number === 8))}
          >
            <div className="text-center">
              <div className="text-sm font-bold">8</div>
              <div className="text-xs">8 người</div>
            </div>
          </div>
        </div>

        {/* Chú thích với thiết kế đẹp hơn */}
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
