const mongoose = require("mongoose");

const { Schema } = mongoose;

const shownWordsSchema = new Schema({
    words: Array,
    translations: Array

});

module.exports = allWordsSchema = mongoose.model("shownWords", shownWordsSchema);