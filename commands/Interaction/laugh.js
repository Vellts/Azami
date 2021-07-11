const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'laugh',
        description: `Ríete de algo, o de alguien.`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Laugh()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('Riete de alguien más. u.u')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `**${message.author.username}** parece que se ríe de algo... o alguien.`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${message.author.username}** se está riendo de **${miembro.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};