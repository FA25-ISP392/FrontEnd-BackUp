// import { X, Save, User } from "lucide-react";
// import { useMemo } from "react";

// export default function PersonalizationModal({
//   isOpen,
//   onClose,
//   personalizationForm,
//   setPersonalizationForm,
//   onSubmit, // vẫn giữ để BE xử lý
//   dailyCalories, // 🆕 nhận từ cha
//   setDailyCalories,
//   caloriesConsumed, // 🆕 setter từ cha
// }) {
//   if (!isOpen) return null;

//   const goals = [
//     { id: "lose", name: "Giảm cân", description: "Muốn giảm cân" },
//     { id: "maintain", name: "Giữ dáng", description: "Muốn duy trì cân nặng" },
//     { id: "gain", name: "Tăng cân", description: "Muốn tăng cân" },
//   ];

//   const exerciseLevels = [
//     {
//       id: "sedentary",
//       name: "Rất ít vận động",
//       description: "Hầu như không tập thể dục",
//     },
//     { id: "light", name: "Vận động nhẹ", description: "Tập nhẹ 1–3 buổi/tuần" },
//     {
//       id: "moderate",
//       name: "Vận động trung bình",
//       description: "Tập vừa 4–5 buổi/tuần",
//     },
//     {
//       id: "active",
//       name: "Vận động nặng",
//       description: "Tập thường xuyên 6–7 buổi/tuần",
//     },
//     {
//       id: "very_active",
//       name: "Rất nặng",
//       description: "Tập cường độ cao mỗi ngày",
//     },
//   ];

//   const activityMultipliers = {
//     sedentary: 1.2,
//     light: 1.375,
//     moderate: 1.55,
//     active: 1.725,
//     very_active: 1.9,
//   };

//   // ✅ Tính BMR
//   const bmr = useMemo(() => {
//     const { height, weight, age, gender } = personalizationForm || {};
//     if (!height || !weight || !age || !gender) return 0;
//     const base =
//       gender === "male"
//         ? 10 * weight + 6.25 * height - 5 * age + 5
//         : 10 * weight + 6.25 * height - 5 * age - 161;
//     return Math.round(base);
//   }, [
//     personalizationForm.height,
//     personalizationForm.weight,
//     personalizationForm.age,
//     personalizationForm.gender,
//   ]);

//   // ✅ Khi nhấn "Tra cứu"
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { exerciseLevel, goal } = personalizationForm;

//     const multiplier = activityMultipliers[exerciseLevel] || 1.55;
//     const maintenance = bmr * multiplier;
//     let result = maintenance;
//     if (goal === "lose") result -= 500;
//     if (goal === "gain") result += 500;

//     const rounded = Math.round(result);
//     setDailyCalories(rounded); // 🧠 lưu state ở cha → giữ nguyên khi mở lại

//     // vẫn gọi BE nếu cần
//     onSubmit?.({ ...personalizationForm, dailyCalories: rounded });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//         {/* ===== Header ===== */}
//         <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//                 <User className="h-6 w-6" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold">
//                   Theo dõi calories cho bạn
//                 </h2>
//                 <p className="text-purple-100">
//                   Tính toán nhu cầu calo hàng ngày của bạn
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/20 rounded-lg transition"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         {/* ===== Form ===== */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
//         >
//           {/* ===== Thông tin cơ bản ===== */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold mb-6">Thông tin cơ bản</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               {/* Chiều cao */}
//               <div>
//                 <label className="block text-sm mb-2">
//                   Chiều cao: {personalizationForm.height} cm
//                 </label>
//                 <input
//                   type="range"
//                   min="120"
//                   max="220"
//                   value={personalizationForm.height}
//                   onChange={(e) =>
//                     setPersonalizationForm((p) => ({
//                       ...p,
//                       height: parseInt(e.target.value, 10),
//                     }))
//                   }
//                   className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>
//               {/* Cân nặng */}
//               <div>
//                 <label className="block text-sm mb-2">
//                   Cân nặng: {personalizationForm.weight} kg
//                 </label>
//                 <input
//                   type="range"
//                   min="30"
//                   max="150"
//                   value={personalizationForm.weight}
//                   onChange={(e) =>
//                     setPersonalizationForm((p) => ({
//                       ...p,
//                       weight: parseInt(e.target.value, 10),
//                     }))
//                   }
//                   className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>
//             </div>

