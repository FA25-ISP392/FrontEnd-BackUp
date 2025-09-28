import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

export default function DishOptionsModal({
  isOpen,
  onClose,
  dish,
  onAddToCart,
}) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!isOpen || !dish) return null;

  // Mock options for each dish
  const dishOptions = {
    "Caesar Salad": [
      { id: "size", name: "Kích thước", options: [
        { id: "small", name: "Nhỏ", price: 0, calories: 0 },
        { id: "medium", name: "Vừa", price: 2, calories: 50 },
        { id: "large", name: "Lớn", price: 4, calories: 100 }
      ]},
      { id: "dressing", name: "Nước sốt", options: [
        { id: "caesar", name: "Caesar", price: 0, calories: 0 },
        { id: "ranch", name: "Ranch", price: 1, calories: 30 },
        { id: "italian", name: "Italian", price: 1, calories: 25 }
      ]},
      { id: "extra", name: "Thêm", options: [
        { id: "chicken", name: "Gà nướng", price: 5, calories: 150 },
        { id: "bacon", name: "Thịt xông khói", price: 3, calories: 80 },
        { id: "cheese", name: "Phô mai", price: 2, calories: 60 }
      ]}
    ],
    "Grilled Chicken": [
      { id: "side", name: "Món phụ", options: [
        { id: "rice", name: "Cơm", price: 2, calories: 200 },
        { id: "fries", name: "Khoai tây chiên", price: 3, calories: 250 },
        { id: "salad", name: "Salad", price: 1, calories: 50 }
      ]},
      { id: "sauce", name: "Nước sốt", options: [
        { id: "bbq", name: "BBQ", price: 0, calories: 0 },
        { id: "teriyaki", name: "Teriyaki", price: 1, calories: 20 },
        { id: "lemon", name: "Chanh", price: 0, calories: 0 }
      ]}
    ],
    "Pizza Margherita": [
      { id: "size", name: "Kích thước", options: [
        { id: "small", name: "Nhỏ (8 inch)", price: 0, calories: 0 },
        { id: "medium", name: "Vừa (12 inch)", price: 5, calories: 200 },
        { id: "large", name: "Lớn (16 inch)", price: 10, calories: 400 }
      ]},
      { id: "toppings", name: "Topping thêm", options: [
        { id: "pepperoni", name: "Pepperoni", price: 3, calories: 100 },
        { id: "mushrooms", name: "Nấm", price: 2, calories: 30 },
        { id: "olives", name: "Ô liu", price: 2, calories: 40 }
      ]}
    ]
  };

  const currentOptions = dishOptions[dish.name] || [];

  const calculateTotalPrice = () => {
    let total = dish.price;
    Object.values(selectedOptions).forEach(option => {
      if (option) total += option.price;
    });
    return total * quantity;
  };

  const calculateTotalCalories = () => {
    let total = dish.calories;
    Object.values(selectedOptions).forEach(option => {
      if (option) total += option.calories;
    });
    return total * quantity;
  };

  const handleOptionChange = (optionGroupId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionGroupId]: option
    }));
  };

  const handleAddToCart = () => {
    const dishWithOptions = {
      ...dish,
      selectedOptions,
      quantity,
      notes,
      totalPrice: calculateTotalPrice(),
      totalCalories: calculateTotalCalories()
    };
    onAddToCart(dishWithOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{dish.name}</h2>
              <p className="text-orange-100">Tùy chỉnh món ăn của bạn</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Dish Info */}
          <div className="mb-6">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <p className="text-neutral-600 mb-4">{dish.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-600">
                ${dish.price}
              </span>
              <span className="text-sm text-neutral-500">
                {dish.calories} cal
              </span>
            </div>
          </div>

          {/* Options */}
          {currentOptions.map((optionGroup) => (
            <div key={optionGroup.id} className="mb-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                {optionGroup.name}
              </h3>
              <div className="space-y-2">
                {optionGroup.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={optionGroup.id}
                        checked={selectedOptions[optionGroup.id]?.id === option.id}
                        onChange={() => handleOptionChange(optionGroup.id, option)}
                        className="w-5 h-5 text-orange-500 border-neutral-300 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-medium text-neutral-900">
                          {option.name}
                        </div>
                        {option.price > 0 && (
                          <div className="text-sm text-neutral-600">
                            +${option.price} • +{option.calories} cal
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">
              Số lượng
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-bold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">
              Ghi chú đặc biệt
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Không cay, ít muối..."
              className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-neutral-900">
                  Tổng cộng
                </div>
                <div className="text-sm text-neutral-600">
                  {quantity} x {dish.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  ${calculateTotalPrice().toFixed(2)}
                </div>
                <div className="text-sm text-neutral-600">
                  {calculateTotalCalories()} cal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
