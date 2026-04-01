const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user.model.js");

// Kerkon perdorues sipas username me regex (kërkim i pjesshem, case-insensitive)
// Perjashtron perdoruesin aktual nga rezultatet dhe kthen max 10 rezultate
async function searchUsersProvider(req, res) {
  const { username } = req.query;
  if (!username || username.trim().length < 1)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "username query param is required" });

  try {
    const users = await User.find({
      username: { $regex: username.trim(), $options: "i" },
      // Perjashtron perdoruesin aktual nga lista
      _id: { $ne: req.user.id },
    }).select("_id firstName lastName username").limit(10);

    return res.status(StatusCodes.OK).json({ users });
  } catch (err) {
    console.error("[SearchUsers]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = searchUsersProvider;