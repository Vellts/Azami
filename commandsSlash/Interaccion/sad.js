const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Sad extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'sad',
      description: `¡Ouh! Hoy no fue un gran día.`,
      guildOnly: true,
      cooldown: 5,
    });
  }

  async run(interaction, guild, args) {
    const author = guild.members.cache.get(interaction.user.id)
    let img = await azami.interactionGif(this.name)
    interaction.reply({
      embeds: [
        {
          description: `**${author.user.username}** no se encuentra con animos. :(`,
          image: {url: img.gif },
          footer: { text: `Anime: ${img.name}` }
        }
      ]
    })
  }
};