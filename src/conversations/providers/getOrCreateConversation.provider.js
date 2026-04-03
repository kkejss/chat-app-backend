const { StatusCodes } = require("http-status-codes");
const Conversation = require("../../models/conversation.model.js");
const User = require("../../models/user.model.js");
const { decryptMessage } = require("../../utils/crypto.util.js");

// Nese biseda mes dy perdoruesve ekziston e kthen, ndryshe e krijon
async function getOrCreateConversationProvider(req, res) {
  const { participantId } = req.body;
  const currentUserId = req.user.id;

  if (!participantId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "participantId is required" });
  if (participantId === currentUserId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Cannot start a conversation with yourself" });

  try {
    const otherUser = await User.findById(participantId).select("_id firstName lastName username");
    if (!otherUser)
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, participantId], $size: 2 },
    })
      .populate("participants", "firstName lastName username")
      .populate({ path: "lastMessage", select: "content createdAt" });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [currentUserId, participantId] });
      conversation = await conversation.populate("participants", "firstName lastName username");
      return res.status(StatusCodes.OK).json({ conversation });
    }

    // Dekripton lastMessage.content nese ekziston
    const obj = conversation.toObject();
    if (obj.lastMessage?.content) {
      obj.lastMessage.content = decryptMessage(obj.lastMessage.content);
    }

    return res.status(StatusCodes.OK).json({ conversation: obj });
  } catch (err) {
    console.error("[GetOrCreate]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = getOrCreateConversationProvider;