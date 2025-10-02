import { useState, useMemo } from 'react';

/**
 * Hook cá nhân hóa menu dựa trên sở thích và mục tiêu
 * Trích xuất từ Menu.jsx và PersonalizationModal.jsx
 */
export function useMenuPersonalization(allDishes = []) {
  const [personalizationForm, setPersonalizationForm] = useState({
    height: 170,
    weight: 70,
    gender: 'male',
    age: 25,
    exerciseLevel: 'moderate',
    preferences: [],
    goal: '',
  });

  // Thuật toán lọc món ăn theo sở thích
  const getPersonalizedDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      // Lọc theo sở thích ăn uống
      if (personalizationForm.preferences.includes('spicy') && !dish.spicy) return false;
      if (personalizationForm.preferences.includes('fatty') && !dish.fatty) return false;
      if (personalizationForm.preferences.includes('sweet') && !dish.sweet) return false;
      if (personalizationForm.preferences.includes('salty') && !dish.salty) return false;
      if (personalizationForm.preferences.includes('sour') && !dish.sour) return false;

      // Lọc theo mục tiêu sức khỏe
      if (personalizationForm.goal === 'lose' && dish.calories > 300) return false;
      if (personalizationForm.goal === 'gain' && dish.calories < 200) return false;
      if (personalizationForm.goal === 'maintain' && (dish.calories < 150 || dish.calories > 400)) return false;

      return dish.available;
    });
  }, [allDishes, personalizationForm]);

  // Thuật toán tính calories theo mức độ vận động
  const calculateCaloriesByActivity = useMemo(() => {
    const { weight, gender, age, exerciseLevel } = personalizationForm;
    
    // Công thức Harris-Benedict cải tiến
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * personalizationForm.height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * personalizationForm.height) - (4.330 * age);
    }

    // Hệ số hoạt động
    const activityMultipliers = {
      sedentary: 1.2,    // Ít vận động
      light: 1.375,      // Vận động nhẹ
      moderate: 1.55,    // Vận động vừa
      active: 1.725,     // Vận động nhiều
      very_active: 1.9   // Vận động rất nhiều
    };

    return Math.round(bmr * activityMultipliers[exerciseLevel]);
  }, [personalizationForm]);

  // Thuật toán gợi ý món ăn theo thời gian
  const getSuggestedMealsByTime = useMemo(() => {
    const currentHour = new Date().getHours();
    const personalizedDishes = getPersonalizedDishes;

    if (currentHour >= 6 && currentHour < 11) {
      // Sáng: Ưu tiên món nhẹ, ít calories
      return personalizedDishes.filter(dish => 
        dish.category === 'breakfast' || dish.calories < 250
      ).slice(0, 5);
    } else if (currentHour >= 11 && currentHour < 14) {
      // Trưa: Món chính, calories trung bình
      return personalizedDishes.filter(dish => 
        dish.category === 'main' || (dish.calories >= 250 && dish.calories <= 500)
      ).slice(0, 8);
    } else if (currentHour >= 14 && currentHour < 17) {
      // Chiều: Đồ uống, món nhẹ
      return personalizedDishes.filter(dish => 
        dish.category === 'drink' || dish.category === 'snack'
      ).slice(0, 4);
    } else {
      // Tối: Món chính nhưng ít calories hơn
      return personalizedDishes.filter(dish => 
        dish.category === 'main' || dish.category === 'dinner'
      ).slice(0, 6);
    }
  }, [getPersonalizedDishes]);

  // Thuật toán tính điểm phù hợp cho từng món
  const calculateDishScore = (dish) => {
    let score = 0;
    
    // Điểm theo sở thích
    personalizationForm.preferences.forEach(pref => {
      if (dish[pref]) score += 20;
    });
    
    // Điểm theo mục tiêu
    if (personalizationForm.goal === 'lose' && dish.calories <= 300) score += 30;
    if (personalizationForm.goal === 'gain' && dish.calories >= 400) score += 30;
    if (personalizationForm.goal === 'maintain' && dish.calories >= 200 && dish.calories <= 350) score += 30;
    
    // Điểm theo giá trị dinh dưỡng
    if (dish.protein && dish.protein > 15) score += 10;
    if (dish.fiber && dish.fiber > 5) score += 10;
    if (dish.vitamins && dish.vitamins.length > 0) score += 5;
    
    return score;
  };

  // Sắp xếp món ăn theo điểm phù hợp
  const rankedDishes = useMemo(() => {
    return getPersonalizedDishes
      .map(dish => ({
        ...dish,
        score: calculateDishScore(dish)
      }))
      .sort((a, b) => b.score - a.score);
  }, [getPersonalizedDishes, personalizationForm]);

  return {
    personalizationForm,
    setPersonalizationForm,
    personalizedDishes: getPersonalizedDishes,
    estimatedCalories: calculateCaloriesByActivity,
    suggestedMeals: getSuggestedMealsByTime,
    rankedDishes,
    calculateDishScore
  };
}
