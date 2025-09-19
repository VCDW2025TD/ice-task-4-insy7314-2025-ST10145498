// backend/src/controllers/authController.js
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adapt if your model path differs

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || "dev_jwt_secret", { expiresIn: "1h" });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const user = await User.create({ email: email.toLowerCase(), password }); // assume pre-save bcrypt
    const token = generateToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
