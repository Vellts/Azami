const Command = require('../../structures/Command');
const gifs = require('../../models/gifAnime')
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'addanimegif',
        description: `Ingresa nuevos gif de interacciones a la base de datos.`,
        category: 'owner',
        usage: ['<Nombre del comando> <Url del gif> <Nombre del anime>'],
        examples: ['addanimegif angry https://cdn.discordapp.com/attachments/812851463209484308/813183556481581116/bjigbgfhhhz.gif Mikakunin de Shinkoukei'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    if(message.member.roles.cache.has("852362996712734720") || this.client.application?.owner.id === message.author.id || message.author.id === "478701463942463489"){
      let cmd = args[0]
      let link = args[1]
      let name = args.slice(2).join(" ")
      if(name.length > 2048) return message.reply({content: "El nombre no puede ser mayor a 2048 cáracteres,", allowedMentions: { repliedUser: false }})
      if(!link.match(/(https?:\/\/[^\s]+\.(?:gif|)(?:$|[^\s]+))/i)) return message.reply({content: "Ingresa un link adecuado. (Gif)", allowedMentions: { repliedUser: false }})
      if(!cmd || !link || !name) return message.reply({content: "Te ha faltado algunos parametros. Uso adecuado: -addanimegif [Nombre del comando] [Url del gif] [Nombre del anime]. Si quieres más ejemplos usa: -help addanimegif.", allowedMentions: { repliedUser: false }})
      let arr = []
      this.client.commands.filter(x => x.category === 'Interacción').forEach(key => {
        arr.push({
          name: key.name
        })
      })
      //console.log(arr)
      let ae = arr.map(x => x.name)
      //console.log(ae)
      //message.channel.send(`${ae}`)
      if(!ae.includes(cmd.toLowerCase())) return message.reply({content:"Ese comando no está disponible para esta acción.", allowedMentions: {repliedUser: false}})

      const animegifs = await gifs.findOne({ comando: cmd.toLowerCase(), gif: link })
      //let gifanimes = animegifs.gif;
    //  if (typeof(gifanimes) === 'string') gifanimes = gifanimes.split(' ');

      if(!animegifs){
        const newModel = await gifs.create({
          name: name,
          gif: link,
          comando: cmd
        })
        return message.reply({content: `
        > Se ha registrado el anime: ${name}
        > Gif: ${link}
        > Comando: ${cmd}
        `, allowedMentions: { repliedUser: false }})
      } else if (link === animegifs.gif){
        return message.channel.send("nao")
      }
      //console.log(gifanimes)
    }
  }
};
