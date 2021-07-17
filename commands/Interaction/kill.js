const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'kill',
        description: `Deja sin signos vitales a una persona... D:`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['kill', 'kill @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Kill()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author || !miembro) return
    if(miembro.user.bot) return
    if(!miembro) return
    const msg = [`**${message.author.username}** dejó sin signos vitales a **${miembro.username}**. D:`]
    let random = msg[Math.floor(Math.random() * msg.length)]
    message.channel.send({embeds: 
      [{color:'RANDOM', 
      description: random, 
      image: {url: img}
    }]})
  }
};