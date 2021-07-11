const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { read24hrFormat }  = require('../../structures/Timer')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'bassboost',
        description: 'Activa el filtro bassboost, y pon a retumbar esos bajos. Ajua.',
        category: 'Music',
        usage: [ '<Cantidad>'],
        examples: [ 'bassboost', 'bassboost 50' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.lineReplyNoMention('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('no voz')
    
    if (!args[0]) {
      player.setBassboost(!player.bassboost);
      const msg = await message.channel.send(`bassboost: ${player.bassboost ? 'ON' : 'OFF'}`);
      const embed = new MessageEmbed()
        .setDescription(`aea ${player.bassboost ? 'on' : 'off'}`);
      //await bot.delay(5000);
      return msg.edit({embeds: [embed]});
    }

    // Make sure value is a number
    if (isNaN(args[0])) return message.channel.send('ingresa un numero');

    // Turn on bassboost with custom value
    player.setBassboost(parseInt(args[0]) / 10);
    const msg = await message.channel.send('colocando bassboost '+args[0]);
    const embed = new MessageEmbed()
      .setDescription('colocado a '+args[0]);
    //await bot.delay(5000);
    return msg.edit({embeds: [embed]});

    }
};
