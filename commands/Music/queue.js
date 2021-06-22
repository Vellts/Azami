const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'queue',
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

    const queue = this.client.distube.getQueue(message)
    message.lineReply('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));


    }
};
