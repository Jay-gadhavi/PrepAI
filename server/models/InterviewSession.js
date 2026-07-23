const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    analysisId: { type: mongoose.Schema.Types.ObjectId, ref: "ResumeAnalysis", default: null },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    score: { type: Number, required: true },
    feedback: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
