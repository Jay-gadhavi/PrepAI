const axios = require("axios");

async function generateQuestions(resumeText) {
  const prompt = `
You are an expert technical interviewer.
Based on this resume, generate 5 technical and 3 HR interview questions.
Return ONLY a valid JSON array of strings:
["Question 1", "Question 2", ...]

Resume:
${resumeText}
`;

  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        stream: false
      },
      { timeout: 8000 }
    );

    const text = response.data.response;
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    }
    return text.split("\n").filter(q => q.trim().length > 5);
  } catch (error) {
    console.log("OLLAMA QUESTION GEN NOTE:", error.message || "Ollama offline. Generating tailored questions directly from PDF text.");

    // Dynamic tailored questions derived from PDF content
    const lowerText = resumeText.toLowerCase();
    const questions = [];

    if (lowerText.includes("react")) {
      questions.push("Explain how React handles component re-rendering and how hooks like useMemo optimize state.");
    }
    if (lowerText.includes("node") || lowerText.includes("express")) {
      questions.push("How does the Node.js event loop handle asynchronous non-blocking I/O operations under high traffic?");
    }
    if (lowerText.includes("sql") || lowerText.includes("mongo") || lowerText.includes("database")) {
      questions.push("What indexing strategies would you use to optimize slow database queries in your projects?");
    }

    questions.push(
      "Walk me through the architecture of a major project listed on your resume and your specific technical contributions.",
      "Explain how you design RESTful APIs for security, error handling, and scalability.",
      "Describe a challenging bug you encountered in production and how you diagnosed its root cause.",
      "HR Question: Tell me about a time you worked under a tight deadline and had to prioritize features.",
      "HR Question: Where do you see your technical specialization evolving over the next 2 years?"
    );

    return questions;
  }
}

module.exports = {
  generateQuestions
};