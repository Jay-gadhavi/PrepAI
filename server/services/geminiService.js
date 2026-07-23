require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== "your_gemini_api_key_here") {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ Gemini AI SDK initialized.");
  } catch (err) {
    console.error("❌ Gemini AI initialization error:", err.message);
  }
} else {
  console.warn("⚠️  GEMINI_API_KEY not set in .env — AI features will use local fallback.");
}

/**
 * Helper to call Gemini with automatic model fallback on 429 quota errors
 */
async function callGeminiWithFallback(prompt) {
  if (!genAI) return null;

  // Active Gemini models
  const modelsToTry = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite"
  ];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      if (responseText) {
        return responseText;
      }
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} returned error: ${err.message?.slice(0, 120)}`);
      // Continue to next model if quota/rate-limited
    }
  }

  return null;
}

/**
 * Fallback tech keyword extractor for offline or API key missing scenarios
 */
function extractKeywordsFromText(text) {
  const commonTech = [
    "JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "SQL",
    "Python", "Java", "C++", "HTML", "CSS", "Tailwind", "Docker", "AWS", "Git",
    "REST API", "GraphQL", "Redux", "PostgreSQL", "System Design", "Algorithms"
  ];
  const found = commonTech.filter(tech =>
    new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i").test(text)
  );
  return found.length > 0 ? found : ["JavaScript", "React", "Node.js", "Problem Solving"];
}

/**
 * Analyze resume with Gemini AI (Token-Efficient Prompting)
 */
async function analyzeResume(resumeText) {
  const truncatedText = (resumeText || "").slice(0, 2200);

  if (genAI) {
    const prompt = `
You are a senior technical recruiter. Analyze this resume text and return ONLY a valid JSON object. Do not include markdown codeblocks, prefix, or suffix text.

JSON Schema:
{
  "skills": ["string (max 8)"],
  "strengths": ["string (3 key strengths)"],
  "weaknesses": ["string (2 key areas for growth)"],
  "missingSkills": ["string (3 recommended missing industry skills)"],
  "recommendations": ["string (3 actionable steps)"]
}

Resume Text:
${truncatedText}
`;

    const responseText = await callGeminiWithFallback(prompt);
    if (responseText) {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        try {
          const cleaned = responseText.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(cleaned);
          return {
            skills: (parsed.skills || []).slice(0, 8),
            strengths: parsed.strengths || ["Technical Skills", "Problem Solving", "Project Experience"],
            weaknesses: parsed.weaknesses || ["System Design", "Cloud Infrastructure"],
            missingSkills: parsed.missingSkills || ["Docker", "Kubernetes", "AWS"],
            recommendations: parsed.recommendations || ["Build scalable projects", "Practice system design"]
          };
        } catch (e) {
          console.warn("⚠️ JSON Parse Error on Gemini output");
        }
      }
    }
  }

  // Fallback if API key missing, quota exceeded across all models, or parse error
  const extractedSkills = extractKeywordsFromText(truncatedText);
  return {
    skills: extractedSkills,
    strengths: extractedSkills.slice(0, 3).concat(["Logical Reasoning", "Application Building"]),
    weaknesses: ["System Design Fundamentals", "Advanced Database Optimization"],
    missingSkills: ["Cloud Infrastructure (AWS/GCP)", "Containerization (Docker)", "CI/CD Pipelines"],
    recommendations: [
      "Practice system architecture trade-offs",
      "Implement end-to-end authentication and caching",
      "Add automated testing to major projects"
    ]
  };
}

/**
 * Generate Interview Questions with Gemini AI
 */
async function generateQuestions(resumeText) {
  const truncatedText = (resumeText || "").slice(0, 2000);

  if (genAI) {
    const prompt = `
You are a technical interviewer. Based on the resume provided, generate 5 technical and 3 HR interview questions tailored to candidate's skills.
Return ONLY a valid JSON array of strings. Do not include markdown text formatting or extra text.

Example format:
["Question 1?", "Question 2?", ...]

Resume Text:
${truncatedText}
`;

    const responseText = await callGeminiWithFallback(prompt);
    if (responseText) {
      const jsonStart = responseText.indexOf("[");
      const jsonEnd = responseText.lastIndexOf("]");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        try {
          const cleaned = responseText.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(cleaned);
        } catch (e) {
          console.warn("⚠️ JSON Parse Error on Gemini questions output");
        }
      }
    }
  }

  // Fallback dynamic questions
  const lowerText = truncatedText.toLowerCase();
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

/**
 * Evaluate Candidate Answer with Gemini AI
 */
async function evaluateAnswer(question, answer) {
  if (genAI) {
    const prompt = `
You are a technical interviewer evaluating an answer.
Question: "${question}"
Candidate Answer: "${answer}"

Return ONLY a valid JSON object:
{
  "score": number (0-100),
  "feedback": ["Constructive point 1", "Constructive point 2"]
}
`;

    const responseText = await callGeminiWithFallback(prompt);
    if (responseText) {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        try {
          const cleaned = responseText.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(cleaned);
        } catch (e) {
          console.warn("⚠️ JSON Parse Error on Gemini evaluation output");
        }
      }
    }
  }

  // Fallback heuristic scoring
  const wordCount = (answer || "").trim().split(/\s+/).length;
  const score = Math.min(95, Math.max(60, 65 + Math.floor(wordCount * 0.8)));

  return {
    score,
    feedback: [
      `Response contains ${wordCount} words.`,
      "Structure your response clearly using the STAR method (Situation, Task, Action, Result).",
      "Mention technical trade-offs and real-world metrics to further strengthen your answer."
    ]
  };
}

module.exports = {
  analyzeResume,
  generateQuestions,
  evaluateAnswer
};
