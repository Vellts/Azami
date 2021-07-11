const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'happy',
        description: `¡Muestra tu felicidad con todo el mundo!`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Happy()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('***¡Ya deberías estar feliz contigo mismo/a!***')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `**${message.author.username}** se encuentra muy feliz. n.n`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${message.author.username}** está muy alegre por **${miembro.username}**. :3`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};