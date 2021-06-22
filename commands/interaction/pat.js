const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'pat',
        aliases: ["ping", "latency"],
        description: `Obten imagenes.`,
        category: 'interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Pat()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `**${message.author.username}** ten una caricia de mi parte. uwu`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${miembro.username}** recibe cariño por parte de **${message.author.username}**. uwu`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};