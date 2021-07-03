const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'back',
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
    if (!player) return message.channel.send('nao nao')

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')
    if (player.queue.previous == null) return message.channel.send('sin cancion previa');
    player.queue.unshift(player.queue.previous);
    player.stop();
    }

    async callback(interaction, guild, args) {
      console.log('asdasdasd')
  }
};
