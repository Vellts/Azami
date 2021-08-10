const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = class Avatar extends Command {
    constructor(...args) {
      super(...args, {
        name: 'avatar',
        description: 'Obten el avatar de tu usuario, o bien, el de otro.',
        category: 'Utilidad',
        usage: [ '<usuario opcional>'],
        examples: ['avatar @Azami'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) interaction.reply(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.id == args.join(" ")) || message.author
    let avatar = miembro.displayAvatarURL({dynamic: true, size: 1024, format: 'png' || 'gif'})

    const embed = new MessageEmbed()
        .setTitle(`${lang.mentionAvatarAV.replace('{username}', miembro.username)}`)
        //.setDescription(`[Png](${avatar}) **-** [Jpeg](${miembro.displayAvatarURL({dynamic: true, size: 1024, format: 'jpeg'})}) **-** [Webp](${miembro.displayAvatarURL({dynamic: true, size: 1024, format: 'webp'})})`)
        .setImage(avatar)
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))

    let row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setURL(avatar)
        .setLabel('Link')
        .setStyle('LINK'),
        new MessageButton()
        .setURL(miembro.displayAvatarURL({dynamic: true, size: 1024, format: 'png'}))
        .setLabel('Png')
        .setStyle('LINK'),
        new MessageButton()
        .setURL(miembro.displayAvatarURL({dynamic: true, size: 1024, format: 'jpeg'}))
        .setLabel('Jpeg')
        .setStyle('LINK'),
        new MessageButton()
        .setURL(miembro.displayAvatarURL({dynamic: true, size: 1024, format: 'webp'}))
        .setLabel('Webp')
        .setStyle('LINK'),
    );

    message.reply({embeds: [embed], components: [row], allowedMentions: { repliedUser: false }})
    }
};
