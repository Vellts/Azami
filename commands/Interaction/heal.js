const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'heal',
        description: `Entrega una segunda vida a la persona que quieras.`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['heal', 'heal @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Heal()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: `**${message.author.username}** se cura de sus graves heridas.`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        const msg = [`**${message.author.username}** ha decidido curar a **${miembro.user.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: random, 
        image: {url: img}
      }]})
    }


      }
};