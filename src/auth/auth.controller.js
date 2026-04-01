const signupProvider = require("./providers/signup.provider.js");
const loginProvider  = require("./providers/login.provider.js");
const meProvider     = require("./providers/me.provider.js");

// Kontrolleri auth - delegon logjiken te provider-at perkatese
async function handleSignup(req, res) { return await signupProvider(req, res); }
async function handleLogin(req, res)  { return await loginProvider(req, res); }
async function handleMe(req, res)     { return await meProvider(req, res); }

module.exports = { handleSignup, handleLogin, handleMe };