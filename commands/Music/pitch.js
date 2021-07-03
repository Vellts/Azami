const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'pitch',
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
    if(args[0] && (args[0].toLowerCase() === 'default' || args[0].toLowerCase() === 'off')){
      player.resetFilter()
      const msg = await message.channel.send('pitch apagandoB)')
      const embed = new MessageEmbed()
      .setDescription('pitch resetiao')
      await this.client.delay(5000)
      return msg.edit({content: ' ', embeds: [embed]})
    }

    if(isNaN(args[0])) return message.channel.send('debe ser un numero:/')
    if(args[0] < 0 || args[0] > 10) return message.channel.send('1-10')
    player.setFilter({ timescale: { pitch: args[0] }})
    const msg = await message.channel.send('pitch encendiendo')
    const embed = new MessageEmbed()
      .setDescription('pitch encendio')
    await this.client.delay(5000)
    return msg.edit({content: ' ', embeds: [embed]})
  }
};
