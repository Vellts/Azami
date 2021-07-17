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
    if (!player) return message.channel.send(`${this.client.emote.badunu} ***No se está reproduciendo ningúna canción en el servidor. u.u***`)
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.jumpjump} ***¡Este canal no es el apropiado para manejar mis notas músicales!***`)
    
    if (!args[0]) {
      player.setBassboost(!player.bassboost);
      //const msg = await message.channel.send(`bassboost: ${player.bassboost ? 'ON' : 'OFF'}`);
      const embed = new MessageEmbed()
        .setDescription(`${this.client.emote.bunnyBubble} ***Sonido bassboost: ${player.bassboost ? "`Encendido`" : "`Apagado`"}.***`);
      await this.client.delay(2000);
      return message.channel.send({embeds: [embed]});
    }

    if (isNaN(args[0])) return message.channel.send(`${this.client.emote.bunnyPoke} ***¡Bad! No has ingresado un número válido.***`);

    player.setBassboost(parseInt(args[0]) / 10);
    const msg = await message.channel.send(`${this.client.emote.pinkBunny} ***Cargando bassboost a ${args[0]}%...***`);
    await this.client.delay(5000);
    return msg.edit(`${this.client.emote.puppySlap} ***Bassboost ajustado a ${args[0]}% exitosamente.***`);
    }
};
