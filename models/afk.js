const mongoose = require("mongoose");

const afkSchema = mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  estado: { type: String, required: true },
  timestamp: { type: Number, required: true }
});

module.exports = mongoose.model("afk", afkSchema);
