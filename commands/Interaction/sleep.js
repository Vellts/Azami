const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'sleep',
        description: `Me parece que te ha alcanzado el sueño... u.u`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['sleep', 'sleep @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    let img = await azami.Sleep()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: `Se le han acabado las baterías a **${message.author.username}**.`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        const msg = [`A **${message.author.username}** le apetece dormir junto a **${miembro.user.username}**. uwu`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: random, 
        image: {url: img}
      }]})
    }


      }
};