const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Hi extends Command {
    constructor(...args) {
      super(...args, {
        name: 'hi',
        description: `¡Un saludo para todo el mundo! ¡Hola!`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['hi', 'hi @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())

    if(!miembro || miembro.id === message.author.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `**${message.author.username}** está saludando a todos. :3`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else if(miembro.id === this.client.user.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `¡Hola, **${message.author.username}**! :3`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else {
        const msg = [`¡**${miembro.user.username}**! Te está saludando **${message.author.username}**.`]
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
