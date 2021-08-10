const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'slap',
        description: `¡Una bofetada, bien merecida la tiene!`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['slap', 'slao @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())

    if(!miembro || miembro.id === message.author.id){
      message.reply({embeds:
        [{color:'RANDOM',
        description: `**${message.author.username}** ten una bofetada de mi parte. :c`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }], allowedMentions: { repliedUser: false }})
    } else if (miembro.id === this.client.user.id){
      message.reply({content: `¿Eh? ¿Me intentas dar una bofetada? :(`, allowedMentions: { repliedUser: false }})
    } else {
        if(miembro.user.bot) return
        const msg = [`**${message.author.username}** le dió una dura bofetada a **${miembro.user.username}**. u.u`]
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
