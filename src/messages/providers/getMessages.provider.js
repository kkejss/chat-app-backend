const { StatusCodes } = require("http-status-codes");
const Message      = require("../../models/message.model.js");
const Conversation = require("../../models/conversation.model.js");

// Merr mesazhet e nje bisede me faqezim dhe i shenon si te lexuara
async function getMessagesProvider(req, res) {
  const { conversationId } = req.params;

  // Faqezim: page=1, limit=40 si vlera standarde
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 40;
  const skip  = (page - 1) * limit;

  try {
    // Verifikon qe perdoruesi eshte pjese e bisedes (siguri)
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });
    if (!conversation)
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied to this conversation" });

    // Merr mesazhet te renditura nga me i vjetri (sort -1 dhe reverse ne fund)
    const messages = await Message.find({ conversationId })
      .populate("sender", "firstName lastName username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Shenon si te lexuara te gjitha mesazhet qe perdoruesi nuk i ka lexuar
    await Message.updateMany(
      { conversationId, readBy: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );

    // Rikthen renditjen kronologjike para dergimit
    return res.status(StatusCodes.OK).json({ messages: messages.reverse() });
  } catch (err) {
    console.error("[GetMessages]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = getMessagesProvider;