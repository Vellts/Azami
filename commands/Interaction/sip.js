const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Sip extends Command {
    constructor(...args) {
      super(...args, {
        name: 'sip',
        description: `Toma una tacita de té, con alguien más o en soledad. uwu`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['sip', 'sip @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())

    if(!miembro || miembro.id === message.author.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `**${message.author.username}** toma una bebida refrescante. uwu`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else if(miembro.id === this.client.user.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `Parece que disfrutar tomar té en la tarde, **${message.author.username}**.`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else {
        const msg = [`**${message.author.username}** bebe una tacita de té con **${miembro.user.username}**.`]
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
