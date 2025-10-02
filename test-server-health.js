// Script để test server health
const baseUrl = "https://isp392-production.up.railway.app";

async function testServerHealth() {
  console.log("🏥 Testing server health...\n");
  
  // Test root endpoint
  try {
    console.log(`🧪 Testing root: ${baseUrl}`);
    const response = await fetch(baseUrl);
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const text = await response.text();
      console.log(`📄 Response: ${text.substring(0, 500)}...`);
    }
  } catch (error) {
    console.log(`❌ Root Error: ${error.message}`);
  }
  
  // Test common health endpoints
  const healthEndpoints = [
    "/",
    "/health", 
    "/actuator/health",
    "/api/health",
    "/isp392/health",
    "/status"
  ];
  
  for (const endpoint of healthEndpoints) {
    try {
      const url = baseUrl + endpoint;
      console.log(`\n🧪 Testing: ${url}`);
      const response = await fetch(url);
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`📄 Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

testServerHealth();
