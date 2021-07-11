const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'move',
        description: 'Ordena la lista de canciones a tu manera. Haz que suene antes la canción que tú quieras.',
        category: 'Music',
        usage: [ '<Posición actual> <Nueva posición>'],
        examples: [ 'move 21 64' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')

    if (isNaN(args[0])) return message.channel.send('eso no es un numero brou');
    if (args[0] === 0) return message.channel.send('no puedes saltar a la cancion 0 🤨');
    if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0]])) return message.channel.send('no fue encontrada la canción.');

    if (args[0]) {
      const song = player.queue[args[0] - 1];
      player.queue.splice(args[0] );
      //player.queue.splice(0, 0, song);
      return message.channel.send('cancion movida a'+song.title);
    } /*else if (args[1]) {
      if (args[1] == 0) return message.channel.send('no puedes saltar a la cancion 0 🤨');
      if ((args[1] > player.queue.length) || !player.queue[args[1]]) return message.channel.send('no fue encontrada la canción.');
      const song = player.queue[args[0] - 1];
      player.queue.splice(args[0] - 1, 1);
      player.queue.splice(args[1] - 1, 0, song);
      return message.channel.send('cancion movida a '+song.title+' posicion '+args[1]);
    }*/
    }
};
