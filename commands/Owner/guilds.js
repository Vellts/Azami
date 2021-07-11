const Command = require('../../structures/Command');
const azami = require('aikoapi')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'guilds',
        description: `Obten los datos de los servidores.`,
        category: 'Owner',
        cooldown: 3,
        ownerOnly: true
      });
    }

    async run(message) {

    const servers = message.client.guilds.cache.array().map(guild => {
      return `\`${guild.id}\` - **${guild.name}** - \`${guild.memberCount}\` members`;
    });

    const embed = new MessageEmbed()
      .setTitle('Server List')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (servers.length <= 10) {
      const range = (servers.length == 1) ? '[1]' : `[1 - ${servers.length}]`;
      message.channel.send(embed.setTitle(`Server List ${range}`).setDescription(servers.join('\n')));
    }


    }
};