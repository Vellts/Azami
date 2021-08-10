const Command = require('../../structures/Command');
const azami = require("../../Util/gifInteraction")
/*if(!miembro || miembro.id === message.author.id){
let img = await azami.interactionGif(this.name)
image: {url: img.gif },
footer: { text: `Anime: ${img.name}` }*/
const Discord = require('discord.js')

module.exports = class Pout extends Command {
    constructor(...args) {
      super(...args, {
        name: 'pout',
        description: `Demuestra tu descontento con un puchero. >u<`,
        category: 'Interacción',
        usage: ['<Miembro opcional>'],
        examples: ['pout', 'pout @Nero'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let img = await azami.interactionGif(this.name)

    let miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase())


    if(!miembro || miembro.id === message.author.id){
      message.channel.send({embeds:
        [{color:'RANDOM',
        description: `**${message.author.username}** está haciendo un gran puchero.`,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }]})
      } else {
        const msg = [`**${message.author.username}** le hace un puchero a **${miembro.user.username}**. u//u`]
        let random = msg[Math.floor(Math.random() * msg.length)]
        message.channel.send({embeds:
        [{color:'RANDOM',
        description: random,
        image: {url: img.gif },
        footer: { text: `Anime: ${img.name}` }
      }]})
    }


      }
};
