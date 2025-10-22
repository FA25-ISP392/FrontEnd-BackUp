// src/lib/menuData.js
// 🧭 Dữ liệu danh mục món ăn đồng bộ với enum Category trong backend

export const categories = [
  { id: "PIZZA", name: "Pizza" },
  { id: "PASTA", name: "Pasta" },
  { id: "MAIN_DISH", name: "Món chính" },
  { id: "SALAD", name: "Salad" },
  { id: "DESSERT", name: "Tráng miệng" },
];

// 🧩 Các lựa chọn khẩu vị của người dùng (giữ lại vì form cá nhân hóa dùng)
export const preferences = [
  { id: "spicy", name: "Cay", description: "Thích đồ cay" },
  { id: "fatty", name: "Béo", description: "Thích đồ béo" },
  { id: "sweet", name: "Ngọt", description: "Thích đồ ngọt" },
  { id: "salty", name: "Mặn", description: "Thích đồ mặn" },
  { id: "sour", name: "Chua", description: "Thích đồ chua" },
];

// 🎯 Mục tiêu cá nhân hoá (giảm cân, giữ dáng, tăng cân)
export const goals = [
  { id: "lose", name: "Giảm cân", description: "Muốn giảm cân" },
  { id: "maintain", name: "Giữ dáng", description: "Muốn duy trì cân nặng" },
  { id: "gain", name: "Tăng cân", description: "Muốn tăng cân" },
];
