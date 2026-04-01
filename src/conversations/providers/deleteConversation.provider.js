const { StatusCodes } = require("http-status-codes");
const Conversation = require("../../models/conversation.model.js");

// Fshi biseden per perdoruesin aktual
// Nese mbeten perdorues te tjere, ata vazhdojne ta shohin - vetem ky perdorues largohet
// Nese nuk mbetet askush, biseda fshihet plotesisht nga databaza
async function deleteConversationProvider(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(id);

    if (!conversation)
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Conversation not found" });

    // Verifikon qe perdoruesi eshte pjese e bisedes
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId
    );
    if (!isParticipant)
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });

    // Largon vetem kete perdorues nga lista e pjesemarresve
    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== userId
    );

    // Nese nuk ka me pjesemarres, fshin biseden nga databaza
    if (conversation.participants.length === 0) {
      await Conversation.findByIdAndDelete(id);
    } else {
      await conversation.save();
    }

    return res.status(StatusCodes.OK).json({ message: "Conversation deleted" });
  } catch (err) {
    console.error("[DeleteConversation]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = deleteConversationProvider;