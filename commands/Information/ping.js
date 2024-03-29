const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'ping',
        aliases: ["ping", "latency"],
        description: `Obten la latencia de Azami.`,
        category: 'Information',
        cooldown: 3,
        slash: true,
      });
    }

    async run(message) {


        const msg = await message.channel.send('Pinging...');
        let date = Date.now();
        let ping_db = await new Promise((r, j) => {
          require('mongoose').connection.db.admin().ping((err, result) => (err || !result) ? j(err || result) : r(Date.now() - date))
        });
  
        msg.edit(` \`\`\`js
  Discord API: ${Math.round(this.client.ws.ping)}ms
  Ping Database: ${ping_db}ms\`\`\`
  `);



      }

    async callback(interaction, guild, args){
      const embed = new MessageEmbed()
      .setDescription('a')
      this.client.send(interaction, embed
        )
    }
};