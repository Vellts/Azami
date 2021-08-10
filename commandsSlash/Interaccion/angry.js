const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'angry',
        description: `¿Te molesta alguien? Esta emoción es perfecta para la ocasión.`,
        options: [
          {
            name: 'usuario',
            description: 'Menciona al miembro que te provocó enfado.',
            type: 'USER',
            required: false,
          },
        ],
        guildOnly: true,
        cooldown: 5,
      });
    }

    async run(interaction, guild, args) {
      //const user = guild.members.cache.get(args.get('prueba')?.value ?? interaction.user.id);
    const user = guild.members.cache.get(args.get('usuario')?.value);
    const author = guild.members.cache.get(interaction.user.id)
    let img = await azami.interactionGif(this.name)
    if(!user || user.id === author.id){
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** por algún motivo se molestó. D:`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      }) 
    } else if(user.id === this.client.user.id){
      interaction.reply({
        embeds: [
          {
            description: `¡Eh! No he hecho nada, **${author.user.username}**. u.u`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** no está de buen humor con **${user.user.username}**. :c`,
            image: {url: img.gif },
            footer: { text: `Anime: ${img.name}` }
          }
        ]
      })
    }
  }
};