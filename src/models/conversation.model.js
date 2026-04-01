const { Schema, model } = require("mongoose");

// Skema e bisedes: mban pjesemarresit dhe mesazhin e fundit
const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  lastMessage:  { type: Schema.Types.ObjectId, ref: "Message", default: null },
}, { timestamps: true });

// Indeks per kerkime me shpejte sipas pjesemarresve
conversationSchema.index({ participants: 1 });

module.exports = model("Conversation", conversationSchema);