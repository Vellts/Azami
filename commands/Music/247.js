const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
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

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.jumpjump} ***¡Este canal no es el apropiado para manejar mis notas músicales!***`)
    player.twentyFourSeven = !player.twentyFourSeven;
    message.channel.send(`${this.client.emote.cuteRabbit} ***Sistema 24/7: ${player.twentyFourSeven ? "`Activado`" : "`Desactivado`"}.***`);

    }
};
