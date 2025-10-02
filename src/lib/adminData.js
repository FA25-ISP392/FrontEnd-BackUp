// Mock data for Admin page
export const mockAdminAccounts = [
  {
    id: 1,
    username: "admin",
    role: "admin",
    email: "admin@restaurant.com",
    status: "active",
    created: "2024-01-01",
  },
  {
    id: 2,
    username: "manager1",
    role: "manager",
    email: "manager1@restaurant.com",
    status: "active",
    created: "2024-01-02",
  },
  {
    id: 3,
    username: "staff1",
    role: "staff",
    email: "staff1@restaurant.com",
    status: "active",
    created: "2024-01-03",
  },
  {
    id: 4,
    username: "chef1",
    role: "chef",
    email: "chef1@restaurant.com",
    status: "active",
    created: "2024-01-04",
  },
];

export const mockAdminDishes = [
  {
    id: 1,
    name: "Pizza Margherita",
    price: 18.99,
    category: "Pizza",
    status: "available",
    calories: 280,
  },
  {
    id: 2,
    name: "Pasta Carbonara",
    price: 16.99,
    category: "Pasta",
    status: "available",
    calories: 320,
  },
  {
    id: 3,
    name: "Grilled Salmon",
    price: 24.99,
    category: "Main Course",
    status: "available",
    calories: 250,
  },
  {
    id: 4,
    name: "Caesar Salad",
    price: 12.99,
    category: "Salad",
    status: "unavailable",
    calories: 180,
  },
];

export const mockAdminInvoices = [
  {
    id: 1,
    table: 1,
    amount: 89.5,
    time: "14:30",
    date: "2024-01-15",
    paymentMethod: "Cash",
    status: "paid",
  },
  {
    id: 2,
    table: 3,
    amount: 45.2,
    time: "15:00",
    date: "2024-01-15",
    paymentMethod: "Card",
    status: "paid",
  },
  {
    id: 3,
    table: 5,
    amount: 67.8,
    time: "14:45",
    date: "2024-01-15",
    paymentMethod: "Cash",
    status: "paid",
  },
  {
    id: 4,
    table: 7,
    amount: 125.4,
    time: "15:15",
    date: "2024-01-15",
    paymentMethod: "Card",
    status: "pending",
  },
];

export const mockAdminRevenueData = [
  { time: "08:00", revenue: 120 },
  { time: "10:00", revenue: 180 },
  { time: "12:00", revenue: 320 },
  { time: "14:00", revenue: 280 },
  { time: "16:00", revenue: 200 },
  { time: "18:00", revenue: 450 },
  { time: "20:00", revenue: 380 },
  { time: "22:00", revenue: 150 },
];

export const mockAdminDishSalesData = [
  { name: "Pizza Margherita", sales: 45, color: "#f97316" },
  { name: "Pasta Carbonara", sales: 32, color: "#dc2626" },
  { name: "Grilled Salmon", sales: 28, color: "#10b981" },
  { name: "Caesar Salad", sales: 20, color: "#3b82f6" },
  { name: "Tiramisu", sales: 15, color: "#8b5cf6" },
];
