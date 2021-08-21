const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js')
const animeList = require('../../models/animelist')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'addanime',
        description: `Obten los datos de los servidores.`,
        category: 'Owner',
        cooldown: 3,
        ownerOnly: true
      });
    }

    async run(message, args) {

    let type = args[0]
    if(!type) return message.lineReplyNoMention('ingresa add o remove.')

    switch(type){
      case 'add':
      let url = args[1]
      let anime = args.slice(2).join(" ").toLowerCase()
      let data = await animeList.findOne({ anime: anime })
      if(data){
        return message.lineReplyNoMention(`Anime ya agregado.`)
      } else {
        let newAnime = await new animeList({ anime: anime, image: url })
        newAnime.save().catch(e => console.error(e))
        message.lineReplyNoMention('Nuevo anime agregado a la lista.')
      }
      break;
      case 'remove':
      message.lineReplyNoMention('why')
      break;
    }
  }
};