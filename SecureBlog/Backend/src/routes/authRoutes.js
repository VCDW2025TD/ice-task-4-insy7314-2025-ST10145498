//routes/authRoutes
const express = require("express");
const rateLimit = require("express-rate-limit");
const { registerRules, loginRules } = require("../utils/validators");
const authController = require("../controllers/authController");

const router = express.Router();

// Brute-force limiter for login
const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });

router.post("/register", registerRules, authController.register);
router.post("/login", loginLimiter, loginRules, authController.login);

module.exports = router;
