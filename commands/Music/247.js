const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class TwentyFourSeven extends Command {
    constructor(...args) {
      super(...args, {
        name: '24/7',
        description: 'Establece el modo 24/7, así no me saldré del canal.',
        category: 'Music',
        usage: [' '],
        examples: ['24/7'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

      const player = this.client.manager.players.get(message.guild.id);

      if (!player) return message.channel.send(`${this.client.emote.badunu} ***No se está reproduciendo ningúna canción en el servidor. u.u***`)
      if(message.channel.id !== player.textChannel || message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.bunnyPoke} ***¡No estás en el mismo canal de voz o este canal no es el apropiado para manejar mis notas músicales!***`)

      if(message.member.voice.channel.permissionsFor(message.member).has(["MANAGE_CHANNELS"]) || message.member.roles.cache.some(x => x.name === 'DJ')){
        player.twentyFourSeven = !player.twentyFourSeven;
        message.channel.send(`${this.client.emote.cuteRabbit} ***Sistema 24/7: ${player.twentyFourSeven ? "`Activado`" : "`Desactivado`"}.***`);
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
              player.twentyFourSeven = !player.twentyFourSeven;
              message.channel.send(`${this.client.emote.cuteRabbit} ***Sistema 24/7: ${player.twentyFourSeven ? "`Activado`" : "`Desactivado`"}.***`);
              collector.stop(true);
            }
          })
          collector.on("end", async () => {
            await msg.edit(`${this.client.emote.bunnyPoke} ***Se ha acabado el tiempo de la votación. La votación tiene una duración máxima de \`30 segundos\`.`)
          })
        } else {
          player.twentyFourSeven = !player.twentyFourSeven;
          message.channel.send(`${this.client.emote.cuteRabbit} ***Sistema 24/7: ${player.twentyFourSeven ? "`Activado`" : "`Desactivado`"}.***`);
        }
      }
    }
};
