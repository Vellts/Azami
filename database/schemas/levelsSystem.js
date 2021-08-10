const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  levelupChannel: {
    type: mongoose.SchemaTypes.String,
    default: 00
  },
  messageChannelType: {
    type: mongoose.SchemaTypes.String,
    default: 1
  },
  multiplier: {
    type: mongoose.SchemaTypes.Number,
    default: 1
  },
  levelStatus: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  justChannel: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
  disableChannels: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
  disableRoles: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
  levelEmbed: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: false
  },
  levelMessage: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: '¡Felicidades **{username}**! Has subido a nivel **{user_level}**.'
  },
  roleAdd: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
});

module.exports = mongoose.model('levelSystem', guildConfigSchema);
