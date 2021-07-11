const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'punch',
        description: `¡Propina un fuerte golpe! Que nadie se salve.`,
        category: 'Interaction',
        cooldown: 3,
      });
    } 

    async run(message, args) {

    let img = await azami.Punch()

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase())
    if(miembro === message.author) return message.channel.send('No te puedes golpear tu mismo/a. >:(')

    if(!miembro){
      message.channel.send('Menciona al que quieras golpear. :c').then(msg => msg.delete({timeout: 8000}))
      } else {
        const msg = [`**${message.author.username}** ha dejado sin oportunidades a **${miembro.username}**. D:`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embed: 
        {color:'RANDOM', 
        description: random, 
        image: {url: img}
      }})
    }


      }
};