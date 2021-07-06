const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'bite',
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
    const image = await azami.Bite()
    if(user){
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** le dió una mordida a **${user.user.username}** >n<`,
            image: { url: image }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `Yo te daré una mordida... **${author.user.username}**. >u<`,
            image: { url: image }
          }
        ]
      })
    }
  }
};