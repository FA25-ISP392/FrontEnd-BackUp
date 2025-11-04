import { useState } from "react";
import ManagerDailyApprovedDishes from "./ManagerDailyApprovedDishes";
import ManagerDailyApprovedToppings from "./ManagerDailyApprovedToppings";

export default function ManagerDailyMenuPage() {
  const [activeTab, setActiveTab] = useState("dish"); // dish | topping

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">
        Món Trong Ngày (Đã Duyệt)
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("dish")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "dish"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
              : "bg-black/20 text-neutral-300 hover:bg-black/30 hover:text-white"
          }`}
        >
          Món ăn
        </button>
        <button
          onClick={() => setActiveTab("topping")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "topping"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
              : "bg-black/20 text-neutral-300 hover:bg-black/30 hover:text-white"
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
