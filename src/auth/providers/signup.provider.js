const { StatusCodes } = require("http-status-codes");
const { validationResult, matchedData } = require("express-validator");
const User = require("../../models/user.model.js");
const generateToken = require("./generateToken.provider.js");

// Krijon llogari te re: kontrollon validimin, kontrollon username dhe krijon userin
async function signupProvider(req, res) {
  // Kthen gabim nese validimi deshtoi
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

  // Merr vetem fushat e validuara (parandalon injection)
  const { firstName, lastName, username, phone, password } = matchedData(req);

  try {
    // Kontrollon nese username ekziston
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(StatusCodes.CONFLICT).json({ message: "Username is already taken" });

    // Krijon userin (bcrypt behet automatikisht ne model)
    const user = await User.create({ firstName, lastName, username, phone, password });
    const token = generateToken(user);

    return res.status(StatusCodes.CREATED).json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, username: user.username },
    });
  } catch (err) {
    console.error("[Signup]", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

module.exports = signupProvider;
