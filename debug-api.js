// Debug API configuration
import { API_CONFIG } from './src/lib/apiLogin.js';

console.log('=== API CONFIG DEBUG ===');
console.log('USE_PROXY:', API_CONFIG.USE_PROXY);
console.log('BASE_URL:', API_CONFIG.BASE_URL);
console.log('ENDPOINTS:', API_CONFIG.ENDPOINTS);

// Test URL generation
const loginEndpoint = API_CONFIG.ENDPOINTS.LOGIN;
console.log('\n=== URL GENERATION ===');
console.log('Login endpoint:', loginEndpoint);

const finalUrl = API_CONFIG.USE_PROXY ? 
  loginEndpoint : 
  API_CONFIG.BASE_URL + loginEndpoint;
  
console.log('Final URL:', finalUrl);

// Test actual fetch
console.log('\n=== TESTING FETCH ===');
try {
  const response = await fetch(finalUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    mode: "cors",
    credentials: "omit",
    body: JSON.stringify({
      username: "test",
      password: "test"
    }),
  });
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const text = await response.text();
    console.log('Error response:', text.substring(0, 200));
  }
  
} catch (error) {
  console.log('Fetch error:', error.message);
}
