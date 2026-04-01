const { Schema, model } = require("mongoose");

// Skema e mesazhit: i perket nje bisede, ka derrguese dhe permbajtje
const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
  sender:         { type: Schema.Types.ObjectId, ref: "User", required: true },
  content:        { type: String, required: true, trim: true, maxlength: 2000 },
  // Lista e perdoruesve qe e kane lexuar mesazhin
  readBy:         [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = model("Message", messageSchema);