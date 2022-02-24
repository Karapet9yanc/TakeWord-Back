const mongoose = require("mongoose");

const { Schema } = mongoose;

const allWordsSchema = new Schema({
  word: String,
  translation: String
});

module.exports = mongoose.model("allWordsSchema", allWordsSchema);