const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { read24hrFormat }  = require('../../structures/Timer')

module.exports = class Join extends Command {
    constructor(...args) {
      super(...args, {
        name: 'join',
        description: 'Has que ingrese al canal de voz en el que te encuentras actualmente.',
        category: 'Music',
        usage: [ ' '],
        examples: [ 'join' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!message.member.voice.channel.id) return message.channel.send(`${this.client.emote.jumpjump} ***¡Este canal no es el apropiado para manejar mis notas músicales!***`)

    if (message.member.voice.channel.full && !message.member.voice.channel.permissionsFor(message.guild.me).has('MOVE_MEMBERS')) {
      return message.channel.send(`${this.client.emote.bunnyPoke} ***Oops! No he podido ingresar al canal.***`).then(m => m.deleteTimed({ timeout: 10000 }));
    }

    if (!player) {
      try {
        await this.client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: true,
        }).connect();
        message.channel.send(`${this.client.emote.bunnyDance} ***¡Naisu! He ingresado exitosamente al canal de voz.***`);
      } catch (err) {
        if (message.deletable) message.delete();
        console.log(`Ha surgido un error: ${err.message}.`);
        message.channel.send(`${this.client.emote.stars1} ***Ha ocurrido un error al ingresar al canal de voz ¡Ya se ha reportado a la central como una emergencia!***`).then(m => m.deleteTimed({ timeout: 7000 }));
      }
    } else {
      try {
        await player.setVoiceChannel(message.member.voice.channel.id);
        await player.setTextChannel(message.channel.id);
        const embed = new MessageEmbed()
          .setColor(message.member.displayHexColor)
          .setDescription('me han movio\'');
        message.channel.send(`${this.client.emote.bunnyDance} ***Woh woh- Un viaje algo movido. Ahora todas mis reproducciones serán desde \`${message.member.voice.channel.name}\`.***`);
      } catch (err) {
        if (message.deletable) message.delete();
        console.log(`Ha surgido un error: ${err.message}.`);
        message.channel.send(`${this.client.emote.stars1} ***Ha ocurrido un error al ingresar al canal de voz ¡Ya se ha reportado a la central como una emergencia!***`).then(m => m.deleteTimed({ timeout: 7000 }));
      }
    }

    }
};
