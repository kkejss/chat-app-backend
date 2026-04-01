const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Ruan perdoruesit online: userId -> socketId
const onlineUsers = new Map();

// Inicializon Socket.io, autentikon JWT dhe menaxhon ngjarjet ne kohe reale
function configureSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
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

    // Shton perdoruesin ne listen e online dhe njofton te tjeret
    onlineUsers.set(userId, socket.id);
    console.log(`[Socket] User ${userId} connected`);
    io.emit("user:online", { userId });

    // Bashkon perdoruesin ne dhomen e bisedes se zgjedhur
    socket.on("conversation:join", (conversationId) => {
      socket.join(`conv:${conversationId}`);
    });

    // Transmeton ngjarjet e shkrimit (typing) te perdoruesit tjeter
    socket.on("typing:start", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("typing:start", { userId });
    });
    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("typing:stop", { userId });
    });

    // Heq perdoruesin nga lista kur shkeputen dhe njofton te tjeret
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