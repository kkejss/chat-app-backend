const getConversationsProvider        = require("./providers/getConversations.provider.js");
const getOrCreateConversationProvider = require("./providers/getOrCreateConversation.provider.js");
const deleteConversationProvider      = require("./providers/deleteConversation.provider.js");

// Kontrolleri i bisedave - delegon logjiken te provider-at perkatese
async function handleGetConversations(req, res)   { return await getConversationsProvider(req, res); }
async function handleGetOrCreate(req, res)         { return await getOrCreateConversationProvider(req, res); }
async function handleDeleteConversation(req, res)  { return await deleteConversationProvider(req, res); }

module.exports = { handleGetConversations, handleGetOrCreate, handleDeleteConversation };