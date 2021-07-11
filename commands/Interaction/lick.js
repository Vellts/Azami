const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'lick',
        description: `Una lamida... ¿tendrá buen sabor? u.u`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Lick()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `Y-yo te voy a lamer **${message.author.username}**. o//o`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${message.author.username}** encuentra buen sabor en **${miembro.username}**. >u<`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};