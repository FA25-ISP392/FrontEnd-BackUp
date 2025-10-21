import { X, Save, User } from "lucide-react";
import { useMemo } from "react";

export default function PersonalizationModal({
  isOpen,
  onClose,
  personalizationForm,
  setPersonalizationForm,
  onSubmit,
}) {
  if (!isOpen) return null;


  const goals = [
    { id: "lose", name: "Giảm cân", description: "Muốn giảm cân" },
    { id: "maintain", name: "Giữ dáng", description: "Muốn duy trì cân nặng" },
    { id: "gain", name: "Tăng cân", description: "Muốn tăng cân" },
  ];

  const exerciseLevels = [
    { id: "sedentary", name: "Rất ít hoặc không hoạt động thể dục", description: "Ít hoặc không tập thể dục" },
    { id: "light", name: "1-3 ngày/tuần", description: "Tập nhẹ 1-3 ngày mỗi tuần" },
    { id: "moderate", name: "3-5 ngày/tuần", description: "Tập vừa phải 3-5 ngày mỗi tuần" },
    { id: "active", name: "6-7 ngày/tuần", description: "Tập thường xuyên 6-7 ngày mỗi tuần" },
    { id: "very_active", name: "Tập luyện mỗi ngày với hơn 90 phút/lần tập", description: "Tập cường độ cao mỗi ngày" },
  ];

  // Tính toán BMR real-time
  const { dailyCalories, calorieAssessment } = useMemo(() => {
    // Công thức Mifflin-St Jeor Equation
    let bmr;
    if (personalizationForm.gender === 'male') {
      bmr = (10 * personalizationForm.weight) + (6.25 * personalizationForm.height) - (5 * personalizationForm.age) + 5;
    } else {
      bmr = (10 * personalizationForm.weight) + (6.25 * personalizationForm.height) - (5 * personalizationForm.age) - 161;
    }
    
    // Hệ số hoạt động thể chất
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const dailyCalories = Math.round(bmr * activityMultipliers[personalizationForm.exerciseLevel]);
    
    // Đánh giá mức độ phù hợp của calo
    let calorieAssessment;
    if (dailyCalories < 1200) {
      calorieAssessment = {
        status: "Thấp",
        color: "text-red-600",
        recommendation: "Nhu cầu calo quá thấp, cần tăng cường dinh dưỡng"
      };
    } else if (dailyCalories < 1500) {
      calorieAssessment = {
        status: "Trung bình thấp",
        color: "text-yellow-600",
        recommendation: "Nên tăng cường hoạt động thể chất để tăng nhu cầu calo"
      };
    } else if (dailyCalories < 2500) {
      calorieAssessment = {
        status: "Phù hợp",
        color: "text-green-600",
        recommendation: "Mức calo phù hợp cho lối sống hiện tại"
      };
    } else {
      calorieAssessment = {
        status: "Cao",
        color: "text-blue-600",
        recommendation: "Nhu cầu calo cao, phù hợp với lối sống năng động"
      };
    }
    
    return { dailyCalories, calorieAssessment };
  }, [
    personalizationForm.height,
    personalizationForm.weight,
    personalizationForm.age,
    personalizationForm.gender,
    personalizationForm.exerciseLevel
  ]);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(personalizationForm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cá nhân hóa thực đơn</h2>
                <p className="text-purple-100">
                  Tạo menu phù hợp với sở thích và mục tiêu của bạn
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

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* Thông tin cơ bản - Chiều cao, Cân nặng, Tuổi, Cữ ăn theo ngày, Giới tính */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">
              Thông tin cơ bản
            </h3>
            
            {/* Chiều cao và Cân nặng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Chiều cao: {personalizationForm.height} cm
                </label>
                <input
                  type="range"
                  min="120"
                  max="220"
                  value={personalizationForm.height}
                  onChange={(e) =>
                    setPersonalizationForm((prev) => ({
                      ...prev,
                      height: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Cân nặng: {personalizationForm.weight} kg
                </label>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={personalizationForm.weight}
                  onChange={(e) =>
                    setPersonalizationForm((prev) => ({
                      ...prev,
                      weight: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Tuổi và Cữ ăn theo ngày */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tuổi: {personalizationForm.age} tuổi
                </label>
                <input
                  type="range"
                  min="16"
                  max="80"
                  value={personalizationForm.age}
                  onChange={(e) =>
                    setPersonalizationForm((prev) => ({
                      ...prev,
                      age: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Cữ ăn theo ngày: {personalizationForm.mealsPerDay || 3} bữa
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={personalizationForm.mealsPerDay || 3}
                  onChange={(e) =>
                    setPersonalizationForm((prev) => ({
                      ...prev,
                      mealsPerDay: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Giới tính */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Giới tính
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={personalizationForm.gender === "male"}
                    onChange={(e) =>
                      setPersonalizationForm((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-5 h-5 text-purple-500 border-neutral-300 focus:ring-purple-500"
                  />
                  <span className="font-medium text-neutral-900">Nam</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={personalizationForm.gender === "female"}
                    onChange={(e) =>
                      setPersonalizationForm((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-5 h-5 text-purple-500 border-neutral-300 focus:ring-purple-500"
                  />
                  <span className="font-medium text-neutral-900">Nữ</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lượng tập thể dục trong tuần */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Lượng tập thể dục trong tuần
            </h3>
            <div className="space-y-3">
              {exerciseLevels.map((level) => (
                <label
                  key={level.id}
                  className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="exerciseLevel"
                    value={level.id}
                    checked={personalizationForm.exerciseLevel === level.id}
                    onChange={(e) =>
                      setPersonalizationForm((prev) => ({
                        ...prev,
                        exerciseLevel: e.target.value,
                      }))
                    }
                    className="w-5 h-5 text-purple-500 border-neutral-300 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-neutral-900">
                      {level.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {level.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* BMR Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Nhu cầu calo hàng ngày (BMR)
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-1">{dailyCalories}</div>
              <div className="text-sm text-neutral-600 mb-2">
                calo/ngày
              </div>
              <div className={`text-sm font-medium ${calorieAssessment.color}`}>
                {calorieAssessment.status}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {calorieAssessment.recommendation}
              </div>
            </div>
          </div>

          {/* Mục tiêu cá nhân */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Mục tiêu cá nhân
            </h3>
            <div className="space-y-2">
              {goals.map((goal) => (
                <label
                  key={goal.id}
                  className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="goal"
                    value={goal.id}
                    checked={personalizationForm.goal === goal.id}
                    onChange={(e) =>
                      setPersonalizationForm((prev) => ({
                        ...prev,
                        goal: e.target.value,
                      }))
                    }
                    className="w-4 h-4 text-purple-500 border-neutral-300 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-neutral-900 text-sm">
                      {goal.name}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {goal.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Tạo Menu Cá Nhân
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
