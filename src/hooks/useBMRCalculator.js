import { useState, useMemo } from 'react';

/**
 * Hook tính toán BMR (Basal Metabolic Rate) và nhu cầu calo hàng ngày
 * Sử dụng công thức Mifflin-St Jeor Equation
 */
export function useBMRCalculator(initialHeight = 170, initialWeight = 70, initialAge = 25, initialGender = 'male', initialExerciseLevel = 'moderate') {
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [age, setAge] = useState(initialAge);
  const [gender, setGender] = useState(initialGender);
  const [exerciseLevel, setExerciseLevel] = useState(initialExerciseLevel);

  // Hệ số hoạt động thể chất
  const activityMultipliers = {
    sedentary: 1.2,      // Rất ít hoặc không hoạt động
    light: 1.375,        // 1-3 ngày/tuần
    moderate: 1.55,       // 3-5 ngày/tuần
    active: 1.725,        // 6-7 ngày/tuần
    very_active: 1.9      // Tập luyện mỗi ngày với hơn 90 phút/lần tập
  };

  // Thuật toán tính BMR cơ bản (Mifflin-St Jeor Equation)
  const calculateBMR = useMemo(() => {
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    return Math.round(bmr);
  }, [height, weight, age, gender]);

  // Thuật toán tính nhu cầu calo hàng ngày (BMR * Activity Factor)
  const calculateDailyCalories = useMemo(() => {
    return Math.round(calculateBMR * activityMultipliers[exerciseLevel]);
  }, [calculateBMR, exerciseLevel]);

  // Thuật toán phân loại mức độ hoạt động
  const getActivityLevelInfo = useMemo(() => {
    const levels = {
      sedentary: { 
        name: "Rất ít hoặc không hoạt động thể dục", 
        description: "Ít hoặc không tập thể dục",
        multiplier: activityMultipliers.sedentary
      },
      light: { 
        name: "1-3 ngày/tuần", 
        description: "Tập nhẹ 1-3 ngày mỗi tuần",
        multiplier: activityMultipliers.light
      },
      moderate: { 
        name: "3-5 ngày/tuần", 
        description: "Tập vừa phải 3-5 ngày mỗi tuần",
        multiplier: activityMultipliers.moderate
      },
      active: { 
        name: "6-7 ngày/tuần", 
        description: "Tập thường xuyên 6-7 ngày mỗi tuần",
        multiplier: activityMultipliers.active
      },
      very_active: { 
        name: "Tập luyện mỗi ngày với hơn 90 phút/lần tập", 
        description: "Tập cường độ cao mỗi ngày",
        multiplier: activityMultipliers.very_active
      }
    };
    return levels[exerciseLevel];
  }, [exerciseLevel]);

  // Thuật toán tính calo cho từng bữa ăn (dựa trên số bữa/ngày)
  const calculateMealCalories = useMemo(() => {
    const mealsPerDay = 3; // Mặc định 3 bữa/ngày
    return Math.round(calculateDailyCalories / mealsPerDay);
  }, [calculateDailyCalories]);

  // Thuật toán đánh giá mức độ phù hợp của calo
  const getCalorieAssessment = useMemo(() => {
    const dailyCalories = calculateDailyCalories;
    if (dailyCalories < 1200) {
      return {
        status: "Thấp",
        color: "text-red-600",
        recommendation: "Nhu cầu calo quá thấp, cần tăng cường dinh dưỡng"
      };
    } else if (dailyCalories < 1500) {
      return {
        status: "Trung bình thấp",
        color: "text-yellow-600",
        recommendation: "Nên tăng cường hoạt động thể chất để tăng nhu cầu calo"
      };
    } else if (dailyCalories < 2500) {
      return {
        status: "Phù hợp",
        color: "text-green-600",
        recommendation: "Mức calo phù hợp cho lối sống hiện tại"
      };
    } else {
      return {
        status: "Cao",
        color: "text-blue-600",
        recommendation: "Nhu cầu calo cao, phù hợp với lối sống năng động"
      };
    }
  }, [calculateDailyCalories]);

  return {
    // State values
    height,
    weight,
    age,
    gender,
    exerciseLevel,
    
    // State setters
    setHeight,
    setWeight,
    setAge,
    setGender,
    setExerciseLevel,
    
    // Calculated values
    bmr: calculateBMR,
    dailyCalories: calculateDailyCalories,
    mealCalories: calculateMealCalories,
    activityLevelInfo: getActivityLevelInfo,
    calorieAssessment: getCalorieAssessment,
    
    // Activity multipliers for reference
    activityMultipliers
  };
}
