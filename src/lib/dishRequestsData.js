// Mock data for dish requests shared between Chef and Manager
export const initialDishRequests = [
  {
    id: 1,
    dishId: 1,
    dishName: "Pizza Margherita",
    requestedQuantity: 15,
    chefName: "Chef User",
    date: "2024-01-15",
    status: "approved",
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 2,
    dishId: 2,
    dishName: "Pasta Carbonara",
    requestedQuantity: 20,
    chefName: "Chef User",
    date: "2024-01-15",
    status: "pending",
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 3,
    dishId: 4,
    dishName: "Grilled Salmon",
    requestedQuantity: 8,
    chefName: "Chef User",
    date: "2024-01-15",
    status: "rejected",
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
];

// Function to simulate shared state (in real app this would be handled by Redux/Context/API)
let dishRequests = [...initialDishRequests];

export const getDishRequests = () => dishRequests;
export const addDishRequest = (request) => {
  const newRequest = {
    ...request,
    id: Date.now(),
    createdAt: Date.now(),
    status: 'pending'
  };
  dishRequests.push(newRequest);
  return newRequest;
};
export const updateDishRequest = (id, updates) => {
  dishRequests = dishRequests.map(req => 
    req.id === id ? { ...req, ...updates } : req
  );
};
export const getPendingRequests = () => dishRequests.filter(r => r.status === 'pending');
export const getApprovedRequests = () => dishRequests.filter(r => r.status === 'approved');
export const getRejectedRequests = () => dishRequests.filter(r => r.status === 'rejected');

