const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const onlineUsers = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const allowed = process.env.CLIENT_URL || "http://localhost:5173";
  if (origin === allowed) return true;
  if (origin.endsWith(".vercel.app")) return true;
  if (origin.startsWith("http://localhost")) return true;
  return false;
}

// Inicializon Socket.io, autentikon JWT dhe menaxhon ngjarjet ne kohe reale
function configureSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      credentials: true,
    },
  });

  // Verifikon token-in JWT para se te pranoje lidhjen e socket-it
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    onlineUsers.set(userId, socket.id);
    console.log(`[Socket] User ${userId} connected`);
    io.emit("user:online", { userId });

    // Bashkon perdoruesin ne dhomen e bisedes se zgjedhur
    socket.on("conversation:join", (conversationId) => {
      socket.join(`conv:${conversationId}`);
    });

    // Transmeton ngjarjet e shkrimit te perdoruesit tjeter
    socket.on("typing:start", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("typing:start", { userId });
    });
    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("typing:stop", { userId });
    });

    // Heq perdoruesin nga lista kur shkeputen
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("user:offline", { userId });
      console.log(`[Socket] User ${userId} disconnected`);
    });
  });

  return io;
}

module.exports = configureSocket;
module.exports.onlineUsers = onlineUsers;