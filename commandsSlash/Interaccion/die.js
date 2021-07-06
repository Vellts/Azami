const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'sigh',
      description: `cachetada unu`,
      guildOnly: true,
      cooldown: 5,
      botPermission: ['MANAGE_GUILD'],
    });
  }

  async run(interaction, guild, args) {

    const author = guild.members.cache.get(interaction.user.id)
    const image = await azami.Die()
    interaction.reply({
      embeds: [
        {
          description: `**${author.user.username}** se cansó de este mundo.`,
          image: { url: image }
        }
      ]
    })
  }
};