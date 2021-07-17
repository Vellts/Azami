const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'feed',
        description: `Dale un poco de comida a otra persona. :3`,
        category: 'Interaction',
        usage: ['<Miembro opcional>'],
        examples: ['feed', 'feed @Nero'],
        cooldown: 3,
      });
    } 

    async run(message, args) {

    

    let img = await azami.Feed()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: `Ten un poco de comida... **${message.author.username}**. :3`, 
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        const msg = [`**${message.author.username}** le dió de comer a **${miembro.user.username}**. :3`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds: 
        [{color:'RANDOM', 
        description: random, 
        image: {url: img}
      }]})
    }


      }
};