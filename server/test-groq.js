require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.GROQ_API_KEY;
console.log("=== Groq AI Integration Test ===");
console.log("API Key loaded:", apiKey ? `Yes (${apiKey.slice(0, 6)}...${apiKey.slice(-4)})` : "❌ NOT SET in .env");

if (!apiKey || apiKey === "gsk_your_groq_api_key_here") {
  console.log("\n👉 Step to complete:");
  console.log("1. Go to https://console.groq.com/keys (free, 0 credit card)");
  console.log("2. Click 'Create API Key' & copy the key starting with 'gsk_...'");
  console.log("3. Add GROQ_API_KEY=gsk_... in server/.env");
  process.exit(0);
}

async function testGroq() {
  try {
    console.log("\n🔄 Calling Groq API (llama-3.3-70b-versatile)...");
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an AI assistant." },
          { role: "user", content: "Say 'Hello from Groq AI' in 5 words." }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;
    console.log("\n🎉 SUCCESS! Groq Response:", reply);
    console.log("⚡ You have 14,400 free requests/day active!");
  } catch (err) {
    console.error("❌ Groq API Error:", err.response?.data?.error?.message || err.message);
  }
}

testGroq();
