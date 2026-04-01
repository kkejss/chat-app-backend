const sendMessageProvider = require("./providers/sendMessage.provider.js");
const getMessagesProvider = require("./providers/getMessages.provider.js");

// Kontrolleri i mesazheve - delegon logjiken te provider-at perkatese
async function handleSendMessage(req, res) { return await sendMessageProvider(req, res); }
async function handleGetMessages(req, res) { return await getMessagesProvider(req, res); }

module.exports = { handleSendMessage, handleGetMessages };