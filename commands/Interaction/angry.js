const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'angry',
        description: `¿Te molesta alguien? Esta emoción es perfecta para la ocasión.`,
        category: 'Interaction',
        cooldown: 3,
      });
    }

    async run(message, args) {

    

    let img = await azami.Angry()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('¿Estás molesto/a contigo? unu')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description:`**${message.author.username}** por algún motivo está furioso/a. D:`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${message.author.username}** está muy molesto/a con **${miembro.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};