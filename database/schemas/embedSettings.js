const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    footer: { type: String },
    thumbnail: { type: String },
    author: { type: String },
    color: { type: String },
    timestamp: { type: Boolean }
})

module.exports = mongoose.model('embedSettings', Schema)