const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'sleep',
        aliases: ["ping", "latency"],
        description: `Obten imagenes.`,
        category: 'interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    let img = await azami.Sleep()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `Se le han acabado las baterías a **${message.author.username}**.`, 
        image: {url: img}
      }})
      } else {
        const msg = [`A **${message.author.username}** le apetece dormir junto a **${miembro.username}**. uwu`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};