const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { getReadableTime  }  = require('../../structures/Timer')
const { swap_pages, swap_pages2 } = require(`../../structures/EmbedPaginator`);

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'queue',
        description: 'Mira la lista de canciones que estarán próximas a sonar.',
        category: 'Music',
        usage: [ ''],
        examples: [ 'queue' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    if (this.client.manager.players.get(message.guild.id)) {
      if (message.member.voice.channel.id != this.client.manager.players.get(message.guild.id).voiceChannel) return message.channel.send('notas en voz')
    }

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao');

    const queue = player.queue;
    if (!queue.length) {
      return message.channel.send(`no canciones xde`);
    }
    const { title, requester, duration, uri } = player.queue.current;
    const parsedDuration = getReadableTime(duration);
    const parsedQueueDuration = getReadableTime(player.queue.reduce((prev, curr) => prev + curr.duration, 0) + player.queue.current.duration);

    if(queue.length < 15){
      return message.channel.send(`
      ${queue.length} canciones.
      \nActual: **${title.substr(0, 60)}** - \`${player.queue.current.isStream ? `En vivo` : parsedDuration.split(` | `)[0]}\`\npedida por: ${player.queue.current.requester.username}
      \n${queue.map((track, i) => `**${++i})** **${track.title.substr(0, 60)}** - \`${track.isStream ? `En vivo` : getReadableTime(track.duration).split(` | `)[0]}\`\npedida por: ${track.requester.username}`).join(`\n`)}
      `)
    }
    let quelist = [];
    for (let i = 0; i < queue.length; i += 15) {
      let songs = queue.slice(i, i + 15);
      quelist.push(songs.map((track, index) => `**${i + ++index})** **${track.title.substr(0, 60)}** - \`${track.isStream ? `En vivo` : getReadableTime(track.duration).split(` | `)[0]}\`\npedida por: ${track.requester.username}`).join(`\n`))
    }
    let limit = quelist.length <= 5 ? quelist.length : 5
    let embeds = []
    for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substr(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}  -  [ ${queue.length} canciones ]`, message.guild.iconURL({
            dynamic: true
          }))
          .addField(`**Actual cancion**`, `**${player.queue.current.title.substr(0, 60)}** - \`${player.queue.current.isStream ? `LIVE STREAM` : getReadableTime(player.queue.current.duration).split(` | `)[0]}\`\n*request by: ${player.queue.current.requester.tag}*`)
          .setDescription(desc));
      }
      //return susccess message
      return swap_pages2(this.client, message, embeds)
  }
}