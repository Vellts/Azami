const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'bite',
        description: `Muerde al que quieras, sin piedad.`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['bite', 'bite @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    

    let img = await azami.Bite()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return 

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description:`Yo te daré una mordida... **${message.author.username}**. >u<`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description:`**${message.author.username}** le dió una mordida a **${miembro.user.username}** >n<`, 
        image: {url: img}
      }]})
    }


      }
};