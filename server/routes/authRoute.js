const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const InterviewSession = require("../models/InterviewSession");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "prepai_super_secret_jwt_key_2026", {
    expiresIn: "30d"
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user candidate
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please enter name, email, and password." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "candidate"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile and session history
router.get("/me", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const analyses = await ResumeAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user: req.user,
      analyses,
      sessions
    });
  } catch (error) {
    console.error("Me Route Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching user profile." });
  }
});

module.exports = router;
