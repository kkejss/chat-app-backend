const cors = require("cors");
const morgan = require("morgan");
const { StatusCodes } = require("http-status-codes");
const authRouter = require("../auth/auth.router.js");
const usersRouter = require("../users/users.router.js");
const messagesRouter = require("../messages/messages.router.js");
const conversationsRouter = require("../conversations/conversations.router.js");

// Lista e origjinave te lejuara - mund te vendosen ne .env si CLIENT_URL
function isAllowedOrigin(origin) {
  if (!origin) return true;

  const allowed = process.env.CLIENT_URL || "http://localhost:5173";

  // Lejo origin-in e sakte nga .env
  if (origin === allowed) return true;

  // Lejo cdo deployment te Vercel automatikisht (preview + production)
  if (origin.endsWith(".vercel.app")) return true;

  // Lejo localhost per zhvillim lokal
  if (origin.startsWith("http://localhost")) return true;

  return false;
}

function configureApp(app) {
  app.use(cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }));

  app.use(morgan("dev"));

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/conversations", conversationsRouter);

  app.get("/", (_req, res) => res.json({ status: "Lumiere API" }));
  app.use((_req, res) => res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" }));
}

module.exports = configureApp;