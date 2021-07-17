const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'baka',
        description: `¿Será una... baka?`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['baka', 'baka @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    

    let img = await azami.Baka()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description:`**${message.author.username}** B-baka! >.<`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description:`**¡${miembro.user.username}** baka, baka baka!**.`, 
        image: {url: img}
      }]})
    }


      }
};