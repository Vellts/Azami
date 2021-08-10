const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Punch extends Command {
    constructor(...args) {
      super(...args, {
        name: 'punch',
        description: `¡Propina un fuerte golpe! Que nadie se salve.`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['punch', 'punch @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    
    if(!miembro) return message.reply({content: "¿A quién golpearás? u.u", allowedMentions: { repliedUser: false }})
    if(miembro.id === message.author.id) return message.reply({content: "¿Que quieres hacer? O.o", allowedMentions: { repliedUser: false }})
    if(miembro.id === this.client.user.id) return message.reply({content: "¡Nono! *Corre*.", allowedMentions: { repliedUser: false }})
    const msg = [`**${message.author.username}** ha dejado sin oportunidades a **${miembro.user.username}**. D:`]
    let random = msg[Math.floor(Math.random() * msg.length)]
    message.reply({embeds:
      [{color:'RANDOM',
      description: random,
      image: {url: img.gif },
      footer: { text: `Anime: ${img.name}` }
    }], allowedMentions: { repliedUser: false }})
  }
};