const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'hi',
        description: `¡Un saludo para todo el mundo! ¡Hola!`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Hi()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('¿Hace falta saludarte tu mismo/a? O.o')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `**${message.author.username}** está saludando a todos. :3`, 
        image: {url: img}
      }})
      } else {
        const msg = [`¡**${miembro.username}**! te está saludando **${message.author.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};