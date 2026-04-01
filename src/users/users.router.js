const { Router } = require("express");
const { handleSearchUsers } = require("./users.controller.js");
const auth = require("../middleware/authenticateToken.middleware.js");

const usersRouter = Router();

// GET /api/users/search?username=... - kerkon perdorues sipas username (kerkon autentifikim)
usersRouter.get("/search", auth, handleSearchUsers);

module.exports = usersRouter;