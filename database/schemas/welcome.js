const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  welcomeToggle: {
    type: mongoose.SchemaTypes.Boolean,
    default: false,
  },
  welcomeDM: {
    type: mongoose.SchemaTypes.String,
    default: false
  },
  welcomeChannel:{
    type: mongoose.SchemaTypes.String,
    default: false,
  },
  welcomeMessage:{
    type: mongoose.SchemaTypes.String,
    default: `Bienvenid@ {user}. Ahora tenemos {memberCount} miembros!`,
  },
  welcomeEmbed:{
    type: mongoose.SchemaTypes.String,
    default: false,
  },
});

module.exports = mongoose.model('welcome-module', guildConfigSchema);