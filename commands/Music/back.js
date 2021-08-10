const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class Back extends Command {
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

      if (!player) return message.channel.send(`${this.client.emote.badunu} ***No se está reproduciendo ningúna canción en el servidor. u.u***`)
      if(message.channel.id !== player.textChannel || message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.bunnyPoke} ***¡No estás en el mismo canal de voz o este canal no es el apropiado para manejar mis notas músicales!***`)
      if (player.queue.previous == null) return message.channel.send(`${this.client.emote.interdasting} ***No se ha reproducido una canción previamente.***`);

      if(message.member.voice.channel.permissionsFor(message.member).has(["MANAGE_CHANNELS"]) || message.member.roles.cache.some(x => x.name === 'DJ')){
        message.channel.send(`${this.client.emote.bunnyPompom} ***Cargando canción...***`).then(x => x.deleteTimed({ timeout: 2000 }))
        await this.client.delay(2000)
        player.queue.unshift(player.queue.previous);
        player.stop();
      } else {
        const voice = message.member.voice.channel
        const members = voice.members.filter(x => !x.user.bot)

        if(members.size > 1){
          let msg = await message.channel.send('¿Quieren regresar a la canción anterior?')
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
              message.channel.send(`${this.client.emote.bunnyPompom} ***Cargando canción...***`).then(x => x.deleteTimed({ timeout: 2000 }))
              await this.client.delay(2000)
              player.queue.unshift(player.queue.previous);
              player.stop();
              collector.stop(true);
            }
          })
          collector.on("end", async () => {
            await msg.edit(`${this.client.emote.bunnyPoke} ***Se ha acabado el tiempo de la votación. La votación tiene una duración máxima de \`30 segundos\`.`)
          })
        } else {
          message.channel.send(`${this.client.emote.bunnyPompom} ***Cargando canción...***`).then(x => x.deleteTimed({ timeout: 2000 }))
          await this.client.delay(2000)
          player.queue.unshift(player.queue.previous);
          player.stop();
        }
      }

    /*const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send(`${this.client.emote.badunu} ***No se está reproduciendo ningúna canción en el servidor. u.u***`)

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.jumpjump} ***¡Este canal no es el apropiado para manejar mis notas músicales!***`)
    message.channel.send(`${this.client.emote.bunnyPompom} ***Cargando canción...***`).then(x => x.deleteTimed({ timeout: 2000 }))
    await this.client.delay(2000)
    player.queue.unshift(player.queue.previous);
    player.stop();*/
  }
};
