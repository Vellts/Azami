const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class Slap extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'slap',
        description: `¡Una bofetada, bien merecida la tiene!`,
        options: [
          {
            name: 'usuario',
            description: '¡Abofetea a todos!',
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
            description: `**${author.user.username}** ten una bofetada de mi parte. :c`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        content: `¿Eh? ¿Me intentas dar una bofetada? :(`, ephemeral: true
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** le dió una dura bofetada a **${user.user.username}**. u.u`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } 
  }
};