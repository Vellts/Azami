const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'bite',
        aliases: ["ping", "latency"],
        description: `Obten imagenes.`,
        category: 'interaction',
        cooldown: 3,
      });
    }

    async run(message, args) {

    

    let img = await azami.Bite()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('¿Estás molesto/a contigo? unu')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description:`Yo te daré una mordida... **${message.author.username}**. >u<`, 
        image: {url: img}
      }})
      } else {
        message.channel.send({embed: 
        {color:'RANDOM', 
        description:`**${message.author.username}** le dió una mordida a **${miembro.username}** >n<`, 
        image: {url: img}
      }})
    }


      }
};