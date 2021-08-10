const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Punch extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'punch',
      description: `¡Propina un fuerte golpe! Que nadie se salve.`,
      options: [
        {
          name: 'usuario',
          description: 'Pobre del que reciba el golpe. u.u',
          type: 'USER',
          required: true,
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
    if(user.id === author.id) return interaction.reply({content: "¿Que quieres hacer? O.o", ephemeral: true})
    if(user.id === this.client.user.id) return interaction.reply({content: "¡Nono! ***Corre***.", ephemeral: true})
    interaction.reply({
      embeds: [
        {
          description: `**${author.user.username}** ha dejado sin oportunidades a **${user.user.username}**. D:`,
          image: {url: img.gif },
          footer: { text: `Anime: ${img.name}` }
        }
      ]
    })
  }
};