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
  const categories = CATEGORY_LIST.filter((c) => c.id !== "all");

  const goals = [
    { id: "lose", name: "Giảm cân", icon: Target },
    { id: "maintain", name: "Giữ dáng", icon: Heart },
    { id: "gain", name: "Tăng cân", icon: Zap },
  ];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  {caloriesConsumed}
                </div>
                <div className="text-sm text-neutral-600">Cal đã thêm</div>
              </div>
              <div className="w-16 h-16 relative">
                {(() => {
                  const percentage = percent;
                  let strokeColor = "#10B981";
                  if (percentage >= 80 && percentage <= 100)
                    strokeColor = "#F97316";
                  else if (percentage > 100) strokeColor = "#EF4444";
                  return (
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
                        stroke={strokeColor}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(percentage, 100)}, 100`}
                      />
                    </svg>
                  );
                })()}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-neutral-700">
                    {percent}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {estimatedCalories}
                </div>
                <div className="text-sm text-neutral-600">Cal ước tính</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
      </div>

      <div className="space-y-10 mb-4">
        {CATEGORY_LIST.filter((c) => c.id !== "all").map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-neutral-900">
                {category.name}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-2">
                {(activeMenuTab === "all" ? filteredDishes : personalizedMenu)
                  .filter((d) => d.category === category.id)
                  .map((dish) => (
                    <div
                      key={dish.id}
                      className="w-72 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                    >
                      <div className="aspect-w-16 aspect-h-9 mb-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                      </div>
                      <div className="mb-3">
                        <h4 className="text-lg font-bold text-neutral-900 mb-1">
                          {dish.name}
                        </h4>
                        <p className="text-neutral-600 text-sm line-clamp-2">
                          {dish.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ${dish.price}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {dish.calories} cal
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDishSelect(dish)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
                      >
                        Chọn món
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeMenuTab === "personalized" && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Mục tiêu của bạn
          </h3>
          <div className="flex flex-wrap gap-4">
            {goals.map((goal) => {
              const Icon = goal.icon;
              return (
                <label
                  key={goal.id}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="goal"
                    checked={currentGoal === goal.id}
                    onChange={() => onGoalChange(goal.id)}
                    className="w-5 h-5 text-orange-500 border-neutral-300 rounded focus:ring-orange-500"
                  />
                  <Icon className="h-5 w-5 text-orange-500" />
                  <span className="font-medium text-neutral-700">
                    {goal.name}
                  </span>
                </label>
              );
            })}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="goal"
                checked={!currentGoal}
                onChange={() => onGoalChange("")}
                className="w-5 h-5 text-orange-500 border-neutral-300 rounded focus:ring-orange-500"
              />
              <span className="font-medium text-neutral-700">
                Không đặt mục tiêu
              </span>
            </label>
          </div>
        </div>
      )}

      {activeMenuTab === "personalized" && personalizedMenu.length === 0 && (
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
    </div>
  );
}
