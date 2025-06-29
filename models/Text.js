// models/Text.js
const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    text: String
});

module.exports = mongoose.model('Text', textSchema);
