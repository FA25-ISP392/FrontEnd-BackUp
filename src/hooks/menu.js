import { useState } from 'react';

// Hook để quản lý menu state
export function useMenuState() {
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCallStaffOpen, setIsCallStaffOpen] = useState(false);
  const [isDishOptionsOpen, setIsDishOptionsOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const closeAllModals = () => {
    setIsPersonalizationOpen(false);
    setIsCartOpen(false);
    setIsPaymentOpen(false);
    setIsCallStaffOpen(false);
    setIsDishOptionsOpen(false);
  };

  return {
    isPersonalizationOpen,
    setIsPersonalizationOpen,
    isCartOpen,
    setIsCartOpen,
    isPaymentOpen,
    setIsPaymentOpen,
    isCallStaffOpen,
    setIsCallStaffOpen,
    isDishOptionsOpen,
    setIsDishOptionsOpen,
    activeMenuTab,
    setActiveMenuTab,
    selectedDish,
    setSelectedDish,
    paymentMethod,
    setPaymentMethod,
    closeAllModals
  };
}

// Hook để quản lý menu personalization
export function useMenuPersonalization() {
  const [personalizedMenu, setPersonalizedMenu] = useState([]);
  const [estimatedCalories, setEstimatedCalories] = useState(2000);
  const [personalizationForm, setPersonalizationForm] = useState({
    height: 170,
    weight: 70,
    gender: 'male',
    age: 25,
    exerciseLevel: 'moderate',
    preferences: [],
    goal: '',
  });

  const getPersonalizedDishes = (allDishes, form) => {
    return allDishes.filter((dish) => {
      // Filter based on preferences
      if (form.preferences.includes('spicy') && !dish.spicy) return false;
      if (form.preferences.includes('fatty') && !dish.fatty) return false;
      if (form.preferences.includes('sweet') && !dish.sweet) return false;

      // Filter based on goal
      if (form.goal === 'lose' && dish.calories > 300) return false;
      if (form.goal === 'gain' && dish.calories < 200) return false;

      return dish.available;
    });
  };

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateEstimatedCalories = (form) => {
    const bmi = form.weight / Math.pow(form.height / 100, 2);
    if (bmi < 18.5) return 2200; // Underweight - need more calories
    if (bmi < 25) return 2000; // Normal weight
    if (bmi < 30) return 1800; // Overweight - need fewer calories
    return 1600; // Obese - need significantly fewer calories
  };

  const handlePersonalizationSubmit = (form, allDishes) => {
    const personalized = getPersonalizedDishes(allDishes, form);
    setPersonalizedMenu(personalized);
    
    // Update estimated calories based on BMI
    const newEstimatedCalories = calculateEstimatedCalories(form);
    setEstimatedCalories(newEstimatedCalories);
    
    setPersonalizationForm(form);
  };

  const handleGoalChange = (goalId, checked, allDishes) => {
    if (checked) {
      const filtered = personalizedMenu.filter((dish) => {
        if (goalId === 'lose' && dish.calories > 300) return false;
        if (goalId === 'gain' && dish.calories < 200) return false;
        return true;
      });
      setPersonalizedMenu(filtered);
    } else {
      setPersonalizedMenu(getPersonalizedDishes(allDishes, personalizationForm));
    }
  };

  return {
    personalizedMenu,
    setPersonalizedMenu,
    estimatedCalories,
    setEstimatedCalories,
    personalizationForm,
    setPersonalizationForm,
    getPersonalizedDishes,
    calculateBMI,
    calculateEstimatedCalories,
    handlePersonalizationSubmit,
    handleGoalChange
  };
}

// Hook để quản lý menu dishes
export function useMenuDishes(mockDishes = []) {
  // Sync with Manager visibility: hide dishes listed in localStorage hidden_dishes
  const getHiddenNames = () => {
    try {
      return JSON.parse(localStorage.getItem('hidden_dishes')) || [];
    } catch (_) {
      return [];
    }
  };

  const getFilteredDishes = () => {
    const hiddenNames = getHiddenNames();
    return mockDishes.filter(
      (dish) => dish.available && !hiddenNames.includes(dish.name),
    );
  };

  const getDishById = (dishId) => {
    return mockDishes.find(dish => dish.id === dishId);
  };

  const getDishsByCategory = (category) => {
    const filteredDishes = getFilteredDishes();
    if (category === 'all') return filteredDishes;
    return filteredDishes.filter(dish => dish.category === category);
  };

  return {
    dishes: mockDishes,
    getFilteredDishes,
    getDishById,
    getDishsByCategory,
    getHiddenNames
  };
}

// Hook để quản lý menu actions
export function useMenuActions() {
  const handleOrderFood = (cart, closeCart) => {
    closeCart();
    // Here you would typically send the order to the kitchen
    console.log('Order sent to kitchen:', cart);
  };

  const handlePayment = (cart, paymentMethod, closePayment, openCallStaff) => {
    closePayment();
    openCallStaff();
    // Here you would typically process the payment
    console.log('Payment processed:', { cart, paymentMethod });
  };

  const handleCallStaff = (closeCallStaff, clearCart) => {
    // Clear cart after successful call
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  return {
    handleOrderFood,
    handlePayment,
    handleCallStaff
  };
}
