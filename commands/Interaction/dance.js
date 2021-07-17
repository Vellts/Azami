const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'dance',
        description: `¡Zumba! Muevete al ritmo de los cantos.`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['dance', 'dance @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Dance()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: `**${message.author.username}** se mueve al ritmo de la música.`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        const msg = [`**${miembro.user.username}** sigue los pasos de **${message.author.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: random, 
        image: {url: img}
      }]})
    }


      }
};