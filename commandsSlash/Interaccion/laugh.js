const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Laugh extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'laugh',
      description: `Ríete de algo, o de alguien.`,
      options: [
        {
          name: 'usuario',
          description: '¡Burlate, con toda!',
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
            description: `**${author.user.username}** parece que se ríe de algo... o alguien.`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `¡Eso estuvo gracioso, **${author.user.username}**!`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** se está riendo de **${user.user.username}**.`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};