const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'servericon',
        aliases: ['iconserver'],
        description: 'Obtén el icono del servidor.',
        category: 'Utilidad',
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
    //.setDescription(`[Link](${server.iconURL({size: 2048, dynamic: true})}) **-** [Png](${server.iconURL({size: 2048, format: 'png'})}) **-** [Jpeg](${server.iconURL({size: 2048, format: 'jpeg'})}) **-** [Webp](${server.iconURL({size: 2048, format: 'webp'})})`)
    .setImage(server.iconURL({size: 2048, dynamic: true}))
    .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setTimestamp()
    .setColor("RANDOM");
    let row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setURL(server.iconURL({size: 2048, dynamic: true}))
        .setLabel('Link')
        .setStyle('LINK'),
        new MessageButton()
        .setURL(server.iconURL({size: 2048, format: 'png'}))
        .setLabel('Png')
        .setStyle('LINK'),
        new MessageButton()
        .setURL(server.iconURL({size: 2048, format: 'jpeg'}))
        .setLabel('Jpeg')
        .setStyle('LINK'),
        new MessageButton()
        .setURL(server.iconURL({size: 2048, format: 'webp'}))
        .setLabel('Webp')
        .setStyle('LINK'),
    );
    message.reply({embeds: [embed], components: [row], allowedMentions: { repliedUser: false }})
    }
};
