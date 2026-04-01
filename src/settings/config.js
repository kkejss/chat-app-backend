const cors = require("cors");
const morgan = require("morgan");
const { StatusCodes } = require("http-status-codes");
const authRouter = require("../auth/auth.router.js");
const usersRouter = require("../users/users.router.js");
const messagesRouter = require("../messages/messages.router.js");
const conversationsRouter = require("../conversations/conversations.router.js");

// Konfiguron te gjitha middleware-t dhe routerat e aplikacionit
function configureApp(app) {
  // Lejon kerkesa nga frontend-i (CORS) me cookie mbeshtetje
  app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }));

  // Regjistron kerkesa HTTP ne terminal per debug
  app.use(morgan("dev"));

  // Lidh routerat kryesore te API-se
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/conversations", conversationsRouter);

  // Route kontrolli dhe rast kur route nuk gjendet
  app.get("/", (_req, res) => res.json({ status: "Lumiere API" }));
  app.use((_req, res) => res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" }));
}

module.exports = configureApp;