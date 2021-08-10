const { Client, Collection, Options, LimitedCollection } = require("discord.js")
require('./structures');
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
      makeCache: Options.cacheWithLimits({
        MessageManager:
        {
          sweepInterval: 12000,
          sweepFilter: LimitedCollection.filterByLifetime({
            maxSize: 25,
            lifetime: 10000,
            getComparisonTimestamp: e => e.editedTimestamp ?? e.createdTimestamp,
          })
        },
        ThreadManager: 
        {
          sweepInterval: 12000,
          sweepFilter: LimitedCollection.filterByLifetime({
            maxSize: 25,
            lifetime: 10000,
            getComparisonTimestamp: e => e.archiveTimestamp,
            excludeFromSweep: e => !e.archived,
          }),
        },
      }),
      intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_VOICE_STATES',
        'GUILD_INVITES',
      ],
    });

    this.validate(options);
    this.partials = ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    this.commands = new Collection();
    this.events = new Collection();
    this.aliases = new Collection();
    this.utils = new Util(this);
    this.config = require('./config.json');
		this.animegif = new Collection()
    this.commandCount = 0
    this.slashCommands = new Collection();
    this.delay = ms => new Promise(res => setTimeout(res, ms));
  }

  validate(options) {
    if (typeof options !== 'object') throw new TypeError('Las opciones deben ser de tipo Objeto.');

    if (!token) throw new Error('Ingresa un token.');
    this.token = token;

    if(!options.prefix) throw new Error('Ingresa un prefix.');
    if(typeof options.prefix !== 'string') throw new TypeError('El prefix debe ser un String.');
    this.prefix = options.prefix;

    if (!options.mongodb_url) throw new Error('No has ingresado una url de Mongo.')
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
