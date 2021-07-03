const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'stop',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')
    player.destroy();
    return message.channel.send('cola parada 😳')

    }
};
