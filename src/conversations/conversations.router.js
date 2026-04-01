const { Router } = require("express");
const { handleGetConversations, handleGetOrCreate, handleDeleteConversation } = require("./conversations.controller.js");
const auth = require("../middleware/authenticateToken.middleware.js");

const conversationsRouter = Router();

// Te gjitha routat kerkojne autentifikim
// GET    /api/conversations      - merr te gjitha bisedat e perdoruesit
// POST   /api/conversations      - krijon ose merr biseden me nje perdorues tjeter
// DELETE /api/conversations/:id  - fshi biseden
conversationsRouter.get("/",       auth, handleGetConversations);
conversationsRouter.post("/",      auth, handleGetOrCreate);
conversationsRouter.delete("/:id", auth, handleDeleteConversation);

module.exports = conversationsRouter;