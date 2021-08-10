const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Scared extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'scared',
        description: `Un susto inesperado... que será.`,
        options: [
          {
            name: 'usuario',
            description: '¡Booh!',
            type: 'USER',
            required: false,
          },
        ],
        guildOnly: true,
        cooldown: 5,
      });
    }

    async run(interaction, guild, args) {
    const user = guild.members.cache.get(args.get('usuario')?.value);
    const author = guild.members.cache.get(interaction.user.id)
    let img = await azami.interactionGif(this.name)
    if(!user || user.id === author.id){
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** está con muchos nervios...`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `¡Yo no estoy nerviosa, tú lo estas, **${author.user.username}**. u.u`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** teme mucho de **${user.user.username}**. u.u`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};