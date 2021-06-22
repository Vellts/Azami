const mongoose = require('mongoose');

const alliesSchema = mongoose.Schema({
  guildId: {
    type: String,
  },
  staffRole: {
    type: String,
    required: false,
  },
  channelId: {
    type: String,
    required: false,
  }
});


module.exports = mongoose.model('allies', alliesSchema);