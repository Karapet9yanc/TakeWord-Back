const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true},
  password: { type: String, required: true },
  isActivated: { type: String, default: false },
  activationLink: { type: String, required: true },
  showedWords: { type: Array, default: []}
});

module.exports = mongoose.model("user", userSchema);
