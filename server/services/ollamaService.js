const axios = require("axios");

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

async function analyzeResume(resumeText) {
  const prompt = `
You are an expert recruiter.
Analyze the following resume.
Return ONLY a valid JSON object with ALL of these fields:
{
  "skills": ["top technical skills"],
  "strengths": ["top strengths"],
  "weaknesses": ["weaknesses"],
  "missingSkills": ["missing skills"],
  "recommendations": ["recommendations"]
}

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
      { timeout: 10000 } // 10 second timeout
    );

    const text = response.data.response;
    console.log("OLLAMA RESPONSE:", text);

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    let cleaned = jsonEnd === -1 ? text.substring(jsonStart).trim() + "}" : text.substring(jsonStart, jsonEnd + 1).trim();

    const analysis = JSON.parse(cleaned);

    return {
      skills: (analysis.skills || []).slice(0, 8),
      strengths: analysis.strengths || ["Problem Solving", "Technical Foundation", "Practical Development"],
      weaknesses: analysis.weaknesses || ["System Design", "Cloud Architecture"],
      missingSkills: analysis.missingSkills || ["Docker", "Kubernetes", "AWS"],
      recommendations: analysis.recommendations || ["Build scalable full-stack projects", "Deep dive into System Design"]
    };
  } catch (error) {
    console.log("OLLAMA ANALYSIS NOTE:", error.message || "Ollama server offline. Using direct PDF keyword extraction.");

    const extractedSkills = extractKeywordsFromText(resumeText);
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
}

async function evaluateAnswer(question, answer) {
  const prompt = `
You are an expert technical interviewer evaluating a candidate's response.
Question: ${question}
Candidate Answer: ${answer}

Return ONLY a valid JSON object:
{
  "score": 85,
  "feedback": [
    "Constructive feedback point 1",
    "Constructive feedback point 2"
  ]
}
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
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const cleaned = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(cleaned);
    }
    return {
      score: 82,
      feedback: ["Demonstrated solid core understanding.", "Elaborate on edge cases and scalability."]
    };
  } catch (error) {
    console.log("OLLAMA EVALUATE NOTE:", error.message || "Ollama offline. Providing automated heuristic scoring.");
    
    const wordCount = answer.trim().split(/\s+/).length;
    const score = Math.min(92, Math.max(60, 65 + Math.floor(wordCount * 0.8)));

    return {
      score,
      feedback: [
        `Received response containing ${wordCount} words.`,
        "Clearly structure your answer using the STAR method (Situation, Task, Action, Result).",
        "Mention performance trade-offs and real-world metrics to strengthen your answer."
      ]
    };
  }
}

module.exports = {
  analyzeResume,
  evaluateAnswer
};