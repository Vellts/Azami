const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'back',
        description: 'Regresa a una canción anterior, por si la quieres escuchar otra vez.',
        category: 'Music',
        usage: [ ' '],
        examples: [ 'back' ],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const player = this.client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send(`${this.client.emote.badunu} ***No se está reproduciendo ningúna canción en el servidor. u.u***`)

    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send(`${this.client.emote.jumpjump} ***¡Este canal no es el apropiado para manejar mis notas músicales!***`)
    if (player.queue.previous == null) return message.channel.send(`${this.client.emote.interdasting} ***No se ha reproducido una canción previamente.***`);
    message.channel.send(`${this.client.emote.bunnyPompom} ***Cargando canción...***`).then(x => x.deleteTimed({ timeout: 2000 }))
    await this.client.delay(2000)
    player.queue.unshift(player.queue.previous);
    player.stop();
  }
};
