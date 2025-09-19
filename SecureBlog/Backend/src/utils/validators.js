// backend/src/utils/validators.js
const { body } = require("express-validator");

// Password strength rule: min 8 chars, at least one letter and one number
const passwordStrength = body("password")
  .isString()
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[A-Za-z]/).withMessage("Password must include a letter")
  .matches(/\d/).withMessage("Password must include a number");

// Email field
const emailField = body("email")
  .isEmail().withMessage("Email must be a valid email address")
  .normalizeEmail();

const registerRules = [emailField, passwordStrength];
const loginRules = [
  emailField,
  body("password").isString().notEmpty().withMessage("Password is required"),
];

module.exports = { registerRules, loginRules };
