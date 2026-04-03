const { StatusCodes } = require("http-status-codes");
const Conversation = require("../../models/conversation.model.js");
const { decryptMessage } = require("../../utils/crypto.util.js");

// Merr te gjitha bisedat dhe dekripton permbajtjen e lastMessage per sidebar
async function getConversationsProvider(req, res) {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "firstName lastName username")
      .populate({ path: "lastMessage", select: "content createdAt sender" })
      .sort({ updatedAt: -1 });

    // Dekripton lastMessage.content per cdo bisede
    const result = conversations.map((conv) => {
      const obj = conv.toObject();
      if (obj.lastMessage?.content) {
        obj.lastMessage.content = decryptMessage(obj.lastMessage.content);
      }
      return obj;
    });

    return res.status(StatusCodes.OK).json({ conversations: result });
  } catch (err) {
    console.error("[GetConversations]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = getConversationsProvider;