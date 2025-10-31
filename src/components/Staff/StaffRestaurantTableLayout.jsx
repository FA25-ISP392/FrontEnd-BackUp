import { getTableStatusClass } from "./staffUtils";

export default function StaffRestaurantTableLayout({
  tables,
  onTableClick,
  selectedTable,
}) {
  const getTablePosition = (index) => {
    switch (index) {
      case 0:
        return "top-[10%] left-[10%]";
      case 1:
        return "top-[10%] left-[30%]";
      case 2:
        return "top-[10%] right-[30%]";
      case 3:
        return "top-[10%] right-[10%]";
      case 4:
        return "bottom-[10%] left-[10%]";
      case 5:
        return "bottom-[10%] left-[30%]";
      case 6:
        return "bottom-[10%] right-[30%]";
      case 7:
        return "bottom-[10%] right-[10%]";
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <div className="relative w-full h-[60vh] bg-neutral-100 rounded-lg shadow-inner-strong overflow-hidden border border-neutral-200">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-24 bg-green-700/80 rounded-r-md shadow-md">
        <span className="absolute -left-0 top-1/2 -translate-y-1/2 -rotate-90 text-white font-bold text-sm tracking-wider">
          Cửa Vào
        </span>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/5 h-16 bg-neutral-300 rounded-t-lg shadow-md flex items-center justify-center">
        <span className="font-semibold text-neutral-600">Khu Vực Bếp</span>
      </div>

      {tables.map((table, index) => (
        <button
          key={table.id}
          onClick={() => onTableClick(table)}
          className={`absolute w-24 h-24 rounded-lg transform transition-all duration-300 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-xl
            ${getTablePosition(index)}
            ${getTableStatusClass(table.status)}
            ${
              selectedTable?.id === table.id
                ? "ring-4 ring-blue-500 ring-offset-2 scale-105"
                : "border-2"
            }
            ${
              table.callStaff || table.callPayment
                ? "animate-pulse-strong ring-4 ring-red-500"
                : ""
            }
          `}
        >
          <span className="text-3xl font-bold text-white shadow-text">
            {table.number}
          </span>
          {table.guests > 0 && table.status !== "empty" && (
            <span className="text-xs font-medium text-white bg-black/20 px-2 py-0.5 rounded-full mt-1">
              {table.guests} K
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
