require("dotenv").config();
const { analyzeResume, evaluateAnswer, generateQuestions } = require("../services/groqService");
const cleanResumeText = require("../utils/resumeCleaner");
const validateResume = require("../utils/resumeValidator");
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const InterviewSession = require("../models/InterviewSession");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded."
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    let extractedText = "";

    try {
      const pdfData = await pdfParse(dataBuffer);
      extractedText = cleanResumeText(pdfData.text);
    } catch (error) {
      console.log("PDF PARSE ERROR:", error);
      return res.status(400).json({
        success: false,
        message: "Unable to parse PDF text. Please upload a standard PDF file."
      });
    }

    // Validate if the extracted text is actually a candidate resume
    const validation = validateResume(extractedText);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.reason
      });
    }

    console.log("\n==========================================");
    console.log(`📄 RESUME TEXT EXTRACTED & VALIDATED (${req.file.originalname}):`);
    console.log("------------------------------------------");
    console.log(extractedText ? extractedText.slice(0, 1000) + (extractedText.length > 1000 ? "\n...[truncated for log]" : "") : "[No text extracted]");
    console.log("==========================================\n");

    res.json({
      success: true,
      fileName: req.file.originalname,
      extractedText
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Upload processing failed."
    });
  }
});

const { protect } = require("../middleware/authMiddleware");

router.post("/analyze", async (req, res) => {
  try {
    const { resumeText, fileName } = req.body;
    const limitedResumeText = (resumeText || "").slice(0, 3000);

    console.log("⚡ Triggering Groq AI Resume Analysis...");
    const analysis = await analyzeResume(limitedResumeText);
    console.log("✅ Groq AI Analysis Result:", JSON.stringify(analysis, null, 2));

    // Save Analysis to MongoDB if DB is connected
    let savedRecord = null;
    try {
      savedRecord = await ResumeAnalysis.create({
        userId: req.user ? req.user._id : null,
        fileName: fileName || "resume.pdf",
        extractedText: limitedResumeText,
        skills: analysis.skills || [],
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        missingSkills: analysis.missingSkills || [],
        recommendations: analysis.recommendations || []
      });
    } catch (dbErr) {
      console.log("MongoDB Save Note:", dbErr.message);
    }

    res.json({
      success: true,
      analysis,
      analysisId: savedRecord ? savedRecord._id : null
    });
  } catch (error) {
    console.log("ANALYZE ERROR:", error);
    res.json({
      success: false,
      analysis: null,
      message: "Unable to analyze resume."
    });
  }
});

router.post("/evaluate", async (req, res) => {
  try {
    const { question, answer, analysisId } = req.body;

    console.log("⚡ Triggering Groq AI Answer Evaluation...");
    const evaluation = await evaluateAnswer(question, answer);
    console.log("✅ Groq Evaluation Result:", JSON.stringify(evaluation, null, 2));

    // Save Interview Session to MongoDB if DB is connected
    let savedSession = null;
    try {
      savedSession = await InterviewSession.create({
        userId: req.user ? req.user._id : null,
        analysisId: analysisId || null,
        question,
        answer,
        score: evaluation.score || 80,
        feedback: evaluation.feedback || []
      });
    } catch (dbErr) {
      console.log("MongoDB Session Save Note:", dbErr.message);
    }

    res.json({
      success: true,
      evaluation,
      sessionId: savedSession ? savedSession._id : null
    });
  } catch (error) {
    console.log("EVALUATE ERROR:", error);
    res.json({
      success: false,
      evaluation: {
        score: 75,
        feedback: ["Evaluation unavailable. Check server logs."]
      }
    });
  }
});

router.post("/questions", async (req, res) => {
  try {
    const { resumeText } = req.body;
    const questions = await generateQuestions(resumeText);

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.log("QUESTIONS ERROR:", error);
    res.json({
      success: false,
      questions: "Unable to generate questions."
    });
  }
});

// GET /api/history - Retrieve past resume analyses and interview sessions
router.get("/history", async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find().sort({ createdAt: -1 }).limit(10);
    const sessions = await InterviewSession.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      analyses,
      sessions
    });
  } catch (error) {
    console.log("HISTORY ERROR:", error);
    res.json({
      success: false,
      analyses: [],
      sessions: []
    });
  }
});

router.get("/test", (req, res) => {
  res.send("Backend API server and MongoDB routes operational.");
});

module.exports = router;