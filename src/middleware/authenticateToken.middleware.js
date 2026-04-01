const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// Middleware: kontrollon JWT token-in ne header te kerkeses
// Perdoret para cdo route qe kerkon autentifikim
const authenticateToken = (req, res, next) => {
  // Merr token-in nga header "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not authorized" });

  // Verifikon token-in dhe vendos te dhenat e perdoruesit ne req.user
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Token is expired or invalid" });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;