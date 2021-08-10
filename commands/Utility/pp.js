const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'pp',
        aliases: ['penisize'],
        description: 'Calcula el tamaño de tu miembro, o el de alguien más.',
        category: 'Utilidad',
        usage: [ '<usuario opcional>'],
        examples: ['pp @Azami'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let mention = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.id == args.join(" ")) || message.author
    let cantidad = Math.floor(Math.random() * 12)
    let size = "=".repeat(cantidad)

    message.reply({embeds: [new MessageEmbed()
        .setTitle(`${lang.sizePP.replace('{member}', mention.username)} :banana:`)
        .setDescription(`8${size}D`)
        .setFooter(`${message.author.username}`)
        .setTimestamp()
        ], allowedMentions: { repliedUser: false }
      }
    )

    }
};
