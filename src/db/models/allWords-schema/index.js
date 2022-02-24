const mongoose = require("mongoose");

const { Schema } = mongoose;

const allWordsSchema = new Schema({
  words: Array,
  translations: Array
});

module.exports = mongoose.model("allWordsSchema", allWordsSchema);