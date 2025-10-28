import { useState } from "react";
import ManagerDailyApprovedDishes from "./ManagerDailyApprovedDishes";
import ManagerDailyApprovedToppings from "./ManagerDailyApprovedToppings";

export default function ManagerDailyMenuPage() {
  const [activeTab, setActiveTab] = useState("dish"); // dish | topping

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Món Trong Ngày (Đã Duyệt)
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("dish")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "dish"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
              : "bg-white/80 text-neutral-600 hover:bg-white hover:text-neutral-900"
          }`}
        >
          Món ăn
        </button>
        <button
          onClick={() => setActiveTab("topping")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "topping"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
              : "bg-white/80 text-neutral-600 hover:bg-white hover:text-neutral-900"
          }`}
        >
          Topping
        </button>
      </div>

      {/* Nội dung tab */}
      {activeTab === "dish" ? (
        <ManagerDailyApprovedDishes />
      ) : (
        <ManagerDailyApprovedToppings />
      )}
    </div>
  );
}
