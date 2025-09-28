// Mock data for Manager page
export const mockAccounts = [
  {
    id: 1,
    name: "John Doe",
    email: "john@restaurant.com",
    role: "admin",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@restaurant.com",
    role: "manager",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@restaurant.com",
    role: "chef",
    status: "active",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@restaurant.com",
    role: "staff",
    status: "inactive",
  },
];

export const mockDishes = [
  {
    id: 1,
    name: "Pizza Margherita",
    price: 15.99,
    category: "pizza",
    status: "available",
  },
  {
    id: 2,
    name: "Pasta Carbonara",
    price: 12.99,
    category: "pasta",
    status: "available",
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 8.99,
    category: "salad",
    status: "available",
  },
  {
    id: 4,
    name: "Grilled Salmon",
    price: 18.99,
    category: "main",
    status: "unavailable",
  },
];

export const mockTables = [
  {
    id: 1,
    number: 1,
    status: "occupied",
    currentOrder: {
      id: "ORD-001",
      items: [
        {
          name: "Pizza Margherita",
          price: 15.99,
          quantity: 1,
          status: "pending",
          notes: "Extra cheese",
        },
        {
          name: "Caesar Salad",
          price: 8.99,
          quantity: 2,
          status: "preparing",
          notes: "",
        },
      ],
      total: 33.97,
    },
    orderHistory: [
      {
        id: "ORD-001",
        date: "2024-01-15",
        total: 25.98,
        items: 2,
        status: "completed",
      },
    ],
  },
  {
    id: 2,
    number: 2,
    status: "empty",
    currentOrder: null,
    orderHistory: [
      {
        id: "ORD-002",
        date: "2024-01-14",
        total: 18.99,
        items: 1,
        status: "completed",
      },
    ],
  },
  {
    id: 3,
    number: 3,
    status: "occupied",
    currentOrder: {
      id: "ORD-003",
      items: [
        {
          name: "Pasta Carbonara",
          price: 12.99,
          quantity: 1,
          status: "ready",
          notes: "No onions",
        },
      ],
      total: 12.99,
    },
    orderHistory: [],
  },
  {
    id: 4,
    number: 4,
    status: "empty",
    currentOrder: null,
    orderHistory: [],
  },
];

export const mockRevenueData = [
  { hour: "9:00", revenue: 120 },
  { hour: "10:00", revenue: 150 },
  { hour: "11:00", revenue: 200 },
  { hour: "12:00", revenue: 350 },
  { hour: "13:00", revenue: 400 },
  { hour: "14:00", revenue: 180 },
  { hour: "15:00", revenue: 160 },
  { hour: "16:00", revenue: 140 },
  { hour: "17:00", revenue: 220 },
  { hour: "18:00", revenue: 380 },
  { hour: "19:00", revenue: 450 },
  { hour: "20:00", revenue: 320 },
];

export const mockPopularDishes = [
  { name: "Pizza Margherita", value: 35 },
  { name: "Pasta Carbonara", value: 28 },
  { name: "Caesar Salad", value: 22 },
  { name: "Grilled Salmon", value: 15 },
];
