const SlashCommand = require('../../structures/SlashCommand');
const { MessageEmbed } = require('discord.js')

module.exports = class extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'efe',
        description: 'x.',
      });
    }

    async run(interaction) {

    interaction.reply({content: 'Adivina.'})

    }
};