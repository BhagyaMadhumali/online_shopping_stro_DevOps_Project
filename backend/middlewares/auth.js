const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Make sure you set your secret in env: process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is invalid" });
  }
};
