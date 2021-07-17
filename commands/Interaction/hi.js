const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'hi',
        description: `¡Un saludo para todo el mundo! ¡Hola!`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['hi', 'hi @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Hi()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return message.channel.send('¿Hace falta saludarte tu mismo/a? O.o')

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: `**${message.author.username}** está saludando a todos. :3`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        const msg = [`¡**${miembro.user.username}**! te está saludando **${message.author.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: random, 
        image: {url: img}
      }]})
    }


      }
};