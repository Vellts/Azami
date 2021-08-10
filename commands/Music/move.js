const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class Move extends Command {
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

      if (!player) return message.channel.send(`${this.client.emote.badunu} ***No se está reproduciendo ningúna canción en el servidor. u.u***`)
      if(message.channel.id !== player.textChannel || message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.bunnyPoke} ***¡No estás en el mismo canal de voz o este canal no es el apropiado para manejar mis notas músicales!***`)

      if(message.member.voice.channel.permissionsFor(message.member).has(["MANAGE_CHANNELS"]) || message.member.roles.cache.some(x => x.name === 'DJ')){
        if (isNaN(args[0])) return message.channel.send(`${this.client.emote.interdasting} ***¡Ingresa un número! u.u***`);
        if (args[0] === 0) return message.channel.send(`${this.client.emote.interdasting} ***¿Por qué intentas mover la canción a la posición 0? D:`)
        if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0]])) return message.channel.send(`${this.client.emote.bunnyBubble} ***¡Algo ha sucedido mal! No he encontrado la canción en la cola de reproducción. Asegurate se haber escrito bien la posición.***`);

        if (!args[1]) {
          const song = player.queue[args[0] - 1];
          player.queue.splice(args[0] - 1, 1);
          player.queue.splice(0, 0, song);
          return message.channel.send('cancion movida a'+song.title);
        } else if (args[1]) {
          if (args[1] == 0) return message.channel.send(`${this.client.emote.interdasting} ***¿Por qué intentas mover la canción a la posición 0? D:`);
          if ((args[1] > player.queue.length) || !player.queue[args[1]]) return message.channel.send(`${this.client.emote.bunnyBubble} ***¡Algo ha sucedido mal! No he encontrado la canción en la cola de reproducción. Asegurate se haber escrito bien la posición.***`);
          const song = player.queue[args[0] - 1];
          player.queue.splice(args[0] - 1, 1);
          player.queue.splice(args[1] - 1, 0, song);
          return message.channel.send(`${this.client.emote.bunnyRainbow} La canción \`${song.title}\` fue movida a la posición \`${args[1]}\``)//'cancion movida a '+song.title+' posicion '+args[1]);
        }
      } else {
        const voice = message.member.voice.channel
        const members = voice.members.filter(x => !x.user.bot)

        if(members.size > 1){
          let msg = await message.channel.send('¿Quieren mover de posición las canciones?')
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
              if (args[0]) {
                const song = player.queue[args[0] - 1];
                player.queue.splice(args[0] );
                //player.queue.splice(0, 0, song);
                return message.channel.send('cancion movida a'+song.title);
              } else if (args[1]) {
                if (args[1] == 0) return message.channel.send('no puedes saltar a la cancion 0 🤨');
                if ((args[1] > player.queue.length) || !player.queue[args[1]]) return message.channel.send('no fue encontrada la canción.');
                const song = player.queue[args[0] - 1];
                player.queue.splice(args[0] - 1, 1);
                player.queue.splice(args[1] - 1, 0, song);
                return message.channel.send('cancion movida a '+song.title+' posicion '+args[1]);
              }
              collector.stop(true)
            }
          })
          collector.on("end", async () => {
            await msg.edit(`${this.client.emote.bunnyPoke} ***Se ha acabado el tiempo de la votación. La votación tiene una duración máxima de \`30 segundos\`.`)
          })
        } else {
          if (args[0]) {
            const song = player.queue[args[0] - 1];
            player.queue.splice(args[0] );
            //player.queue.splice(0, 0, song);
            return message.channel.send('cancion movida a'+song.title);
          } else if (args[1]) {
            if (args[1] == 0) return message.channel.send('no puedes saltar a la cancion 0 🤨');
            if ((args[1] > player.queue.length) || !player.queue[args[1]]) return message.channel.send('no fue encontrada la canción.');
            const song = player.queue[args[0] - 1];
            player.queue.splice(args[0] - 1, 1);
            player.queue.splice(args[1] - 1, 0, song);
            return message.channel.send('cancion movida a '+song.title+' posicion '+args[1]);
          }
        }
      }

    /*const player = this.client.manager.players.get(message.guild.id);
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
