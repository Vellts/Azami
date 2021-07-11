const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'resume',
        description: '¿Tenías una canción pausada? Resumela.',
        category: 'Music',
        usage: [ ''],
        examples: [ 'resume' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao nao')

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')
    if (!player.paused) return message.channel.send('no esta pausadaxd')
    player.pause(false);
    return message.channel.send('cancion despausada xde')
    }
};
