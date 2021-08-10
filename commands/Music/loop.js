const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class Loop extends Command {
    constructor(...args) {
      super(...args, {
        name: 'loop',
        description: 'Tú canción favorita, o bien tu lista de canciones favoritas en un loop infinito. Disfrutalo gratuitamente.',
        category: 'Music',
        usage: [ '<queue/song>'],
        examples: [ 'loop queue', 'loop song' ],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const player = this.client.manager.players.get(message.guild.id);

    if (!player) return message.channel.send(`${this.client.emote.badunu} ***No se está reproduciendo ningúna canción en el servidor. u.u***`)
    if(message.channel.id !== player.textChannel || message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.bunnyPoke} ***¡No estás en el mismo canal de voz o este canal no es el apropiado para manejar mis notas músicales!***`)

    if(message.member.voice.channel.permissionsFor(message.member).has(["MANAGE_CHANNELS"]) || message.member.roles.cache.some(x => x.name === 'DJ')){
      let queue = player.queue
      if (!args[0] || args[0].toLowerCase() == 'song') {
        player.setTrackRepeat(!player.trackRepeat);
        return message.channel.send(`${this.client.emote.bunnyPompom} ***${player.trackRepeat ? `Ahora se repetirá la cancion \`${queue.current.title}\`` : `La canción \`${queue.current.title}\` ya no se repetirá`}.***`)//   'cancion repetida '+ trackRepeat);
      } else if (args[0].toLowerCase() == 'queue') {
        player.setQueueRepeat(!player.queueRepeat);
        return message.channel.send(`${this.client.emote.bunnyPompom} ***${player.queueRepeat ? `Ahora se repetirá \`${queue.length}\` canciones` : `Ya no se repetirán \`${queue.length}\` canciones`}.***`);
      }
    } else {
      const voice = message.member.voice.channel
      const members = voice.members.filter(x => !x.user.bot)

      if(members.size > 1){
        let msg = await message.channel.send('¿Quieren que la canción se reproduzca infinitamente?')
        await msg.react("👍")
        const maxVotes = Math.floor(members.size/2)

        const filter = (reaction, user) => {
          const member = message.guild.members.cache.get(user.id);
          const voiceChannel = member.voice.channel;
          if(voiceChannel){
            return voiceChannel.id === voice.id;
          }
        }

        const collector = await msg.createReactionCollector(filter, { time: 30000 })

        collector.on("collect", async (reaction) => {
          const voteCount = reaction.count-1;
          if(voteCount > maxVotes){
            let queue = player.queue
            if (!args[0] || args[0].toLowerCase() == 'song') {
              player.setTrackRepeat(!player.trackRepeat);
              message.channel.send(`${this.client.emote.bunnyPompom} ***${player.trackRepeat ? `Ahora se repetirá la canción \`${queue.current.title}\`` : `La canción \`${queue.current.title}\` ya no se repetirá`}.***`)//   'cancion repetida '+ trackRepeat);
              collector.stop(true);
            } else if (args[0].toLowerCase() == 'queue') {
              player.setQueueRepeat(!player.queueRepeat);
              message.channel.send(`${this.client.emote.bunnyPompom} ***${player.queueRepeat ? `Ahora se repetirá \`${queue.length}\` canciones` : `Ya no se repetirán \`${queue.length}\` canciones`}.***`);
              collector.stop(true);
            }
          }
        })
        collector.on("end", async () => {
          await msg.edit(`${this.client.emote.bunnyPoke} ***Se ha acabado el tiempo de la votación. La votación tiene una duración máxima de \`30 segundos\`.`)
        })
      } else {
        let queue = player.queue
        if (!args[0] || args[0].toLowerCase() == 'song') {
          player.setTrackRepeat(!player.trackRepeat);
          return message.channel.send(`${this.client.emote.bunnyPompom} ***${player.trackRepeat ? `Ahora se repetirá la canción \`${queue.current.title}\`` : `La canción \`${queue.current.title}\` ya no se repetirá`}.***`)
        } else if (args[0].toLowerCase() == 'queue') {
          player.setQueueRepeat(!player.queueRepeat);
          return message.channel.send(`${this.client.emote.bunnyPompom} ***${player.queueRepeat ? `Ahora se repetirá \`${queue.length}\` canciones` : `Ya no se repetirán \`${queue.length}\` canciones`}.***`);
        }
      }
    }
  }
};
