const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const frases = require('../../database/json/frases')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'topics',
        aliases: ['topic'],
        description: 'Un buen comando para dar tema de conversación en tu servidor.',
        category: 'Utilidad',
        usage: [''],
        cooldown: 3,
      });
    }

    async run(message) {

    const mathRandom = (number) => ~~(Math.random() * number);

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let frase = frases[mathRandom(frases.length)]

    message.lineReplyNoMention(new MessageEmbed()
        .setTitle(`${lang.randomTopicRT} **${message.guild.name}**`)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        .setDescription(`${frase}`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL())
        .setTimestamp()
    )

    }
};
