const { Client, Collection } = require("discord.js")
const Util = require('./structures/Util');
const Guild = require('./database/schemas/Guild')
const config = require('./config.json');
const token  = config.main_token
const mongoose = require('mongoose')

module.exports = class azamiClient extends Client {
	constructor(options = {}, sentry) {
	  super({
      partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: true,
      cachePresences:  true,
      fetchAllMembers: true,
      disableMentions: 'everyone',
      messageCacheMaxSize: 25,
      messageCacheLifetime: 10000, 
      messageSweepInterval: 12000,
      intents: [
        'GUILDS', 
        'GUILD_MEMBERS', 
        'GUILD_MESSAGES', 
        'GUILD_EMOJIS',
        'GUILD_MESSAGE_REACTIONS', 
        'GUILD_VOICE_STATES', 
        'GUILD_INVITES',
        'GUILD_PRESENCES'
      ],
    });
    
    this.validate(options);
    this.partials = ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    this.commands = new Collection();
    this.events = new Collection();
    this.aliases = new Collection();
    this.utils = new Util(this);
    this.config = require('./config.json');
    this.commandCount = 0
    this.slashCommands = new Collection();
    this.delay = ms => new Promise(res => setTimeout(res, ms));
  }
  
  validate(options) {
    if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

    if (!token) throw new Error('You must pass the token for the client.');
    this.token = token;

    if(!options.prefix) throw new Error('You must pass a prefix for the client.');
    if(typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
    this.prefix = options.prefix;

    if (!options.mongodb_url) throw new Error('You must pass a MONGODB URL for the client.')
  }

  async start(token = this.token) {
    this.utils.loadCommands()
    this.utils.loadEvents()
    this.utils.loadSlashCommands()
 
    const connect = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.connect(config.mongodb_url, connect);
    
    this.login(config.token);

    //console.log('LOADED BOT!');
  }

};
