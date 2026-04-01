const { StatusCodes } = require("http-status-codes");
const Conversation = require("../../models/conversation.model.js");

// Merr te gjitha bisedat ku perdoruesi aktual eshte pjesemarres
// Renditet sipas dates se fundit te perditesimit (me e reja ne krye)
async function getConversationsProvider(req, res) {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "firstName lastName username")
      .populate({ path: "lastMessage", select: "content createdAt sender" })
      .sort({ updatedAt: -1 });

    return res.status(StatusCodes.OK).json({ conversations });
  } catch (err) {
    console.error("[GetConversations]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = getConversationsProvider;