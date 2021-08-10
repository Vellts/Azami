const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Blush extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'blush',
      description: `¡Uy! Que ha pasado...`,
      options: [
        {
          name: 'usuario',
          description: 'Demuestra tu sonrojo con alguien más. owo',
          type: 'USER',
          required: false,
        },
      ],
      guildOnly: true,
      cooldown: 5,
      botPermission: ['MANAGE_GUILD'],
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
            description: `El color rojo inunda el rostro de **${author.user.username}**. >n<`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** algo rojo ronda por aquí...`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** se encuentra como un tomate por **${user.user.username}**. >n<`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};