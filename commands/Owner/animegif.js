const Command = require('../../structures/Command');
const gifs = require('../../models/gifAnime')
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'animegif',
        description: `Ingresa nuevos gif de interacciones a la base de datos.`,
        category: 'owner',
        usage: ['<Nombre del comando> <Url del gif> <Nombre del anime>'],
        examples: ['addanimegif angry https://cdn.discordapp.com/attachments/812851463209484308/813183556481581116/bjigbgfhhhz.gif Mikakunin de Shinkoukei'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    if(message.member.roles.cache.has("852362996712734720")){
      let option = args[0]
      if(!option) return message.channel.send("Opciones disponibles: `list`, `cmd [Nombre del comando]`")
      if(option.toLowerCase() === 'list'){
        const animegifs = await gifs.find()
        let arr = []
        for (const key of animegifs){
          arr.push({
            anime: key.name,
            gif: key.gif,
            cmd: key.comando
          })
        }
        let a = arr.map(e => `\`${e.cmd}\` **[${e.anime}](${(e.gif)})**`).slice(0, 2048).join("\n")
        message.reply({
          embeds: [
            {
              title: `Lista de gif's por comando.`,
              description: a
            }
          ], allowedMentions: { repliedUser: false }
        })
      } else if (option.toLowerCase() === 'cmd'){
        let name = args[1]
        let data = await gifs.find({ comando: name.toLowerCase() })
        //console.log(data)
        let arr = []
        for(const key of data){
          arr.push({
            anime: key.name,
            gif: key.gif,
            cmd: key.comando
          })
        }
        if(data){
          let a = arr.filter(x => x.cmd === name.toLowerCase()).map(e => `**[${e.anime}](${e.gif})**`).slice(0, 2048).join("\n")
          console.log(a)
          message.reply({
            embeds: [
                {
                  title: `Lista de gif y animes de \`${name.toLowerCase()}\``,
                  description: a
                }
              ], allowedMentions: { repliedUser: false }
            })
        } else {
          message.channel.send("nao")
        }
      }
    }
  }
};
