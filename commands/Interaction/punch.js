const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'punch',
        description: `¡Propina un fuerte golpe! Que nadie se salve.`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['punch', 'punch @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    let img = await azami.Punch()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author || !miembro) return
    if(miembro.user.bot) return
    const msg = [`**${message.author.username}** ha dejado sin oportunidades a **${miembro.user.username}**. D:`]
    let random = msg[Math.floor(Math.random() * msg.length)]
    message.channel.send({embeds: 
      [{color:'RANDOM', 
      description: random, 
      image: {url: img}
    }]})
  }
};