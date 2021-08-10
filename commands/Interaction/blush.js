const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Blush extends Command {
    constructor(...args) {
      super(...args, {
        name: 'blush',
        description: `¡Uy! Que ha pasado...`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['blush', 'blush @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())

    if(!miembro || miembro.id === message.author.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description:`El color rojo inunda el rostro de **${message.author.username}**. >w<`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else if(miembro.id === this.client.user.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description:`**${message.author.username}** algo rojo ronda por aquí...`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else {
      message.reply({embeds:
        [{color:'RANDOM',
        description:`**${message.author.username}** se encuentra como un tomate por **${miembro.user.username}**. >u<`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    }
  }
};
