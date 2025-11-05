import { Target, Zap, Heart, ImageOff } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// === Card Món Ăn (Giữ nguyên) ===
const DishCard = ({ dish, onDishSelect }) => {
  const {
    name,
    description,
    price,
    calo,
    calories,
    picture,
    remainingQuantity = 1,
  } = dish;

  const isSoldOut = remainingQuantity <= 0;

  return (
    <div
      className={`relative w-full bg-white rounded-2xl shadow-lg border border-neutral-200/80 overflow-hidden group transition-all duration-300 ${
        isSoldOut ? "opacity-60" : "hover:shadow-2xl hover:border-orange-300"
      }`}
    >
      {isSoldOut && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <span className="px-4 py-2 bg-white/90 text-red-600 font-bold rounded-lg shadow-xl">
            TẠM HẾT
          </span>
        </div>
      )}
      <div className="relative h-48 w-full overflow-hidden">
        {picture ? (
          <img
            src={picture}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isSoldOut ? "" : "group-hover:scale-110"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100">
            <ImageOff className="w-12 h-12 text-neutral-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-lg font-bold text-neutral-900 truncate mb-1">
          {name}
        </h4>
        <p className="text-sm text-neutral-600 h-10 line-clamp-2 mb-3">
          {description || "Chưa có mô tả cho món ăn này."}
        </p>
        <div className="flex-grow"></div>
        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-orange-600">
              {price?.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-xs text-neutral-500 mt-1">
              {calo || calories || 0} cal
            </span>
          </div>
          {!isSoldOut && (
            <button
              onClick={() => onDishSelect(dish)}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium text-sm shadow-lg transition-all
                         transform group-hover:scale-105 group-hover:shadow-orange-500/30
                         active:scale-95 active:bg-orange-600"
            >
              Chọn món
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
// === HẾT CARD MÓN ĂN ===

export default function MenuContent({
  activeMenuTab,
  filteredDishes, // Đây là danh sách TẤT CẢ món ăn
  dishSuggests, // Đây là danh sách các món GỢI Ý (mảng 12 món)
  onDishSelect,
  caloriesConsumed,
  estimatedCalories,
  onGoalChange,
  isPersonalized,
  currentGoal,
  setActiveMenuTab,
}) {
  const goals = [
    { id: "lose", name: "Giảm cân", icon: Target },
    { id: "maintain", name: "Giữ dáng", icon: Heart },
    { id: "gain", name: "Tăng cân", icon: Zap },
  ];

  const canShowCalorie = isPersonalized || caloriesConsumed > 0;

  // dishesToShow chỉ dùng cho tab "Tất Cả"
  const dishesToShow = [...filteredDishes].sort((a, b) => {
    const remainA = a.remainingQuantity > 0 ? 1 : 0;
    const remainB = b.remainingQuantity > 0 ? 1 : 0;
    return remainB - remainA;
  });

  // categoriesWithSuggest chỉ còn 2 tab
  const categoriesWithSuggest = [
    { id: "all", name: "Tất Cả" },
    ...(dishSuggests && dishSuggests.length > 0
      ? [{ id: "suggested", name: "Gợi Ý Cho Bạn" }]
      : []),
  ];

  // === 💖 BẮT ĐẦU SỬA THEO YÊU CẦU 💖 ===
  // Định nghĩa thứ tự sắp xếp mong muốn
  const CATEGORY_ORDER = [
    "Pizza",
    "Mì ý",
    "Bò bít tết",
    "Salad",
    "Đồ uống",
    "Tráng miệng",
  ];

  // Lấy tất cả các category CÓ TRONG MÓN ĂN (dùng tên hiển thị, vd: "Pizza")
  const allCategoriesInMenu = dishesToShow.reduce((acc, dish) => {
    if (dish.category && !acc.includes(dish.category)) {
      acc.push(dish.category);
    }
    return acc;
  }, []);

  // Sắp xếp các category theo thứ tự mong muốn
  const sortedCategories = allCategoriesInMenu.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    // Nếu cả hai đều có trong danh sách_order -> sắp xếp theo danh sách
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // Nếu chỉ A có trong danh sách -> A lên trước
    if (indexA !== -1) {
      return -1;
    }
    // Nếu chỉ B có trong danh sách -> B lên trước
    if (indexB !== -1) {
      return 1;
    }
    // Nếu cả hai đều không có -> sắp xếp theo alphabet
    return a.localeCompare(b);
  });
  // === 💖 KẾT THÚC SỬA 💖 ===

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ====================== THEO DÕI CALO (STICKY) ====================== */}
      {canShowCalorie && (
        <div
          className="
            sticky top-[80px] z-30 
            bg-white/95 backdrop-blur-lg 
            rounded-2xl shadow-xl 
            border border-neutral-200 
            mb-8 px-6 py-5
          "
        >
          {estimatedCalories > 0 && (
            <div>
              {(() => {
                const form =
                  JSON.parse(
                    localStorage.getItem("personalization:form") || "{}"
                  ) || {};
                const mealsPerDay = Number(
                  form.mealsPerDay || form.mealPerDay || 3
                );
                const perMealCalories = estimatedCalories / mealsPerDay;
                const percentRaw =
                  ((caloriesConsumed || 0) / perMealCalories) * 100;
                const progress = Math.min(100, percentRaw);

                let message = "";
                let messageColor = "";
                let pathColor = "";
                let textColor = "";

                if (percentRaw > 115) {
                  message = "Bạn đã vượt calo cho bữa này!";
                  messageColor = "text-red-600";
                  pathColor = "#dc2626"; // red-600
                  textColor = "#dc2626";
                } else if (percentRaw >= 90) {
                  message = "Tuyệt vời, bạn đã gần đạt mục tiêu bữa ăn!";
                  messageColor = "text-green-600";
                  pathColor = "#16a34a"; // green-600
                  textColor = "#16a34a";
                } else if (percentRaw >= 60) {
                  message = "Cố lên, sắp hoàn thành mục tiêu rồi!";
                  messageColor = "text-orange-600";
                  pathColor = "#ea580c"; // orange-600
                  textColor = "#ea580c";
                } else if (caloriesConsumed > 0) {
                  message = "Một khởi đầu tốt, tiếp tục nào!";
                  messageColor = "text-blue-600";
                  pathColor = "#2563eb"; // blue-600
                  textColor = "#2563eb";
                } else {
                  message = "Hãy bắt đầu thêm món để theo dõi calo.";
                  messageColor = "text-neutral-500";
                  pathColor = "#6b7280"; // gray-500
                  textColor = "#6b7280";
                }

                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20">
                        <CircularProgressbar
                          value={progress}
                          text={`${Math.round(percentRaw)}%`}
                          styles={buildStyles({
                            textColor: textColor,
                            pathColor: pathColor,
                            trailColor: "#f3f4f6", // gray-100
                            textSize: "20px",
                            strokeLinecap: "round",
                          })}
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-neutral-900">
                          Theo dõi Calorie (Bữa ăn)
                        </h3>
                        <p
                          className={`text-sm font-medium transition-all duration-300 ${messageColor}`}
                        >
                          {message}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.round(caloriesConsumed) || 0}
                        </div>
                        <div className="text-xs text-neutral-600 uppercase font-medium">
                          Đã nạp
                        </div>
                      </div>
                      <div className="border-l border-neutral-200"></div>
                      <div>
                        <div className="text-2xl font-bold text-neutral-800">
                          {Math.round(perMealCalories) || 0}
                        </div>
                        <div className="text-xs text-neutral-600 uppercase font-medium">
                          Mục tiêu
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ====================== MỤC TIÊU ====================== */}
      {isPersonalized === "all" && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 mb-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">
            Mục tiêu của bạn
          </h3>
          <div className="flex justify-center gap-4">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const isActive = currentGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => onGoalChange(isActive ? null : goal.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5
                  ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-white text-neutral-700 shadow-md border border-neutral-200 hover:shadow-lg hover:border-orange-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{goal.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================== THANH TAB ====================== */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex items-center gap-3 w-max">
          {categoriesWithSuggest.map((cat) => {
            const isActive = activeMenuTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveMenuTab(cat.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                    : "bg-white text-neutral-600 shadow-md border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900"
                }
                ${cat.id === "suggested" ? "!bg-purple-500 text-white" : ""}
              `}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================== DANH MỤC MÓN ĂN ====================== */}
      {activeMenuTab === "all" ? (
        // === 💖 SỬA PHẦN RENDER TAB "TẤT CẢ" 💖 ===
        (() => {
          // Sử dụng `sortedCategories` đã được sắp xếp
          return sortedCategories.map((catName) => {
            // 👇 SỬA LỖI: Chỉ lọc theo `d.category` (tên hiển thị)
            // vì `catName` chính là tên hiển thị (VD: "Pizza")
            const dishes = dishesToShow.filter((d) => d.category === catName);
            // 👆 HẾT SỬA LỖI
            if (dishes.length === 0) return null;

            return (
              <div key={catName} className="mb-10">
                <h3 className="text-3xl font-bold text-neutral-900 mb-5">
                  {catName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {dishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onDishSelect={onDishSelect}
                    />
                  ))}
                </div>
              </div>
            );
          });
        })()
      ) : (
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-neutral-900 mb-5">
            {categoriesWithSuggest.find((c) => c.id === activeMenuTab)?.name}
          </h3>
          {dishSuggests && dishSuggests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dishSuggests.map((dish) => (
                <DishCard
                  key={dish.id || dish.dishId}
                  dish={dish}
                  onDishSelect={onDishSelect}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-500 py-12">
              Chưa có món phù hợp với nhu cầu của bạn.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
