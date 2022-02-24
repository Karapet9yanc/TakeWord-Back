const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  isActivated: { type: String, required: true },
  activationLink: { type: String, required: true }
});

module.exports = mongoose.model("user", userSchema);
