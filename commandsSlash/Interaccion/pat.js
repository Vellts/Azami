const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Pat extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'pat',
      description: `Una pequeña caricia para alguién más. :3`,
      options: [
        {
          name: 'usuario',
          description: 'Un poco de cariño para otros. uwu',
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
            description: `**${author.user.username}** ten una caricia de mi parte. uwu`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `¡Gracias, **${author.user.username}**! uwu`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${user.user.username}** recibe cariño por parte de **${author.user.username}**. uwu`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};