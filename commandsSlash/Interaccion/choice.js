const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'choice',
      description: `Sintaxis: [Elección1] / [Elección2]`,
      options: [
        {
          name: 'choice',
          description: 'Sintaxis: [Elección1] / [Elección2]',
          type: 'STRING',
          required: false,
        },
      ],
      guildOnly: true,
      cooldown: 5,
      botPermission: ['MANAGE_GUILD'],
    });
  }

  async run(interaction, guild, args) {

    const choce = args.get('choice')?.value.split(' / ');
    const txt1 = choce[0]
    const txt2 = choce[1]
    if(!txt1 || !txt2) return interaction.reply({content: 'nao nao amigo', ephemeral: true})
    const author = guild.members.cache.get(interaction.user.id)
    const rndm = choce[Math.floor(Math.random() * choce.length)]
    /*const txt1 = choce[0]
    const txt2 = choce[1]*/
    interaction.reply(`Elijo: ${rndm}`)
  }
};