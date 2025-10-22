import { useState, useMemo } from "react";

export function useBMRCalculator(
  initialHeight = 170,
  initialWeight = 70,
  initialAge = 25,
  initialGender = "male",
  initialExerciseLevel = "moderate"
) {
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [age, setAge] = useState(initialAge);
  const [gender, setGender] = useState(initialGender);
  const [exerciseLevel, setExerciseLevel] = useState(initialExerciseLevel);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const sessionsPerWeekMap = {
    sedentary: 0,
    light: 2,
    moderate: 4,
    active: 6,
    very_active: 7,
  };

  const calculateBMR = useMemo(() => {
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return Math.round(bmr);
  }, [height, weight, age, gender]);

  const calculateDailyCalories = useMemo(() => {
    return Math.round(calculateBMR * activityMultipliers[exerciseLevel]);
  }, [calculateBMR, exerciseLevel]);

  const getActivityLevelInfo = useMemo(() => {
    const levels = {
      sedentary: {
        name: "Rất ít hoặc không hoạt động thể dục",
        description: "Ít hoặc không tập thể dục",
        multiplier: activityMultipliers.sedentary,
      },
      light: {
        name: "Vận động thể dục nhẹ",
        description: "Tập nhẹ 1-3 ngày mỗi tuần",
        multiplier: activityMultipliers.light,
      },
      moderate: {
        name: "Vận động thể dục trung bình",
        description: "Tập vừa phải 4-5 ngày mỗi tuần",
        multiplier: activityMultipliers.moderate,
      },
      active: {
        name: "Vận động thể dục nặng",
        description: "Tập thường xuyên 6-7 ngày mỗi tuần",
        multiplier: activityMultipliers.active,
      },
      very_active: {
        name: "Vận động thể dục rất nặng",
        description: "Tập cường độ cao mỗi ngày",
        multiplier: activityMultipliers.very_active,
      },
    };
    return levels[exerciseLevel];
  }, [exerciseLevel]);

  const calculateMealCalories = useMemo(() => {
    const mealsPerDay = 3;
    return Math.round(calculateDailyCalories / mealsPerDay);
  }, [calculateDailyCalories]);

  const getCalorieAssessment = useMemo(() => {
    const dailyCalories = calculateDailyCalories;
    if (dailyCalories < 1200) {
      return {
        status: "Thấp",
        color: "text-red-600",
        recommendation: "Nhu cầu calo quá thấp, cần tăng cường dinh dưỡng",
      };
    } else if (dailyCalories < 1500) {
      return {
        status: "Trung bình thấp",
        color: "text-yellow-600",
        recommendation:
          "Nên tăng cường hoạt động thể chất để tăng nhu cầu calo",
      };
    } else if (dailyCalories < 2500) {
      return {
        status: "Phù hợp",
        color: "text-green-600",
        recommendation: "Mức calo phù hợp cho lối sống hiện tại",
      };
    } else {
      return {
        status: "Cao",
        color: "text-blue-600",
        recommendation: "Nhu cầu calo cao, phù hợp với lối sống năng động",
      };
    }
  }, [calculateDailyCalories]);

  return {
    height,
    weight,
    age,
    gender,
    exerciseLevel,

    setHeight,
    setWeight,
    setAge,
    setGender,
    setExerciseLevel,

    bmr: calculateBMR,
    dailyCalories: calculateDailyCalories,
    mealCalories: calculateMealCalories,
    activityLevelInfo: getActivityLevelInfo,
    calorieAssessment: getCalorieAssessment,

    activityMultipliers,
  };
}
