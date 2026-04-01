const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const configureApp = require("./src/settings/config.js");
const configureSocket = require("./src/settings/socket.config.js");

// Vendos mjedisin (development ose production) dhe ngarkon variablat nga .env
process.env.NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Krijon aplikacionin Express dhe serverin HTTP
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Lejon leximin e JSON nga body i kerkesave
app.use(express.json());

// Regjistron middleware-t dhe routerat (CORS, Morgan, API routes)
configureApp(app);

// Inicializon Socket.io mbi server-in HTTP
const io = configureSocket(server);

// Vendos io ne req per ta perdorur brenda routerave
app.use((req, _res, next) => { req.io = io; next(); });

// Lidhet me MongoDB dhe fillon serverin
async function bootstrap() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });
    console.log("Connected to MongoDB");
    server.listen(port, () => console.log(`Lumiere backend on port ${port}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

bootstrap();