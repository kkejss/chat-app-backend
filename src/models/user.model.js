const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Skema e perdoruesit ne MongoDB me validation per fushat kryesore
const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 100 },
  lastName:  { type: String, required: false, trim: true, maxlength: 100 },
  username:  { type: String, required: true, unique: true, trim: true, lowercase: true, minlength: 3, maxlength: 30 },
  phone:     { type: String, required: false, trim: true },
  password:  { type: String, required: true },
}, { timestamps: true });

// Para ruajtjes, hash-on fjalekalimin vetem nese ka ndryshuar
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Metode per krahasimin e fjalekalimit gjate login-it
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = model("User", userSchema);