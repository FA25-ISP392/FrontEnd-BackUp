// Test mock server
async function testMockServer() {
  console.log("🧪 Testing mock server...\n");
  
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "admin123"
      }),
    });
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`📄 Response:`, data);
    } else {
      const text = await response.text();
      console.log(`❌ Error Response:`, text);
    }
    
  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
    console.log("💡 Hãy chạy: node mock-server.js trong terminal khác");
  }
}

testMockServer();

