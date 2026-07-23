require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
  console.log("=== Testing Available Gemini Models ===");
  const candidateModels = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-1.5-flash-latest"
  ];

  for (const modelName of candidateModels) {
    try {
      console.log(`\nTesting ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const res = await model.generateContent("Hello!");
      console.log(`✅ SUCCESS with ${modelName}:`, res.response.text().trim());
      return modelName;
    } catch (err) {
      console.log(`❌ ERROR with ${modelName}:`, err.message.split("\n")[0]);
    }
  }
}

checkModels();
