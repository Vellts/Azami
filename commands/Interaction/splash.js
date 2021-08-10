const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'splash',
        description: `¡Echale un poco de agua a alguien más! owo`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['splash', 'splash @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())

    if(!miembro || miembro.id === message.author.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `Ten un poco de agua... **${message.author.username}**.`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else if (miembro.id === this.client.user.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `¡Ya estoy lo suficientemente mojada, **${message.author.username}**! >.<`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else {
        if(miembro.user.bot) return
        const msg = [`**${message.author.username}** roció un poco de agua a **${miembro.user.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.reply({embeds:
        [{color:'RANDOM',
        description: random,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    }
  }
};
