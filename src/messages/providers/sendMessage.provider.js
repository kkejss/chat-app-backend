const { StatusCodes } = require("http-status-codes");
const { validationResult, matchedData } = require("express-validator");
const Message      = require("../../models/message.model.js");
const Conversation = require("../../models/conversation.model.js");
const { encryptMessage, decryptMessage } = require("../../utils/crypto.util.js");

// Enkripton mesazhin, e ruan ne databaze dhe e transmeton ne kohe reale
async function sendMessageProvider(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

  const { conversationId, content } = matchedData(req);

  try {
    // Verifikon qe perdoruesi eshte pjese e bisedes
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });
    if (!conversation)
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied to this conversation" });

    // Enkripton permbajtjen para ruajtjes ne databaze
    const encryptedContent = encryptMessage(content);

    const message = await Message.create({
      conversationId,
      sender: req.user.id,
      content: encryptedContent,
      readBy: [req.user.id],
    });

    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

    const populated = await message.populate("sender", "firstName lastName username");

    // Dekripton para dergimit te frontend-it (user sheh tekstin e qarte)
    const messageForClient = {
      ...populated.toObject(),
      content: decryptMessage(populated.content),
    };

    // Transmeton ne kohe reale te te gjitheve ne dhomin e bisedes
    if (req.io) {
      req.io.to(`conv:${conversationId}`).emit("message:new", {
        conversationId,
        message: messageForClient,
      });
    }

    return res.status(StatusCodes.CREATED).json({ message: messageForClient });
  } catch (err) {
    console.error("[SendMessage]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = sendMessageProvider;