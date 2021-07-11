const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'servericon',
        aliases: ['iconserver'],
        description: 'Obtén el icono del servidor.',
        category: 'Utility',
        usage: [ ''],
        cooldown: 3,
        slash: true,
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    const server = message.guild
    const embed = new MessageEmbed()
    .setTitle(`${lang.titleIconIC.replace('{servername}', message.guild.name)}`)
    .setDescription(`[Link](${server.iconURL({size: 2048, dynamic: true})})`)
    .setImage(server.iconURL({size: 2048, dynamic: true}))
    .setColor("RANDOM");
    message.channel.send({embeds: [embed]})
    }
};
