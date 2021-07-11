const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'skip',
        description: 'Salta la canción que estás escuchando.',
        category: 'Music',
        usage: [ '<Número de canciones opcionales)'],
        examples: [ 'skip', 'skip 10' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args, client = message.client) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao')

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')

    if (!isNaN(args[0]) && args[0] < player.queue.length) {
      player.stop(parseInt(args[0]));
    } else {
      player.stop();
    }

    }
};
