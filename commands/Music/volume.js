const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'volume',
      description: 'Ajusta el volumen a tú gusto, con un limite de 200 gratuitamente.',
      category: 'Music',
      usage: [ '<Cantidad>'],
      examples: [ 'volume 160', 'volume 600' ],
      cooldown: 3,
    });
  }

  async run(message, args) {
    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.lineReplyNoMention('nao')
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('no voz')
    
    if(!args[0]) return message.channel.send('volumen actual '+player.volume)
    if(Number(args[0]) <= 0 || Number(args[0]) >= 1000) return message.channel.send('malB(')
    player.setVolume(Number(args))
    return message.channel.send('volumen setiado a '+player.volume)
  }
};
