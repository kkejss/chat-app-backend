const { body } = require("express-validator");

// Validon te gjitha fushat per regjistrim para se te arrije kontrolleri
// Rregullat per username dhe password jane te rrepta per siguri
const signupValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required").isLength({ max: 100 }),
  body("lastName").optional().trim().isLength({ max: 100 }),
  body("username")
    .trim().notEmpty().withMessage("Username is required")
    .toLowerCase()
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters")
    // Lejon vetem shkronja, numra dhe nenviza
    .matches(/^[a-z0-9_]+$/).withMessage("Username can only contain letters, numbers and underscores"),
  body("phone").optional().trim(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character"),
];

module.exports = signupValidator;