const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'loop',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args, client = message.client) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')
    if (!args[0] || args[0].toLowerCase() == 'song') {
      player.setTrackRepeat(!player.trackRepeat);
      const trackRepeat = player.trackRepeat ? 'habilitada' : 'deshabilitad'
      return message.channel.send('cancion repetida '+ trackRepeat);
    } else if (args[0].toLowerCase() == 'queue') {
      player.setQueueRepeat(!player.queueRepeat);
      const queueRepeat = player.queueRepeat ? 'habilitad' : 'deshabilitad'
      return message.channel.send('queue repetida ' +queueRepeat);
    }

    }
};
