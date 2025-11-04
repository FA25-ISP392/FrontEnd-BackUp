import { Target, Zap, Heart } from "lucide-react";
import { categories as CATEGORY_LIST } from "../../lib/menuData";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function MenuContent({
  activeMenuTab,
  filteredDishes,
  dishSuggests,
  onDishSelect,
  caloriesConsumed,
  estimatedCalories,
  onGoalChange,
  isPersonalized,
  currentGoal,
}) {
  const goals = [
    { id: "lose", name: "Giảm cân", icon: Target },
    { id: "maintain", name: "Giữ dáng", icon: Heart },
    { id: "gain", name: "Tăng cân", icon: Zap },
  ];

  const canShowCalorie = isPersonalized || caloriesConsumed > 0;

  // ✅ Ưu tiên món còn hàng
  const dishesToShow = [...filteredDishes].sort((a, b) => {
    const remainA = a.remainingQuantity > 0 ? 1 : 0;
    const remainB = b.remainingQuantity > 0 ? 1 : 0;
    return remainB - remainA;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ====================== THEO DÕI CALO (STICKY) ====================== */}
      {canShowCalorie && (
        <div
          className="
            sticky top-0 z-40 
            bg-white/90 backdrop-blur-md 
            rounded-2xl shadow-lg 
            border border-white/20 
            mb-8 px-6 py-5
          "
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Theo dõi Calorie
                </h3>
                <p className="text-xs text-neutral-600">
                  Kiểm soát lượng calo tiêu thụ hôm nay
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Vòng tròn tiến độ + thông báo động */}
          {estimatedCalories > 0 && (
            <div className="mt-2">
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

                // 🧠 Chọn thông điệp hiển thị dựa trên phần trăm
                let message = "";
                let messageColor = "";

                if (percentRaw > 115) {
                  message =
                    "Lượng calories này sẽ có thể ảnh hưởng đến sức khoẻ của bạn";
                  messageColor = "text-red-600";
                } else if (percentRaw >= 90) {
                  message =
                    "Lượng calo này rất phù hợp, chúc bạn thành công với mục tiêu của mình nhé";
                  messageColor = "text-emerald-600";
                } else if (percentRaw >= 60) {
                  message = "Cố lên, bạn sắp hoàn thành mục tiêu rồi";
                  messageColor = "text-orange-600";
                } else {
                  message =
                    "Lượng calo này hơi ít, chưa đủ để đáp ứng mục tiêu của bạn";
                  messageColor = "text-amber-600";
                }

                return (
                  <div className="flex flex-col items-center">
                    {/* --- 3 cột: đã nạp - vòng tròn - cần nạp --- */}
                    <div className="flex items-center justify-center gap-10 flex-wrap">
                      {/* Đã nạp */}
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">
                          {Math.round(caloriesConsumed) || 0}
                        </div>
                        <div className="text-xs text-neutral-600">
                          Đã nạp (Cal)
                        </div>
                      </div>

                      {/* Vòng tròn % ở giữa */}
                      <div className="w-20 h-20">
                        <CircularProgressbar
                          value={progress}
                          text={`${Math.round(percentRaw)}%`}
                          styles={buildStyles({
                            textColor: percentRaw > 115 ? "#b91c1c" : "#dc2626",
                            pathColor:
                              percentRaw > 115
                                ? "#b91c1c"
                                : percentRaw >= 90
                                ? "#16a34a"
                                : percentRaw >= 60
                                ? "#fb923c"
                                : "#f59e0b",
                            trailColor: "#f3f4f6",
                            textSize: "16px",
                          })}
                        />
                      </div>

                      {/* Cần nạp mỗi bữa */}
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">
                          {Math.round(perMealCalories) || 0}
                        </div>
                        <div className="text-xs text-neutral-600">
                          Cần nạp mỗi bữa (Cal)
                        </div>
                      </div>
                    </div>

                    {/* --- Dòng thông điệp động --- */}
                    <p
                      className={`mt-3 text-sm font-medium text-center transition-all duration-500 ${messageColor}`}
                    >
                      {message}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ====================== MỤC TIÊU ====================== */}
      {isPersonalized === "all" && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">
            Mục tiêu của bạn
          </h3>
          <div className="flex justify-center gap-8 flex-wrap">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const isActive = currentGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => onGoalChange(isActive ? null : goal.id)}
                  className={`flex flex-col items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-white bg-gradient-to-r from-orange-500 to-red-500"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">{goal.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================== MENU GỢI Ý ====================== */}
      {dishSuggests && dishSuggests.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-10">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">
            Menu gợi ý cho bạn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dishSuggests.map((dish, idx) => (
              <div
                key={`${dish.dishId || idx}`}
                className="bg-white/90 rounded-2xl shadow-md p-4 hover:shadow-xl transition-all border border-white/30 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={
                      dish.picture ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={dish.dishName}
                    className="w-full h-40 object-cover rounded-xl mb-3"
                  />
                  <h4 className="text-lg font-bold text-neutral-900 mb-1">
                    {dish.dishName}
                  </h4>
                  <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
                    {dish.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-orange-600">
                      {dish.price?.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-neutral-500">
                      {dish.calo || dish.calories} cal
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDishSelect(dish)}
                  className="mt-auto w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
                >
                  Chọn món
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================== DANH MỤC MÓN ĂN ====================== */}
      {activeMenuTab === "all" &&
        CATEGORY_LIST.map((cat) => {
          const dishes = dishesToShow.filter(
            (d) => d.categoryEnum?.toLowerCase() === cat.id?.toLowerCase()
          );

          return (
            <div key={cat.id} className="mb-10">
              <h3 className="text-xl font-bold mb-4">{cat.name}</h3>
              {dishes.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="w-72 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all border border-white/20 flex flex-col justify-between"
                    >
                      <div className="aspect-w-16 aspect-h-9 mb-3">
                        <img
                          src={
                            dish.picture ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={dish.name}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 mb-1">
                        {dish.name}
                      </h4>
                      <p className="text-neutral-600 text-sm line-clamp-2">
                        {dish.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          {dish.price?.toLocaleString("vi-VN")}₫
                        </span>
                        <span className="text-xs text-neutral-500">
                          {dish.calories || dish.calo} cal
                        </span>
                      </div>
                      {dish.remainingQuantity > 0 ? (
                        <button
                          onClick={() => onDishSelect(dish)}
                          className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
                        >
                          Chọn món
                        </button>
                      ) : (
                        <div className="mt-3 w-full text-center py-2.5 rounded-xl bg-neutral-200 text-neutral-500 font-medium cursor-not-allowed">
                          Tạm hết món
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-neutral-500 py-6">
                  Chưa có món phù hợp với nhu cầu của bạn.
                </p>
              )}
            </div>
          );
        })}
    </div>
  );
}
