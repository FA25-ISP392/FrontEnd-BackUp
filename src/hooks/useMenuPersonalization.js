import { useState, useMemo } from "react";
import { useBMRCalculator } from "./useBMRCalculator";

export function useMenuPersonalization(allDishes = []) {
  const [personalizationForm, setPersonalizationForm] = useState({
    height: 170,
    weight: 70,
    gender: "male",
    age: 25,
    mealsPerDay: 3,
    exerciseLevel: "moderate",
    goal: "",
  });

  const getPersonalizedDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      if (personalizationForm.goal === "lose" && dish.calories > 300)
        return false;
      if (personalizationForm.goal === "gain" && dish.calories < 200)
        return false;
      if (
        personalizationForm.goal === "maintain" &&
        (dish.calories < 150 || dish.calories > 400)
      )
        return false;

      return dish.available;
    });
  }, [allDishes, personalizationForm]);

  const { dailyCalories, bmr, mealCalories, calorieAssessment } =
    useBMRCalculator(
      personalizationForm.height,
      personalizationForm.weight,
      personalizationForm.age,
      personalizationForm.gender,
      personalizationForm.exerciseLevel
    );

  const getSuggestedMealsByTime = useMemo(() => {
    const currentHour = new Date().getHours();
    const personalizedDishes = getPersonalizedDishes;

    if (currentHour >= 6 && currentHour < 11) {
      return personalizedDishes
        .filter((dish) => dish.category === "breakfast" || dish.calories < 250)
        .slice(0, 5);
    } else if (currentHour >= 11 && currentHour < 14) {
      return personalizedDishes
        .filter(
          (dish) =>
            dish.category === "main" ||
            (dish.calories >= 250 && dish.calories <= 500)
        )
        .slice(0, 8);
    } else if (currentHour >= 14 && currentHour < 17) {
      return personalizedDishes
        .filter(
          (dish) => dish.category === "drink" || dish.category === "snack"
        )
        .slice(0, 4);
    } else {
      return personalizedDishes
        .filter(
          (dish) => dish.category === "main" || dish.category === "dinner"
        )
        .slice(0, 6);
    }
  }, [getPersonalizedDishes]);

  const calculateDishScore = (dish) => {
    let score = 0;

    const targetCaloriesPerMeal = mealCalories;
    const calorieDiff = Math.abs(dish.calories - targetCaloriesPerMeal);

    if (personalizationForm.goal === "lose") {
      if (dish.calories <= targetCaloriesPerMeal * 0.8) score += 30;
      else if (dish.calories <= targetCaloriesPerMeal) score += 20;
      else score -= 10;
    } else if (personalizationForm.goal === "gain") {
      if (dish.calories >= targetCaloriesPerMeal * 1.2) score += 30;
      else if (dish.calories >= targetCaloriesPerMeal) score += 20;
      else score -= 5;
    } else if (personalizationForm.goal === "maintain") {
      if (calorieDiff <= targetCaloriesPerMeal * 0.2) score += 30;
      else if (calorieDiff <= targetCaloriesPerMeal * 0.4) score += 20;
      else score += 10;
    }

    if (dish.protein && dish.protein > 15) score += 10;
    if (dish.fiber && dish.fiber > 5) score += 10;
    if (dish.vitamins && dish.vitamins.length > 0) score += 5;

    return score;
  };

  const rankedDishes = useMemo(() => {
    return getPersonalizedDishes
      .map((dish) => ({
        ...dish,
        score: calculateDishScore(dish),
      }))
      .sort((a, b) => b.score - a.score);
  }, [getPersonalizedDishes, personalizationForm]);

  return {
    personalizationForm,
    setPersonalizationForm,
    personalizedDishes: getPersonalizedDishes,
    dailyCalories,
    bmr,
    mealCalories,
    calorieAssessment,
    estimatedCalories: dailyCalories,
    suggestedMeals: getSuggestedMealsByTime,
    rankedDishes,
    calculateDishScore,
  };
}
