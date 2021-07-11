const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { read24hrFormat }  = require('../../structures/Timer')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'nightcore',
        description: 'Agregale un filtro para que tus canciones favoritas se escuchen al doble de velocidad.',
        category: 'Music',
        usage: [ ''],
        examples: [ 'nightcore' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.lineReplyNoMention('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('no voz')
    
      player.setNightcore(!player.nightcore);
      const msg = await message.channel.send(`nightcore : ${player.nightcore ? 'ON' : 'OFF'}`);
      const embed = new MessageEmbed()
        .setDescription(`aea ${player.nightcore ? 'on' : 'off'}`);
      this.client.delay(5000);
    if (player.nightcore) player.speed = 4;
    return msg.edit({embeds: [embed]});
    }
};
