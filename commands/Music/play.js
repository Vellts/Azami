const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'play',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args, client = message.client) {

    if (!message.member.voice.channel) return message.channel.send({embed:{color: 'RANDOM', description: `No estás en ningún canal de voz.`}});

    const string = args.join(" ")
        if (!string) return message.channel.send(`${client.emote.error} | Ingresa una canción válida.`)
        try {
            client.distube.play(message, string)
        } catch (e) {
            message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
        }


    }
};
