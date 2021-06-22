const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  levelStatus: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  justChannel: {
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
    default: '¡Felicidades {username}! Has subido a nivel {user_level}.'
  },
  role1: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
  role2: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
  role3: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
  role4: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
  role5: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
  role6: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
  role7: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
  role8: {
    roleid: {
      type: mongoose.SchemaTypes.String,
      default: false
    },
    levelreq: {
      type: mongoose.SchemaTypes.String,
      default: false
    }
  },
});

module.exports = mongoose.model('levelSystem', guildConfigSchema);