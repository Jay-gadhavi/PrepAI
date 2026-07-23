require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.GROQ_API_KEY;

if (apiKey && apiKey !== "your_groq_api_key_here") {
  console.log("✅ Groq AI Service initialized (14,400 free requests/day).");
} else {
  console.warn("⚠️  GROQ_API_KEY not set in server/.env — local fallback will be used.");
}

/**
 * Call Groq API with automatic JSON output enforcement
 */
async function callGroqAPI(prompt, systemInstruction = "You are an expert AI interview assistant.") {
  const currentKey = process.env.GROQ_API_KEY;
  if (!currentKey || currentKey === "your_groq_api_key_here") {
    return null;
  }

  // Primary model: llama-3.3-70b-versatile, Fallback: llama3-8b-8192
  const models = ["llama-3.3-70b-versatile", "llama3-8b-8192"];

  for (const model of models) {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2
        },
        {
          headers: {
            Authorization: `Bearer ${currentKey}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content) {
        return content.trim();
      }
    } catch (err) {
      console.warn(`⚠️ Groq API model ${model} note:`, err.response?.data?.error?.message || err.message);
    }
  }

  return null;
}

/**
 * Fallback tech keyword extractor
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
 * Analyze resume text with Groq AI
 */
async function analyzeResume(resumeText) {
  const truncatedText = (resumeText || "").slice(0, 3000);

  const prompt = `
You are a senior technical recruiter and HR specialist.
Analyze the candidate's resume below carefully. Extract their ACTUAL technical skills, strengths, missing skills, and tailored recommendations based strictly on their resume content.

Return ONLY a valid JSON object matching this EXACT schema:
{
  "skills": [
    {"name": "Skill Name 1", "score": 85},
    {"name": "Skill Name 2", "score": 70}
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "missingSkills": ["Missing Skill 1", "Missing Skill 2", "Missing Skill 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}

Resume Text:
${truncatedText}
`;

  const jsonString = await callGroqAPI(prompt, "You are an expert technical recruiter analyzing a resume. Output strictly valid JSON.");
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      return {
        skills: Array.isArray(parsed.skills) ? parsed.skills.slice(0, 8) : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
      };
    } catch (e) {
      console.warn("⚠️ Groq JSON parse note on analyzeResume:", e.message);
    }
  }

  // Fallback if key missing or request error
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
 * Generate 5 technical + 3 HR questions with Groq AI
 */
async function generateQuestions(resumeText) {
  const truncatedText = (resumeText || "").slice(0, 2500);

  const prompt = `
Based on this resume, generate 5 technical interview questions and 3 HR behavioral questions tailored to candidate's skills.
Return ONLY a valid JSON object with a single key "questions" containing an array of strings:
{
  "questions": [
    "Question 1?",
    "Question 2?"
  ]
}

Resume Text:
${truncatedText}
`;

  const jsonString = await callGroqAPI(prompt, "You are a senior technical interviewer. Output raw JSON only.");
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
    } catch (e) {
      console.warn("⚠️ Groq JSON parse note on generateQuestions");
    }
  }

  // Fallback questions
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
 * Evaluate Candidate Answer with Groq AI
 */
async function evaluateAnswer(question, answer) {
  const trimmed = (answer || "").trim();

  // Instant rejection for empty or ultra-short/gibberish answers
  if (!trimmed || trimmed.length < 5) {
    return {
      score: 15,
      verdict: "Unsatisfactory",
      isRelevant: false,
      feedback: [
        "Answer is too brief or incomplete to evaluate.",
        "Please provide a detailed response addressing the question directly.",
        "Use the STAR method (Situation, Task, Action, Result) for structured answers."
      ]
    };
  }

  const prompt = `
You are a strict, experienced technical interviewer conducting an actual job interview.
Evaluate the candidate's answer to the question below.

Question: "${question}"
Candidate Answer: "${trimmed}"

CRITICAL EVALUATION INSTRUCTIONS:
1. First, check if the candidate's answer is relevant to the question.
2. If the answer is off-topic, random text/gibberish, "I don't know", or completely misses the question:
   - Set "score" between 0 and 35.
   - Set "verdict" to "Unsatisfactory".
   - Set "isRelevant" to false.
   - Give 2-3 specific feedback points explaining why the response failed to answer the question.
3. If the answer is partially relevant or missing key technical depth:
   - Set "score" between 40 and 68.
   - Set "verdict" to "Needs Improvement".
   - Set "isRelevant" to true.
   - Give 2-3 specific technical suggestions on what concepts should be added.
4. If the answer is accurate, well-structured, and directly answers the prompt:
   - Set "score" between 75 and 95.
   - Set "verdict" to "Excellent" or "Good".
   - Set "isRelevant" to true.
   - Give 2-3 positive & constructive feedback points highlighting strengths and minor enhancements.

Return ONLY a valid JSON object matching this schema:
{
  "score": number,
  "verdict": "Unsatisfactory" | "Needs Improvement" | "Good" | "Excellent",
  "isRelevant": boolean,
  "feedback": [
    "Feedback point 1",
    "Feedback point 2",
    "Feedback point 3"
  ]
}
`;

  const jsonString = await callGroqAPI(prompt, "You are a strict technical interviewer. Output raw valid JSON only.");
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      return {
        score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 70,
        verdict: parsed.verdict || (parsed.score >= 75 ? "Good" : parsed.score >= 50 ? "Needs Improvement" : "Unsatisfactory"),
        isRelevant: typeof parsed.isRelevant === "boolean" ? parsed.isRelevant : true,
        feedback: Array.isArray(parsed.feedback) && parsed.feedback.length > 0
          ? parsed.feedback
          : ["Answer processed.", "Focus on explaining core architecture and trade-offs."]
      };
    } catch (e) {
      console.warn("⚠️ Groq JSON parse note on evaluateAnswer:", e.message);
    }
  }

  // Fallback scoring logic
  const wordCount = trimmed.split(/\s+/).length;
  const isTooShort = wordCount < 8;
  const fallbackScore = isTooShort ? 30 : Math.min(88, Math.max(45, 55 + Math.floor(wordCount * 0.7)));

  return {
    score: fallbackScore,
    verdict: fallbackScore < 45 ? "Unsatisfactory" : fallbackScore < 75 ? "Needs Improvement" : "Good",
    isRelevant: !isTooShort,
    feedback: [
      `Response length: ${wordCount} words.`,
      isTooShort ? "Your response is very short. Elaborate with technical examples." : "Structure your answer using the STAR method.",
      "Highlight trade-offs and performance implications."
    ]
  };
}

module.exports = {
  analyzeResume,
  generateQuestions,
  evaluateAnswer
};
