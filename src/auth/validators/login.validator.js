const { body } = require("express-validator");

// Validon fushat e kerkuara per login para se te arrije kontrolleri
const loginValidator = [
  body("username").trim().notEmpty().withMessage("Username is required").toLowerCase(),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = loginValidator;