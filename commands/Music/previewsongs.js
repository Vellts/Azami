const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { getReadableTime  }  = require('../../structures/Timer')
const { swap_pages2 } = require(`../../structures/EmbedPaginator`);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'previewsongs',
      description: 'Obtén la lista de canciones que han sonado antes de la actual.',
      category: 'Music',
      usage: [ ''],
      examples: [ 'previewsongs' ],
      cooldown: 3,
    });
  }

  async run(message, args) {
    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.lineReplyNoMention('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('no voz')
    
    const queue = player.previousTracks
    if(queue.size == 0){
      return message.lineReplyNoMention('nao canciones')
    }

    let quelist = [];
    if(queue.length < 15){
      return message.channel.send(`
      ${queue.length} canciones.
      \n${queue.map((track, i) => `**${++i})** **${track.title.substr(0, 60)}** - \`${getReadableTime(track.duration).split(` | `)[0]}\`\npedida por: ${track.requester.username}`).join(`\n`)}
      `)
    }
    for (let i = 0; i < queue.length; i += 15) {
      let songs = queue.slice(i, i + 15);
      quelist.push(songs.map((track, index) => `**${i + ++index})** **${track.title.substr(0, 60)}** - \`${getReadableTime(track.duration).split(` | `)[0]}\`\npedida por: ${track.requester.username}`).join(`\n`))
    }
    let limit = quelist.length <= 5 ? quelist.length : 5
    let embeds = []
    for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substr(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}  -  [ ${queue.length} canciones ]`, message.guild.iconURL({
            dynamic: true
          }))
          //.addField(`**Actual cancion**`, `**${player.queue.current.title.substr(0, 60)}** - \`${player.queue.current.isStream ? `LIVE STREAM` : getReadableTime(player.queue.current.duration).split(` | `)[0]}\`\n*request by: ${player.queue.current.requester.tag}*`)
          .setDescription(desc));
      }
      //return susccess message
      return swap_pages2(this.client, message, embeds)
  }
};
