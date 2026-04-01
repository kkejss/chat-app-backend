const { StatusCodes } = require("http-status-codes");
const { validationResult, matchedData } = require("express-validator");
const Message      = require("../../models/message.model.js");
const Conversation = require("../../models/conversation.model.js");

// Ruan mesazhin ne databaze, perditeson biseden dhe e transmeton ne kohe reale
async function sendMessageProvider(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

  const { conversationId, content } = matchedData(req);

  try {
    // Verifikon qe perdoruesi eshte pjese e bisedes (siguri)
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });
    if (!conversation)
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied to this conversation" });

    // Krijon mesazhin dhe e shton derrgesin ne listen readBy
    const message = await Message.create({
      conversationId,
      sender: req.user.id,
      content,
      readBy: [req.user.id],
    });

    // Perditeson fushen lastMessage te bisedes
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

    // Ploteson te dhenat e derrgesit per pergjigje
    const populated = await message.populate("sender", "firstName lastName username");

    // Transmeton mesazhin ne kohe reale te te gjitheve ne dhomin e bisedes
    if (req.io) {
      req.io.to(`conv:${conversationId}`).emit("message:new", {
        conversationId,
        message: populated,
      });
    }

    return res.status(StatusCodes.CREATED).json({ message: populated });
  } catch (err) {
    console.error("[SendMessage]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = sendMessageProvider;