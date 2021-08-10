const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')
const animeList = require('../../models/animelist')
const Canvas = require('canvas')
const fetch = require('node-fetch')
const level = require('../../database/schemas/levelsSystem.js')
const lvls = require('../../packages/Levels/models/levels.js')
const animeGifs = require('../../models/gifAnime')
const moment = require("moment")
const champions = require("../../Util/LoL/champions")
const queueList = require("../../Util/LoL/queueList")
const { Constants, Queues, Tiers, Divisions } = require("twisted")


module.exports = class extends Command {
    constructor(...args) {
          super(...args, {
               name: 'test',
               description: 'Comando de pruebas.',
               category: 'Information',
               cooldown: 3,
          });
     }

     async run(message, args) {

      return console.log("xd")
  }
};