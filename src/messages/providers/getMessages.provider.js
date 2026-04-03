const { StatusCodes } = require("http-status-codes");
const Message      = require("../../models/message.model.js");
const Conversation = require("../../models/conversation.model.js");
const { decryptMessage } = require("../../utils/crypto.util.js");

// Merr mesazhet e nje bisede, i dekripton dhe i kthen te frontend-i
async function getMessagesProvider(req, res) {
  const { conversationId } = req.params;
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 40;
  const skip  = (page - 1) * limit;

  try {
    // Verifikon qe perdoruesi eshte pjese e bisedes
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });
    if (!conversation)
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied to this conversation" });

    const messages = await Message.find({ conversationId })
      .populate("sender", "firstName lastName username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Shenon si te lexuara
    await Message.updateMany(
      { conversationId, readBy: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );

    // Dekripton permbajtjen e cdo mesazhi para dergimit te frontend-it
    const decrypted = messages.reverse().map((msg) => ({
      ...msg.toObject(),
      content: decryptMessage(msg.content),
    }));

    return res.status(StatusCodes.OK).json({ messages: decrypted });
  } catch (err) {
    console.error("[GetMessages]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = getMessagesProvider;