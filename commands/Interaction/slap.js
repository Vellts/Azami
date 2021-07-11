const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'slap',
        description: `¡Una bofetada, bien merecida la tiene!`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    let img = await azami.Slap()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `**${message.author.username}** ten una bofetada de mi parte. :c`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${message.author.username}** le dió una dura bofetada a **${miembro.username}** ee`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};