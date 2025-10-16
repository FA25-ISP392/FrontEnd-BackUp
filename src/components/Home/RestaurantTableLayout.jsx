import React from "react";

export default function RestaurantTableLayout() {
  // Định nghĩa 8 bàn với số ghế tương ứng
  const tables = [
    { id: 1, seats: 2, position: "top-left" },
    { id: 2, seats: 2, position: "top-right" },
    { id: 3, seats: 4, position: "center-left" },
    { id: 4, seats: 4, position: "center-right" },
    { id: 5, seats: 6, position: "bottom-left" },
    { id: 6, seats: 6, position: "bottom-right" },
    { id: 7, seats: 8, position: "bottom-center-left" },
    { id: 8, seats: 8, position: "bottom-center-right" },
  ];

  const getTableStyle = (position) => {
    return "w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-lg flex items-center justify-center text-sm font-semibold text-orange-800 shadow-md hover:shadow-lg transition-shadow duration-200";
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Sơ đồ bàn nhà hàng
      </h3>
      <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200 h-80">
        {/* Cửa ra vào */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-orange-300 rounded-b-lg"></div>
        
        {/* Tường và không gian */}
        <div className="absolute inset-4 border-2 border-orange-200 rounded-lg bg-white/30"></div>
        
        {/* Các bàn được sắp xếp theo vị trí: 2 đầu, 2 dưới, 2 trái, 2 phải - số ghế ngẫu nhiên */}
        
        {/* 2 bàn ở đầu (trên) - Bàn 1, 2 (2 người) */}
        <div className="absolute top-12 left-1/2 transform -translate-x-20">
          <div className={getTableStyle("table-1")} title="Bàn 1 - 2 người">
            <div className="text-center">
              <div className="text-xs font-bold">1</div>
              <div className="text-xs">2 người</div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-12 left-1/2 transform translate-x-4">
          <div className={getTableStyle("table-2")} title="Bàn 2 - 2 người">
            <div className="text-center">
              <div className="text-xs font-bold">2</div>
              <div className="text-xs">2 người</div>
            </div>
          </div>
        </div>
        
        {/* 2 bàn ở dưới - Bàn 3, 4 (4 người) */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-20">
          <div className={getTableStyle("table-3")} title="Bàn 3 - 4 người">
            <div className="text-center">
              <div className="text-xs font-bold">3</div>
              <div className="text-xs">4 người</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform translate-x-4">
          <div className={getTableStyle("table-4")} title="Bàn 4 - 4 người">
            <div className="text-center">
              <div className="text-xs font-bold">4</div>
              <div className="text-xs">4 người</div>
            </div>
          </div>
        </div>
        
        {/* 2 bàn bên trái - Bàn 5, 6 (6 người) */}
        <div className="absolute top-1/2 left-8 transform -translate-y-12">
          <div className={getTableStyle("table-5")} title="Bàn 5 - 6 người">
            <div className="text-center">
              <div className="text-xs font-bold">5</div>
              <div className="text-xs">6 người</div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-8 transform translate-y-8">
          <div className={getTableStyle("table-6")} title="Bàn 6 - 6 người">
            <div className="text-center">
              <div className="text-xs font-bold">6</div>
              <div className="text-xs">6 người</div>
            </div>
          </div>
        </div>
        
        {/* 2 bàn bên phải - Bàn 7, 8 (8 người) */}
        <div className="absolute top-1/2 right-8 transform -translate-y-12">
          <div className={getTableStyle("table-7")} title="Bàn 7 - 8 người">
            <div className="text-center">
              <div className="text-xs font-bold">7</div>
              <div className="text-xs">8 người</div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 right-8 transform translate-y-8">
          <div className={getTableStyle("table-8")} title="Bàn 8 - 8 người">
            <div className="text-center">
              <div className="text-xs font-bold">8</div>
              <div className="text-xs">8 người</div>
            </div>
          </div>
        </div>
        
        {/* Chú thích */}
        <div className="absolute bottom-2 left-2 text-xs text-orange-700">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Bàn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
