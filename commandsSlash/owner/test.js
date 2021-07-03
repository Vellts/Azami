const SlashCommand = require('../../structures/SlashCommand');
const config = require('../../config.json');

module.exports = class extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'test',
        description: `Comando de testeo B)`,
        options: [{
        name: 'wea',
        type: 'STRING',
        description: 'wea descp',
        required: true,
        choices: [
          {
            name: 'wea 1',
            value: 'cosa 1',
          },
          {
            name: 'wea 2',
            value: 'cosa 2',
          },
          {
            name: 'wea 3',
            value: 'cosa 3',
          },
        ],
      }],
      });
    }

    async run(interaction) {

    interaction.reply({content: 'a'})


  }
};