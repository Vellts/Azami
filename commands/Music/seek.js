const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { read24hrFormat }  = require('../../structures/Timer')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'seek',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.lineReplyNoMention('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('no voz')
    if (!player.queue.current.isSeekable) return message.channel.send('no puedes en strim')
    if (!args[0]) return message.channel.send('No ingresase el tiempo')

    const time = read24hrFormat((args[0]) ? args[0] : '10');

    if (time > player.queue.current.duration) {
      message.channel.send('invalido '+ new Date(player.queue.current.duration).toISOString().slice(11, 19));
    } else {
      player.seek(time);
      const embed = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription('duracion cambiada a'+ new Date(time).toISOString().slice(14, 19));
      message.channel.send({embeds: [embed]});
    }

    }
};
