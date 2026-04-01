const searchUsersProvider = require("./providers/searchUsers.provider.js");

// Kontrolleri i perdoruesve - delegon logjiken te provider-i
async function handleSearchUsers(req, res) { return await searchUsersProvider(req, res); }

module.exports = { handleSearchUsers };