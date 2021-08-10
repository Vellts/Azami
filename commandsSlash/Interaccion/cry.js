const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'cry',
      description: `Expresa tu llanto con los demás.`,
      options: [
        {
          name: 'usuario',
          description: 'Expresate con alguién más. :3',
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
            description: `**${author.user.username}** ha soltado unas lagrimas... :(`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `¡No llores por mi, **${author.user.username}**! D:`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** llora junto con **${user.user.username}**. u.u`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};