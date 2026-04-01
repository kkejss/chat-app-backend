const { StatusCodes } = require("http-status-codes");
const { validationResult, matchedData } = require("express-validator");
const User = require("../../models/user.model.js");
const generateToken = require("./generateToken.provider.js");

// Kontrollon kredencialet dhe kthen token nese jane korrekte
async function loginProvider(req, res) {
  // Kthen gabim nese validimi deshtoi
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

  const { username, password } = matchedData(req);

  try {
    // Kërkon userin ne databaze sipas username
    const user = await User.findOne({ username });
    if (!user)
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });

    // Krahason fjalekalimin e dhene me hash-in ne databaze
    const match = await user.comparePassword(password);
    if (!match)
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    return res.status(StatusCodes.OK).json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, username: user.username },
    });
  } catch (err) {
    console.error("[Login]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = loginProvider;