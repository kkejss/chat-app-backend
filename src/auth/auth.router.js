const { Router } = require("express");
const { handleSignup, handleLogin, handleMe } = require("./auth.controller.js");
const signupValidator = require("./validators/signup.validator.js");
const loginValidator  = require("./validators/login.validator.js");
const auth = require("../middleware/authenticateToken.middleware.js");

const authRouter = Router();

// Routat publike dhe private te autentifikimit
// POST /api/auth/signup  - regjistrim me validim
// POST /api/auth/login   - hyrje me validim
// GET  /api/auth/me      - merr perdoruesin aktual (kerkon token)
authRouter.post("/signup", signupValidator, handleSignup);
authRouter.post("/login",  loginValidator,  handleLogin);
authRouter.get("/me",      auth,            handleMe);

module.exports = authRouter;