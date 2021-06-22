const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'avatar',
        description: 'Obten el avatar de tu usuario, o bien, el de otro.',
        category: 'Utilidad',
        usage: [ '<usuario opcional>'],
        examples: ['avatar @Azami'],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let miembro = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.id == args.join(" ")) || message.author
    let avatar = miembro.displayAvatarURL({dynamic: true, size: 1024, format: 'png' || 'gif'})

    const embed = new MessageEmbed() 
        .setTitle(`${lang.mentionAvatarAV.replace('{username}', miembro.username)}`)
        .setDescription(`[Link](${avatar})`)
        .setImage(avatar)
        .setColor('RANDOM')
        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
        message.channel.send(embed)  

    }
};
