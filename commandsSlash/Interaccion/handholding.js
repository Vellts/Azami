const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'handholding',
      description: `cachetada unu`,
      options: [
        {
          name: 'usuario',
          description: 'Argumento de prueba',
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
    const image = await azami.Handholding()
    if(user){
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** está tomando la mano de **${user.user.username}**. uwu`,
            image: { url: image }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}**, yo te tomaré la mano...`,
            image: { url: image }
          }
        ]
      })
    }
  }
};