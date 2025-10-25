import { Target, Zap, Heart, User } from "lucide-react";
import { categories as CATEGORY_LIST } from "../../lib/menuData";

export default function MenuContent({
  activeMenuTab,
  setActiveMenuTab,
  filteredDishes,
  personalizedMenu,
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

  const mapGoalToType = {
    gain: "Tăng cân",
    lose: "Giảm cân",
    maintain: "Giữ dáng",
  };

  const canShowCalorie =
    isPersonalized &&
    typeof estimatedCalories === "number" &&
    isFinite(estimatedCalories) &&
    estimatedCalories > 0;

  const percent = canShowCalorie
    ? Math.min(
        100,
        Math.max(0, Math.round((caloriesConsumed / estimatedCalories) * 100))
      )
    : 0;

  // ✅ Lọc món theo type mục tiêu (nếu có)
  const goalType = mapGoalToType[currentGoal];
  const dishesToShow =
    activeMenuTab === "personalized" && goalType
      ? filteredDishes.filter((d) => d.type === goalType)
      : activeMenuTab === "personalized"
      ? []
      : filteredDishes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ================= Theo dõi Calorie ================= */}
      {canShowCalorie && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Theo dõi Calorie
                </h3>
                <p className="text-sm text-neutral-600">
                  Kiểm soát lượng calo tiêu thụ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(caloriesConsumed)}
                </div>
                <div className="text-sm text-neutral-600">Cal đã thêm</div>
              </div>

              <div className="w-16 h-16 relative">
                <svg
                  className="w-16 h-16 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#FB923C"
                    strokeWidth="2"
                    strokeDasharray={`${Math.min(percent, 100)}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-neutral-700">
                    {percent}%
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.ceil(estimatedCalories)}
                </div>
                <div className="text-sm text-neutral-600">Cal ước tính</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================== Nút chuyển tab =================== */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveMenuTab("all")}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeMenuTab === "all"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              : "bg-white/80 text-neutral-700 hover:bg-white shadow-md"
          }`}
        >
          Menu Tổng
        </button>

        {/* ✅ Chỉ hiện khi đã điền form cá nhân hoá */}
        {isPersonalized && (
          <button
            onClick={() => setActiveMenuTab("personalized")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeMenuTab === "personalized"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "bg-white/80 text-neutral-700 hover:bg-white shadow-md"
            }`}
          >
            Menu Phù Hợp
          </button>
        )}
      </div>

      {/* =================== Mục tiêu của bạn =================== */}
      {activeMenuTab === "personalized" && isPersonalized && (
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
                  onClick={() => onGoalChange(goal.id)}
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

      {/* =================== Danh sách món =================== */}
      {activeMenuTab === "personalized" && isPersonalized && !goalType && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Chưa có menu cá nhân hóa
          </h3>
          <p className="text-neutral-600 mb-6">
            Hãy hoàn thành form cá nhân hóa để xem menu phù hợp với bạn
          </p>
          <button
            onClick={() => setActiveMenuTab("all")}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
          >
            Xem Menu Tổng
          </button>
        </div>
      )}

      {activeMenuTab === "personalized" && goalType && (
        <>
          {CATEGORY_LIST.map((cat) => {
            const dishes = dishesToShow.filter(
              (d) => d.category?.toLowerCase() === cat.id?.toLowerCase()
            );
            return (
              <div key={cat.id} className="mb-10">
                <h3 className="text-xl font-bold mb-4">{cat.name}</h3>
                {dishes.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="w-72 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all border border-white/20"
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
                        <button
                          onClick={() => onDishSelect(dish)}
                          className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
                        >
                          Chọn món
                        </button>
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
        </>
      )}

      {activeMenuTab === "all" &&
        CATEGORY_LIST.map((cat) => {
          const dishes = dishesToShow.filter(
            (d) => d.category?.toLowerCase() === cat.id?.toLowerCase()
          );
          if (dishes.length === 0) return null;
          return (
            <div key={cat.id} className="mb-10">
              <h3 className="text-xl font-bold mb-4">{cat.name}</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="w-72 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all border border-white/20"
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
                    <button
                      onClick={() => onDishSelect(dish)}
                      className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
                    >
                      Chọn món
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
