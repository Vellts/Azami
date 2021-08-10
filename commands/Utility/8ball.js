const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class Ochoball extends Command {
    constructor(...args) {
      super(...args, {
        name: '8ball',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
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

    let respuestas = lang.res8B

    let aleatorio = respuestas[Math.round(Math.random() * (respuestas.length - 1))];

    let mensaje = args.slice().join(" ")
    if (!mensaje) return message.channel.send(`${this.client.emote.rabbitConfused} ${lang.missAsk8B}`)
    if(!mensaje.endsWith("?")) return

    const embed = new MessageEmbed()
    .setTitle(`Pregunta de ${message.author.username}`)
    .setColor('RANDOM')
    .addField(lang.ask8B, `${mensaje}`)
    .addField(lang.botRes8B, aleatorio)
    .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setTimestamp()

    message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})

    }
};
