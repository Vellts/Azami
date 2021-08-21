const SlashCommand = require('../../structures/SlashCommand');

module.exports = class extends SlashCommand {
    constructor(...args) {
      super(...args, {
        name: 'prueba',
        description: `Obten la latencia de Azami.`,
      });
    }

    async run(interaction) {

      interaction.reply({content: `
        B)
      `})
        /*let date = Date.now();
        let ping_db = await new Promise((r, j) => {
          require('mongoose').connection.db.admin().ping((err, result) => (err || !result) ? j(err || result) : r(Date.now() - date))
        });
  
        interaction.reply(` \`\`\`js
  Discord API: ${Math.floor(this.client.ws.ping)}ms
  Ping Database: ${ping_db}ms\`\`\`
  `);*/



      }
};