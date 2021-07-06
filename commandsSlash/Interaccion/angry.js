const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'angry',
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
      //const user = guild.members.cache.get(args.get('prueba')?.value ?? interaction.user.id);
      const user = guild.members.cache.get(args.get('usuario')?.value);
      const author = guild.members.cache.get(interaction.user.id)
      const image = await azami.Angry()
      if(!user){
        interaction.reply({
          embeds: [
            {
              description: `**${author.user.username}** por algún motivo está furioso/a. D:`,
              image: {url: image}
            }
          ]
        })
      } else {
      interaction.reply({
        embeds: [
          {
            description: `**${author.user.username}** está muy molesto/a con **${user.user.username}**`,
            image: { url: image }
          }
        ]
        /*embeds: [
          new Discord.MessageEmbed()
          .setDescription(`**${author.user.username}** le dió una dura bofetada a **${user.user.username}**`)
          .setImage(slap)
        ]*/
      })
    }  
  }
};