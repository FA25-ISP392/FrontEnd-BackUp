// ===== VÍ DỤ SỬ DỤNG API FUNCTIONS =====

import { createApiUrl, createCustomApiUrl, API_CONFIG } from './auth.js';

// ===== CÁCH SỬ DỤNG =====

// 1. Sử dụng endpoint có sẵn
const loginUrl = createApiUrl('LOGIN');
console.log('Login URL:', loginUrl);
// Output: https://isp392-production.up.railway.app/isp392/staff/auth/login

// Khi thêm endpoint mới, uncomment và sử dụng:
// const menuUrl = createApiUrl('MENU');
// const ordersUrl = createApiUrl('ORDERS');

// 2. Sử dụng custom endpoint
const customUrl = createCustomApiUrl('/isp392/new-feature/data');
console.log('Custom URL:', customUrl);
// Output: https://isp392-production.up.railway.app/isp392/new-feature/data

// 3. Truy cập trực tiếp config
console.log('Base URL:', API_CONFIG.BASE_URL);
console.log('All endpoints:', API_CONFIG.ENDPOINTS);

// ===== VÍ DỤ FETCH API =====

// Fetch menu data
export const fetchMenuData = async () => {
  try {
    const response = await fetch(createApiUrl('MENU'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};

// Fetch orders
export const fetchOrders = async () => {
  try {
    const response = await fetch(createApiUrl('ORDERS'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(createApiUrl('ORDERS'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
