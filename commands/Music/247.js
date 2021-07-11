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
    if (!player) return message.channel.send('nao')

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('nao voz')
    player.twentyFourSeven = !player.twentyFourSeven;
    message.channel.send('27/4🤑 '+ player.twentyFourSeven);

    }
};
