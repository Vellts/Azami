const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  roleID: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: null
  },
  roleToggle: {
    type: Boolean,
    required: false,
    default: false
  },
  roleUser: {
    type: Array,
    required: false,
    default: []
  }
});

module.exports = mongoose.model('autoRole', guildConfigSchema);
