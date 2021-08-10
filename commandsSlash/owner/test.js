const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../Util/gifInteraction")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'characterchoice',
        description: `¿Te molesta alguien? Esta emoción es perfecta para la ocasión.`,
        options: [
          {
            name: 'prueba1',
            description: 'xd',
            type: 'STRING',
            choices: [
              {
                name: "Mago",
                value: "mage"
              },
              {
                name: "Guerrero",
                value: "warrior"
              },
              {
                name: "Curandero",
                value: "healer"
              }
            ],
            required: true,
          },
        ],
        guildOnly: true,
        cooldown: 5,
      });
    }

    async run(interaction, guild, args) {
    const lel = interaction.options.data[0].value
    //console.log(lel)
    switch(lel){
      case 'mage':
        interaction.reply("Has elegido la magia.")
      break;
      case 'warrior':
        interaction.reply("Has elegido la espada.")
      break;
      case 'healer':
        interaction.reply("Has elegido sanar.")
      break;
    }
  }
};