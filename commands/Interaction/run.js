const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'run',
        description: `¡Corre por tu diva, que note atrapen!`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['run', 'run @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    let img = await azami.Run()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: `¡Corre **${message.author.username}**, corre!`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        const msg = [`¡Huye **${message.author.username}**! Deja sin alcance a **${miembro.user.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: random, 
        image: {url: img}
      }]})
    }


      }
};