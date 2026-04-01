const jwt = require("jsonwebtoken");

// Gjeneron JWT token per perdoruesin me id dhe username
// Token skadon sipas JWT_EXPIRATION ne .env (default 7 dite)
function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || "7d" }
  );
}

module.exports = generateToken;
