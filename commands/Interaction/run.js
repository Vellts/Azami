const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Run extends Command {
    constructor(...args) {
      super(...args, {
        name: 'run',
        description: `¡Corre por tu vida, que note atrapen!`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['run', 'run @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())

    if(!miembro || miembro.id === message.author.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `¡Corre **${message.author.username}**, corre!`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else if(miembro.id === this.client.user.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `¡Corre más rapido **${message.author.username}**, te estás quedando atrás!`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else {
        const msg = [`¡Huye **${message.author.username}**! Deja sin alcance a **${miembro.user.username}**.`]
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
