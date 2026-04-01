const { Router } = require("express");
const { handleSendMessage, handleGetMessages } = require("./messages.controller.js");
const sendMessageValidator = require("./validators/sendMessage.validator.js");
const auth = require("../middleware/authenticateToken.middleware.js");

const messagesRouter = Router();

// POST /api/messages              - dergo mesazh me validim
// GET  /api/messages/:conversationId - merr mesazhet e nje bisede (me faqezim)
messagesRouter.post("/",                auth, sendMessageValidator, handleSendMessage);
messagesRouter.get("/:conversationId",  auth, handleGetMessages);

module.exports = messagesRouter;