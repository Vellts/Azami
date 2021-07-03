const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { read24hrFormat }  = require('../../structures/Timer')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'join',
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
    //if (!player) return message.lineReplyNoMention('nao')
    if (!message.member.voice.channel.id) return message.channel.send('no voz')
    
    if (message.member.voice.channel.full && !message.member.voice.channel.permissionsFor(message.guild.me).has('MOVE_MEMBERS')) {
      return message.channel.send('no puedoxde').then(m => m.timedDelete({ timeout: 10000 }));
    }

    if (!player) {
      try {
        await this.client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: true,
        }).connect();
        const embed = new MessageEmbed()
          .setColor(message.member.displayHexColor)
          .setDescription('he entrao');
        message.channel.send({embeds: [mbed]});
      } catch (err) {
        if (message.deletable) message.delete();
        console.log(`Command has error: ${err.message}.`);
        message.channel.send('ha ocurrido un error'+err.message).then(m => m.timedDelete({ timeout: 5000 }));
      }
    } else {
      // Move the bot to the new voice channel / update text channel
      try {
        await player.setVoiceChannel(message.member.voice.channel.id);
        await player.setTextChannel(message.channel.id);
        const embed = new MessageEmbed()
          .setColor(message.member.displayHexColor)
          .setDescription('me han movio\'');
        message.channel.send({embeds: [mbed]});
      } catch (err) {
        if (message.deletable) message.delete();
        console.log(`Command has error: ${err.message}.`);
        message.channel.send('error xd'+ err.message).then(m => m.timedDelete({ timeout: 5000 }));
      }
    }

    }
};
