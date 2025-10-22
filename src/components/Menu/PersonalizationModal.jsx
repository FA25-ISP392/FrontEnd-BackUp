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
    {
      id: "sedentary",
      name: "Rất ít hoặc không vận động",
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

  const bmr = useMemo(() => {
    const { height, weight, age, gender } = personalizationForm || {};
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(personalizationForm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cá nhân hoá thực đơn</h2>
                <p className="text-purple-100">
                  Tạo menu phù hợp với cơ thể và mục tiêu của bạn
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
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">
              Thông tin cơ bản
            </h3>

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
                    setPersonalizationForm((p) => ({
                      ...p,
                      height: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
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
                    setPersonalizationForm((p) => ({
                      ...p,
                      weight: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

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
                    setPersonalizationForm((p) => ({
                      ...p,
                      age: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
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
                    setPersonalizationForm((p) => ({
                      ...p,
                      mealsPerDay: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

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
                      setPersonalizationForm((p) => ({
                        ...p,
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
                      setPersonalizationForm((p) => ({
                        ...p,
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
                      setPersonalizationForm((p) => ({
                        ...p,
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

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Chỉ số BMR
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {bmr}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Được tính dựa trên công thức Mifflin–St Jeor
              </div>
            </div>
          </div>

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
                      setPersonalizationForm((p) => ({
                        ...p,
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
