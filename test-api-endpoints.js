// Script để test các API endpoints có thể có
const baseUrl = "https://isp392-production.up.railway.app";

const possibleEndpoints = [
  "/api/auth/login",
  "/isp392/auth/login", 
  "/isp392/staff/auth/login",
  "/isp392/staff/auth/token",
  "/auth/login",
  "/staff/auth/login",
  "/login",
  "/api/login",
  "/isp392/login"
];

async function testEndpoint(endpoint) {
  const url = baseUrl + endpoint;
  console.log(`\n🧪 Testing: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test",
        password: "test"
      }),
    });
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    
    if (response.status !== 404) {
      const text = await response.text();
      console.log(`📄 Response: ${text.substring(0, 200)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function testAllEndpoints() {
  console.log("🔍 Testing API endpoints...\n");
  
  for (const endpoint of possibleEndpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay 500ms
  }
  
  console.log("\n✨ Testing completed!");
}

testAllEndpoints();

