const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'bite',
      description: `Muerde al que quieras, sin piedad.`,
      options: [
        {
          name: 'usuario',
          description: 'Menciona al que se merece una mordida.',
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
            description: `Yo te daré una mordida... **${author.user.username}**. >u<`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `¡**${author.user.username}**, no me muerdas más! >.<`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** le dió una mordida a **${user.user.username}**. >n<`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};