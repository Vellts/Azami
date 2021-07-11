const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'kiss',
        description: `¡Un dulce beso! Una muestra de amor.`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Kisse()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `**${message.author.username}** toma un beso de mi parte. uwu`, 
        image: {url: img}
      }})
      } else {
        const msg = [`**${miembro.username}** ha recibido un dulce beso de **${message.author.username}**. uwu`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};