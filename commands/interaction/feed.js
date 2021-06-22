const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'feed',
        aliases: ["ping", "latency"],
        description: `Obten imagenes.`,
        category: 'interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Feed()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('Deja que te alimente otra persona... uwu')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `Ten un poco de comida... **${message.author.username}**. :3`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${message.author.username}** le dió de comer a **${miembro.username}**. :3`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};