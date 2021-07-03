const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { read24hrFormat }  = require('../../structures/Timer')
const lyricsFinder = require('lyrics-finder');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'lyrics',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {
const player = this.client.manager.players.get(message.guild.id);
      if (!player) return message.channel.send('sin queue')
      let lyrics = await lyricsFinder(player.queue.current.title) || "Not Found!";
    message.channel.send(new MessageEmbed()
      .setTitle(player.queue.current.title)
      .setDescription(lyrics.slice(0, 1000))
      .setImage(player.queue.current.thumbnail)
      .setFooter(player.queue.current.author)
      )

    /*let options;
    if (args.length == 0) {
      // Check if a song is playing and use that song
      const player = this.client.manager.players.get(message.guild.id);
      if (!player) return message.channel.send('sin queue')
      options = {
        apiKey: 'q7WRzSBhg4jihFeWEDq0CRbfSm-4G1Pj8odTc1AozePwA7uT7A58EtjeXXynaeOv',
        title: player.queue.current.title,
        artist: '',
        optimizeQuery: true,
      };
    } else {
      // Use the message.args for song search
      options = {
        apiKey: 'q7WRzSBhg4jihFeWEDq0CRbfSm-4G1Pj8odTc1AozePwA7uT7A58EtjeXXynaeOv',
        title: args.join(' '),
        artist: '',
        optimizeQuery: true,
      };
    }

    const info = await getSong(options);
    if (!info || !info.lyrics) {
      return message.channel.send('nao lyrics')
    }

    for(let i = 0; i < info.lyrics.length; i += 2000) {
    const toSend = lyrics.substring(i, Math.min(info.lyrics.length, i + 2000));
        const message_embed1 = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Lyrics de ${options.title}`)
            .setDescription(toSend)
        message.channel.send(message_embed1)
    }
*/

    }
};