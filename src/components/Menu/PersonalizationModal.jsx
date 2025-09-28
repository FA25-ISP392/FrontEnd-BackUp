import { X, Save, User } from "lucide-react";

export default function PersonalizationModal({
  isOpen,
  onClose,
  personalizationForm,
  setPersonalizationForm,
  onSubmit,
}) {
  if (!isOpen) return null;

  const preferences = [
    { id: "spicy", name: "Cay", description: "Thích đồ cay" },
    { id: "fatty", name: "Béo", description: "Thích đồ béo" },
    { id: "sweet", name: "Ngọt", description: "Thích đồ ngọt" },
    { id: "salty", name: "Mặn", description: "Thích đồ mặn" },
    { id: "sour", name: "Chua", description: "Thích đồ chua" },
  ];

  const goals = [
    { id: "lose", name: "Giảm cân", description: "Muốn giảm cân" },
    { id: "maintain", name: "Giữ dáng", description: "Muốn duy trì cân nặng" },
    { id: "gain", name: "Tăng cân", description: "Muốn tăng cân" },
  ];

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Thiếu cân", color: "text-blue-600" };
    if (bmi < 25) return { category: "Bình thường", color: "text-green-600" };
    if (bmi < 30) return { category: "Thừa cân", color: "text-yellow-600" };
    return { category: "Béo phì", color: "text-red-600" };
  };

  const bmi = calculateBMI(
    personalizationForm.height,
    personalizationForm.weight,
  );
  const bmiInfo = getBMICategory(bmi);

  const handlePreferenceChange = (preferenceId, checked) => {
    setPersonalizationForm((prev) => ({
      ...prev,
      preferences: checked
        ? [...prev.preferences, preferenceId]
        : prev.preferences.filter((id) => id !== preferenceId),
    }));
  };

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
          {/* Height and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
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
              <label className="block text-sm font-medium text-neutral-700 mb-3">
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

          {/* BMI Display */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Chỉ số BMI của bạn
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">{bmi}</div>
              <div className={`text-lg font-medium ${bmiInfo.color}`}>
                {bmiInfo.category}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Sở thích ẩm thực
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {preferences.map((preference) => (
                <label
                  key={preference.id}
                  className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={personalizationForm.preferences.includes(
                      preference.id,
                    )}
                    onChange={(e) =>
                      handlePreferenceChange(preference.id, e.target.checked)
                    }
                    className="w-5 h-5 text-purple-500 border-neutral-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-neutral-900">
                      {preference.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {preference.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Mục tiêu của bạn
            </h3>
            <div className="space-y-3">
              {goals.map((goal) => (
                <label
                  key={goal.id}
                  className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
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
                    className="w-5 h-5 text-purple-500 border-neutral-300 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-neutral-900">
                      {goal.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {goal.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
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
