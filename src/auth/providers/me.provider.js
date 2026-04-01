const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user.model.js");

// Kthen te dhenat e perdoruesit aktual bazuar ne token-in e autentifikimit
// req.user vendoset nga middleware authenticateToken
async function meProvider(req, res) {
  try {
    // Merr userin pa fushen e fjalekalimit
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    return res.status(StatusCodes.OK).json({ user });
  } catch (err) {
    console.error("[Me]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = meProvider;