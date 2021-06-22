const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'run',
        aliases: ["ping", "latency"],
        description: `Obten imagenes.`,
        category: 'interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    let img = await azami.Run()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('¿Correras contigo mismo/a? owo')

    if(!miembro){
      message.channel.send({embed: 
        {color:'RANDOM', 
        description: `¡Corre **${message.author.username}**, corre!`, 
        image: {url: img}
      }})
      } else {
        const msg = [`¡Huye **${message.author.username}**! Deja sin alcance a **${miembro.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};