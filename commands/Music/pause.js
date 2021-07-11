const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'pause',
        description: 'Pausa la canción que te encuentras escuchando al momento, y vuelve a reproducirla cuando quieras.',
        category: 'Music',
        usage: [ ''],
        examples: [ 'pause' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao nao')

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')
    if (player.paused) return message.channel.send('ya esta pausadaxd')
    player.pause(true);
    return message.channel.send('cancion pausada xde')
    }
};
