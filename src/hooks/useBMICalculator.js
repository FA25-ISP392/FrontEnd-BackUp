import { useState, useMemo } from "react";

/**
 * Hook tính toán BMI và phân loại sức khỏe
 * Trích xuất từ PersonalizationModal.jsx
 */
export function useBMICalculator(initialHeight = 170, initialWeight = 70) {
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);

  // Thuật toán tính BMI
  const calculateBMI = useMemo(() => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  }, [height, weight]);

  // Thuật toán phân loại BMI theo WHO
  const getBMICategory = useMemo(() => {
    const bmi = parseFloat(calculateBMI);
    if (bmi < 18.5)
      return {
        category: "Thiếu cân",
        color: "text-blue-600",
        recommendation: "Nên tăng cân để đạt sức khỏe tối ưu",
      };
    if (bmi < 25)
      return {
        category: "Bình thường",
        color: "text-green-600",
        recommendation: "Duy trì cân nặng hiện tại",
      };
    if (bmi < 30)
      return {
        category: "Thừa cân",
        color: "text-yellow-600",
        recommendation: "Nên giảm cân để cải thiện sức khỏe",
      };
    return {
      category: "Béo phì",
      color: "text-red-600",
      recommendation: "Cần giảm cân nghiêm túc để tránh rủi ro sức khỏe",
    };
  }, [calculateBMI]);

  // Thuật toán tính calories cần thiết dựa trên BMI
  const calculateEstimatedCalories = useMemo(() => {
    const bmi = parseFloat(calculateBMI);
    if (bmi < 18.5) return 2200; // Thiếu cân - cần nhiều calories hơn
    if (bmi < 25) return 2000; // Bình thường
    if (bmi < 30) return 1800; // Thừa cân - cần ít calories hơn
    return 1600; // Béo phì - cần giảm calories đáng kể
  }, [calculateBMI]);

  return {
    height,
    weight,
    setHeight,
    setWeight,
    bmi: calculateBMI,
    bmiCategory: getBMICategory,
    estimatedCalories: calculateEstimatedCalories,
  };
}
