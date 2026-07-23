const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "prepai_super_secret_jwt_key_2026"
      );
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error("Auth Token Error:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  req.user = null;
  next();
};

module.exports = { protect };