//             {/* Tuổi + Số bữa ăn */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm mb-2">
//                   Tuổi: {personalizationForm.age} tuổi
//                 </label>
//                 <input
//                   type="range"
//                   min="16"
//                   max="80"
//                   value={personalizationForm.age}
//                   onChange={(e) =>
//                     setPersonalizationForm((p) => ({
//                       ...p,
//                       age: parseInt(e.target.value, 10),
//                     }))
//                   }
//                   className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm mb-2">
//                   Cữ ăn/ngày: {personalizationForm.mealsPerDay || 3} bữa
//                 </label>
//                 <input
//                   type="range"
//                   min="1"
//                   max="6"
//                   value={personalizationForm.mealsPerDay || 3}
//                   onChange={(e) =>
//                     setPersonalizationForm((p) => ({
//                       ...p,
//                       mealsPerDay: parseInt(e.target.value, 10),
//                     }))
//                   }
//                   className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>
//             </div>

//             {/* Giới tính */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-3">
//                 Giới tính
//               </label>
//               <div className="flex gap-4">
//                 {["male", "female"].map((g) => (
//                   <label
//                     key={g}
//                     className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition"
//                   >
//                     <input
//                       type="radio"
//                       name="gender"
//                       value={g}
//                       checked={personalizationForm.gender === g}
//                       onChange={(e) =>
//                         setPersonalizationForm((p) => ({
//                           ...p,
//                           gender: e.target.value,
//                         }))
//                       }
//                     />
//                     <span className="font-medium">
//                       {g === "male" ? "Nam" : "Nữ"}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ===== Mức vận động ===== */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold mb-4">Mức độ vận động</h3>
//             <div className="space-y-3">
//               {exerciseLevels.map((level) => (
//                 <label
//                   key={level.id}
//                   className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition"
//                 >
//                   <input
//                     type="radio"
//                     name="exerciseLevel"
//                     value={level.id}
//                     checked={personalizationForm.exerciseLevel === level.id}
//                     onChange={(e) =>
//                       setPersonalizationForm((p) => ({
//                         ...p,
//                         exerciseLevel: e.target.value,
//                       }))
//                     }
//                   />
//                   <div>
//                     <div className="font-medium">{level.name}</div>
//                     <div className="text-sm text-neutral-600">
//                       {level.description}
//                     </div>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* ===== Mục tiêu cá nhân ===== */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold mb-4">Mục tiêu cá nhân</h3>
//             <div className="space-y-2">
//               {goals.map((goal) => (
//                 <label
//                   key={goal.id}
//                   className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition"
//                 >
//                   <input
//                     type="radio"
//                     name="goal"
//                     value={goal.id}
//                     checked={personalizationForm.goal === goal.id}
//                     onChange={(e) =>
//                       setPersonalizationForm((p) => ({
//                         ...p,
//                         goal: e.target.value,
//                       }))
//                     }
//                   />
//                   <div>
//                     <div className="font-medium text-sm">{goal.name}</div>
//                     <div className="text-xs text-neutral-600">
//                       {goal.description}
//                     </div>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* ===== BMR & Kết quả ===== */}
//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200 text-center">
//             <h3 className="text-lg font-bold mb-1">Chỉ số BMR</h3>
//             <div className="text-3xl font-bold text-green-600">{bmr}</div>
//             <div className="text-xs text-neutral-500">
//               Tính theo công thức Mifflin–St Jeor
//             </div>

//             {dailyCalories && (
//               <div className="mt-6">
//                 <h4 className="text-base font-semibold text-neutral-900 mb-1">
//                   Calories cần nạp mỗi ngày
//                 </h4>
//                 <div className="text-3xl font-bold text-orange-600 mb-3">
//                   {dailyCalories} cal
//                 </div>

