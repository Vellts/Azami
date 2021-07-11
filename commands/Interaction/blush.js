const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'blush',
        description: `¡Uy! Que ha pasado...`,
        category: 'Interaction',
        cooldown: 3,
      });
    }

    async run(message, args) {

    

    let img = await azami.Blush()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('¿Estás molesto/a contigo? unu')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description:`El color rojo inunda el rostro de **${message.author.username}**. >w<`, 
        image: {url: img}
      }})
      } else {
        message.channel.send({embed: 
        {color:'RANDOM', 
        description:`**${message.author.username}** se encuentra como un tomate por **${miembro.username}**. >u<`, 
        image: {url: img}
      }})
    }


      }
};