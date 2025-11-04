import { X, Save, User, Activity, Target } from "lucide-react"; // 👈 Thêm icon
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

// === SỬA: Component Slider đẹp hơn ===
const InfoSlider = ({ label, value, min, max, step = 1, unit, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      {label}:{" "}
      <span className="font-bold text-orange-600">
        {value} {unit}
      </span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer range-thumb"
    />
  </div>
);

// === SỬA: Component Nút Radio đẹp hơn ===
const OptionGroup = ({ options, selected, onSelect, name }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
    {options.map((opt) => (
      <label
        key={opt.id}
        className={`flex flex-col items-center justify-center text-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300
        ${
          selected === opt.id
            ? "border-orange-500 bg-orange-50 shadow-lg"
            : "border-neutral-200 bg-white hover:bg-neutral-50 hover:border-orange-300"
        }`}
      >
        <input
          type="radio"
          name={name}
          value={opt.id}
          checked={selected === opt.id}
          onChange={() => onSelect(opt.id)}
          className="sr-only"
        />
        <div className="font-semibold text-neutral-800 text-sm">{opt.name}</div>
        <div className="text-xs text-neutral-500">{opt.description}</div>
      </label>
    ))}
  </div>
);

export default function PersonalizationModal({
  isOpen,
  onClose,
  personalizationForm,
  setPersonalizationForm,
  onSubmit,
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
    { id: "sedentary", name: "Ít vận động", description: "Không tập" },
    { id: "light", name: "Nhẹ", description: "1–3 buổi/tuần" },
    { id: "moderate", name: "Vừa", description: "4–5 buổi/tuần" },
    { id: "active", name: "Nặng", description: "6–7 buổi/tuần" },
    { id: "very_active", name: "Rất nặng", description: "Mỗi ngày" },
  ];

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { height, weight, age, gender, mealsPerDay, exerciseLevel, goal } =
      personalizationForm;

    const multiplier = activityMultipliers[exerciseLevel] || 1.55;
    const maintenance = bmr * multiplier;
    let result = maintenance;
    if (goal === "lose") result -= 500;
    if (goal === "gain") result += 500;
    const rounded = Math.round(result);
    setDailyCalories(rounded);

    const customerUpdatePayload = {
      height: height,
      weight: weight,
      sex: gender === "male" ? true : false,
      portion: mealsPerDay || 3,
    };

    const suggestionCreationPayload = {
      age: age,
      activityLevel: FE_TO_BE_ACTIVITY_LEVEL[exerciseLevel],
      goal: FE_TO_BE_DISH_TYPE[goal],
    };

    onSubmit({
      customerUpdatePayload,
      suggestionCreationPayload,
      dailyCalories: rounded,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* === SỬA: Tăng max-w-3xl === */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* ===== Header ===== */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cá Nhân Hoá Thực Đơn</h2>
                <p className="text-purple-100">
                  Giúp chúng tôi hiểu rõ mục tiêu của bạn
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* ===== Form ===== */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* ===== Thông tin cơ bản ===== */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-neutral-900 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InfoSlider
                label="Chiều cao"
                value={personalizationForm.height}
                min="120"
                max="220"
                unit="cm"
                onChange={(e) =>
                  setPersonalizationForm((p) => ({
                    ...p,
                    height: parseInt(e.target.value, 10),
                  }))
                }
              />
              <InfoSlider
                label="Cân nặng"
                value={personalizationForm.weight}
                min="30"
                max="150"
                unit="kg"
                onChange={(e) =>
                  setPersonalizationForm((p) => ({
                    ...p,
                    weight: parseInt(e.target.value, 10),
                  }))
                }
              />
              <InfoSlider
                label="Tuổi"
                value={personalizationForm.age}
                min="16"
                max="80"
                unit="tuổi"
                onChange={(e) =>
                  setPersonalizationForm((p) => ({
                    ...p,
                    age: parseInt(e.target.value, 10),
                  }))
                }
              />
              <InfoSlider
                label="Cữ ăn/ngày"
                value={personalizationForm.mealsPerDay || 3}
                min="1"
                max="6"
                unit="bữa"
                onChange={(e) =>
                  setPersonalizationForm((p) => ({
                    ...p,
                    mealsPerDay: parseInt(e.target.value, 10),
                  }))
                }
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Giới tính
                </label>
                <div className="flex gap-4">
                  {["male", "female"].map((g) => (
                    <label
                      key={g}
                      className={`flex-1 flex items-center space-x-3 p-3 border-2 rounded-xl hover:border-orange-300 cursor-pointer transition
                      ${
                        personalizationForm.gender === g
                          ? "border-orange-500 bg-orange-50"
                          : "border-neutral-200"
                      }`}
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
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="font-medium text-neutral-800">
                        {g === "male" ? "Nam" : "Nữ"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== Mức vận động ===== */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-neutral-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Mức độ vận động
            </h3>
            <OptionGroup
              options={exerciseLevels}
              selected={personalizationForm.exerciseLevel}
              onSelect={(val) =>
                setPersonalizationForm((p) => ({ ...p, exerciseLevel: val }))
              }
              name="exerciseLevel"
            />
          </div>

          {/* ===== Mục tiêu cá nhân ===== */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-neutral-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Mục tiêu cá nhân
            </h3>
            <OptionGroup
              options={goals}
              selected={personalizationForm.goal}
              onSelect={(val) =>
                setPersonalizationForm((p) => ({ ...p, goal: val }))
              }
              name="goal"
            />
          </div>
        </form>

        {/* ===== Footer / Kết quả ===== */}
        <div className="p-6 border-t border-neutral-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-xs text-neutral-500 uppercase font-medium">
                BMR
              </div>
              <div className="text-2xl font-bold text-neutral-800">{bmr}</div>
            </div>
            {dailyCalories && (
              <>
                <div className="text-center">
                  <div className="text-xs text-neutral-500 uppercase font-medium">
                    Calo mục tiêu
                  </div>
                  <div className="text-3xl font-extrabold text-orange-600">
                    {dailyCalories}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-neutral-500 uppercase font-medium">
                    Đã nạp
                  </div>
                  <div className="text-3xl font-extrabold text-green-600">
                    {Math.round(caloriesConsumed || 0)}
                  </div>
                </div>
              </>
            )}
            <button
              type="submit"
              onClick={handleSubmit} // 👈 Gắn submit vào đây
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5"
            >
              <Save className="h-5 w-5" />
              Tra cứu & Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
