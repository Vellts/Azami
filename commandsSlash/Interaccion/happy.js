const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Happy extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'happy',
      description: `¡Muestra tu felicidad con todo el mundo!`,
      options: [
        {
          name: 'usuario',
          description: '¡Alegrate con alguien más!',
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
            description: `**${author.user.username}** se encuentra muy feliz. n.n`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `Me parece maravilloso que estés feliz, **${author.user.username}**. n.n`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** está muy alegre por **${user.user.username}**. :3`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};