//                 {/* 🆕 Thêm dòng hiển thị calories đã thêm */}
//                 <div>
//                   <h4 className="text-base font-semibold text-neutral-900 mb-1">
//                     Calories đã thêm
//                   </h4>
//                   <div className="text-2xl font-bold text-emerald-600">
//                     {Math.round(caloriesConsumed || 0)} cal
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ===== Nút hành động ===== */}
//           <div className="flex gap-3 pt-6 border-t border-neutral-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 font-medium"
//             >
//               Hủy
//             </button>
//             <button
//               type="submit"
//               className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 font-medium flex items-center justify-center gap-2"
//             >
//               <Save className="h-4 w-4" />
//               Tra cứu
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { getSuggestedMenu } from "../../lib/apiSuggestion";
import { showToast } from "../../common/ToastHost";

export default function PersonalizationModal({
  isOpen,
  onClose,
  personalizationForm,
  setPersonalizationForm,
  onApplySuggestions, // ✅ callback mới để trả list món lên Menu.jsx
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const activityMap = {
        sedentary: "SEDENTARY",
        lightly_active: "LIGHTLY_ACTIVE",
        moderately_active: "MODERATELY_ACTIVE",
        very_active: "VERY_ACTIVE",
        extra_active: "EXTRA_ACTIVE",
      };

      const body = {
        activityLevel:
          personalizationForm.exerciseLevel?.toUpperCase() || "SEDENTARY",
        numberOfMeals: Number(personalizationForm.mealsPerDay || 3),
      };

      const result = await getSuggestedMenu(body);
      onApplySuggestions(result);
      showToast("Đã nhận gợi ý món phù hợp!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Không thể lấy gợi ý món ăn!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-neutral-900">
          🎯 Menu gợi ý cho bạn
        </h2>

        {/* Giới tính */}
        <div>
          <label className="block font-medium mb-1">Giới tính</label>
          <select
            value={personalizationForm.gender}
            onChange={(e) =>
              setPersonalizationForm((f) => ({ ...f, gender: e.target.value }))
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        {/* Chiều cao & cân nặng */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Chiều cao (cm)</label>
            <input
              type="number"
              value={personalizationForm.height}
              onChange={(e) =>
                setPersonalizationForm((f) => ({
                  ...f,
                  height: Number(e.target.value),
                }))
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Cân nặng (kg)</label>
            <input
              type="number"
              value={personalizationForm.weight}
              onChange={(e) =>
                setPersonalizationForm((f) => ({
                  ...f,
                  weight: Number(e.target.value),
                }))
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Mức độ vận động */}
        <div>
          <label className="block font-medium mb-1">Cường độ vận động</label>
          <select
            value={personalizationForm.exerciseLevel}
            onChange={(e) =>
              setPersonalizationForm((f) => ({
                ...f,
                exerciseLevel: e.target.value,
              }))
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="sedentary">Ít vận động</option>
            <option value="lightly_active">Vận động nhẹ</option>
            <option value="moderately_active">Vận động vừa</option>
            <option value="very_active">Vận động nhiều</option>
            <option value="extra_active">Vận động rất nhiều</option>
          </select>
        </div>

        {/* Mục tiêu */}
        <div>
          <label className="block font-medium mb-1">Mục tiêu</label>
          <select
            value={personalizationForm.goal}
            onChange={(e) =>
              setPersonalizationForm((f) => ({ ...f, goal: e.target.value }))
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="lose">Giảm cân</option>
            <option value="maintain">Giữ dáng</option>
            <option value="gain">Tăng cân</option>
          </select>
        </div>

        {/* Số bữa ăn */}
        <div>
          <label className="block font-medium mb-1">Số bữa/ngày</label>
          <input
            type="number"
            min={1}
            max={5}
            value={personalizationForm.mealsPerDay}
            onChange={(e) =>
              setPersonalizationForm((f) => ({
                ...f,
                mealsPerDay: Number(e.target.value),
              }))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition"
        >
          {loading ? "Đang xử lý..." : "🍱 Xem gợi ý món ăn"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 border border-neutral-300 rounded-xl py-2 text-neutral-600 hover:bg-neutral-100"
        >
          Huỷ
        </button>
      </form>
    </div>
  );
}
