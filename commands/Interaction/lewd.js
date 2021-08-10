const Command = require('../../structures/Command');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'lewd',
        description: `Una extraña sensación lasciva recorre todo tu cuerpo..`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['lewd', 'lewd @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {



    let img = await azami.Lewd()

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())
    if(miembro === message.author) return

    if(!miembro){
      message.channel.send({embeds:
        [{color:'RANDOM',
        description: `**${message.author.username}** está teniendo pensamientos impuros. owo`,
        image: {url: img}
      }]})
      } else {
        if(miembro.user.bot) return
        const msg = [`**${message.author.username}** piensa en cosas indecentes por **${miembro.user.username}**.`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds:
        [{color:'RANDOM',
        description: random,
        image: {url: img}
      }]})
    }


      }
};
