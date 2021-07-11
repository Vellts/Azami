const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'latom',
        description: `Una mano, que te puede salvar.`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Latom()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('Menciona a otra persona... u.u')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `**${message.author.username}** está juntando sus palmas.`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${message.author.username}** está orando por **${miembro.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};