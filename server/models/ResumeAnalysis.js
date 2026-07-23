const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    fileName: { type: String, default: "resume.pdf" },
    extractedText: { type: String, required: true },
    skills: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendations: [{ type: String }],
    readinessScore: { type: Number, default: 70 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
