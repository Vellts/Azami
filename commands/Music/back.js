const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'back',
        description: 'Regresa a una canción anterior, por si la quieres escuchar otra vez.',
        category: 'Music',
        usage: [ ' '],
        examples: [ 'back' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao nao')

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')
    if (player.queue.previous == null) return message.channel.send('sin cancion previa');
    player.queue.unshift(player.queue.previous);
    player.stop();
    }

    async callback(interaction, guild, args) {
      console.log('asdasdasd')
  }
};
