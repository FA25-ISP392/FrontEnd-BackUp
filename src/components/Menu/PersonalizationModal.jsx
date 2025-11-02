import { X, Save, User } from "lucide-react";
import { useMemo } from "react";

// ÁNH XẠ DỮ LIỆU TỪ FE SANG BE
const FE_TO_BE_DISH_TYPE = {
  lose: "FAT_LOSS",
  maintain: "STAY_FIT",
  gain: "BUILD_MUSCLE",
};
const FE_TO_BE_ACTIVITY_LEVEL = {
  sedentary: "SEDENTARY",
  light: "LIGHTLY_ACTIVE",
  moderate: "MODERATELY_ACTIVE",
  active: "VERY_ACTIVE",
  very_active: "EXTRA_ACTIVE",
};

export default function PersonalizationModal({
  isOpen,
  onClose,
  personalizationForm,
  setPersonalizationForm,
  onSubmit, // <--- Sẽ nhận 2 payload
  dailyCalories,
  setDailyCalories,
  caloriesConsumed,
}) {
  if (!isOpen) return null;

  const goals = [
    { id: "lose", name: "Giảm cân", description: "Muốn giảm cân" },
    { id: "maintain", name: "Giữ dáng", description: "Muốn duy trì cân nặng" },
    { id: "gain", name: "Tăng cân", description: "Muốn tăng cân" },
  ];

  const exerciseLevels = [
    {
      id: "sedentary",
      name: "Rất ít vận động",
      description: "Hầu như không tập thể dục",
    },
    { id: "light", name: "Vận động nhẹ", description: "Tập nhẹ 1–3 buổi/tuần" },
    {
      id: "moderate",
      name: "Vận động trung bình",
      description: "Tập vừa 4–5 buổi/tuần",
    },
    {
      id: "active",
      name: "Vận động nặng",
      description: "Tập thường xuyên 6–7 buổi/tuần",
    },
    {
      id: "very_active",
      name: "Rất nặng",
      description: "Tập cường độ cao mỗi ngày",
    },
  ];

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  // ✅ Tính BMR
  const bmr = useMemo(() => {
    const { height, weight, age, gender } = personalizationForm || {};
    if (!height || !weight || !age || !gender) return 0;
    const base =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    return Math.round(base);
  }, [
    personalizationForm.height,
    personalizationForm.weight,
    personalizationForm.age,
    personalizationForm.gender,
  ]);

  // ✅ Khi nhấn "Tra cứu"
  const handleSubmit = (e) => {
    e.preventDefault();
    const { height, weight, age, gender, mealsPerDay, exerciseLevel, goal } =
      personalizationForm;

    // 1. Logic tính toán TDEE cho hiển thị modal
    const multiplier = activityMultipliers[exerciseLevel] || 1.55;
    const maintenance = bmr * multiplier;
    let result = maintenance;
    if (goal === "lose") result -= 500;
    if (goal === "gain") result += 500;
    const rounded = Math.round(result);
    setDailyCalories(rounded); // Update local state for display

    // 2. TẠO PAYLOAD 1: Cập nhật Customer Profile (PUT /customer/{customerId})
    // Chứa height, weight, sex, portion (gửi lên API 1)
    const customerUpdatePayload = {
      height: height,
      weight: weight,
      // Map 'male' (true) / 'female' (false)
      sex: gender === "male" ? true : false,
      portion: mealsPerDay || 3, // BE DTO uses Integer portion
    };

    // 3. TẠO PAYLOAD 2: Gợi ý Menu (POST /suggestions/menu)
    // Chứa age, activityLevel, goal (gửi lên API 2)
    const suggestionCreationPayload = {
      age: age,
      activityLevel: FE_TO_BE_ACTIVITY_LEVEL[exerciseLevel],
      goal: FE_TO_BE_DISH_TYPE[goal],
    };

    // 4. Gọi handler cha (Menu) để thực hiện 2 API tuần tự
    onSubmit({
      customerUpdatePayload,
      suggestionCreationPayload,
      dailyCalories: rounded, // Truyền TDEE/dailyCalories để Menu.jsx lưu
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* ===== Header ===== */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Theo dõi calories cho bạn
                </h2>
                <p className="text-purple-100">
                  Tính toán nhu cầu calo hàng ngày của bạn
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* ===== Form ===== */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* ===== Thông tin cơ bản ===== */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-6">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Chiều cao */}
              <div>
                <label className="block text-sm mb-2">
                  Chiều cao: {personalizationForm.height} cm
                </label>
                <input
                  type="range"
                  min="120"
                  max="220"
                  value={personalizationForm.height}
                  onChange={(e) =>
                    setPersonalizationForm((p) => ({
                      ...p,
                      height: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              {/* Cân nặng */}
              <div>
                <label className="block text-sm mb-2">
                  Cân nặng: {personalizationForm.weight} kg
                </label>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={personalizationForm.weight}
                  onChange={(e) =>
                    setPersonalizationForm((p) => ({
                      ...p,
                      weight: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Tuổi + Số bữa ăn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">
                  Tuổi: {personalizationForm.age} tuổi
                </label>
                <input
                  type="range"
                  min="16"
                  max="80"
                  value={personalizationForm.age}
                  onChange={(e) =>
                    setPersonalizationForm((p) => ({
                      ...p,
                      age: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Cữ ăn/ngày: {personalizationForm.mealsPerDay || 3} bữa
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={personalizationForm.mealsPerDay || 3}
                  onChange={(e) =>
                    setPersonalizationForm((p) => ({
                      ...p,
                      mealsPerDay: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Giới tính */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3">
                Giới tính
              </label>
              <div className="flex gap-4">
                {["male", "female"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={personalizationForm.gender === g}
                      onChange={(e) =>
                        setPersonalizationForm((p) => ({
                          ...p,
                          gender: e.target.value,
                        }))
                      }
                    />
                    <span className="font-medium">
                      {g === "male" ? "Nam" : "Nữ"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Mức vận động ===== */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Mức độ vận động</h3>
            <div className="space-y-3">
              {exerciseLevels.map((level) => (
                <label
                  key={level.id}
                  className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="exerciseLevel"
                    value={level.id}
                    checked={personalizationForm.exerciseLevel === level.id}
                    onChange={(e) =>
                      setPersonalizationForm((p) => ({
                        ...p,
                        exerciseLevel: e.target.value,
                      }))
                    }
                  />
                  <div>
                    <div className="font-medium">{level.name}</div>
                    <div className="text-sm text-neutral-600">
                      {level.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ===== Mục tiêu cá nhân ===== */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Mục tiêu cá nhân</h3>
            <div className="space-y-2">
              {goals.map((goal) => (
                <label
                  key={goal.id}
                  className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="goal"
                    value={goal.id}
                    checked={personalizationForm.goal === goal.id}
                    onChange={(e) =>
                      setPersonalizationForm((p) => ({
                        ...p,
                        goal: e.target.value,
                      }))
                    }
                  />
                  <div>
                    <div className="font-medium text-sm">{goal.name}</div>
                    <div className="text-xs text-neutral-600">
                      {goal.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ===== BMR & Kết quả ===== */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200 text-center">
            <h3 className="text-lg font-bold mb-1">Chỉ số BMR</h3>
            <div className="text-3xl font-bold text-green-600">{bmr}</div>
            <div className="text-xs text-neutral-500">
              Tính theo công thức Mifflin–St Jeor
            </div>

            {dailyCalories && (
              <div className="mt-6">
                <h4 className="text-base font-semibold text-neutral-900 mb-1">
                  Calories cần nạp mỗi ngày
                </h4>
                <div className="text-3xl font-bold text-orange-600 mb-3">
                  {dailyCalories} cal
                </div>

                {/* 🆕 Thêm dòng hiển thị calories đã thêm */}
                <div>
                  <h4 className="text-base font-semibold text-neutral-900 mb-1">
                    Calories đã thêm
                  </h4>
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(caloriesConsumed || 0)} cal
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== Nút hành động ===== */}
          <div className="flex gap-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 font-medium flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Tra cứu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
