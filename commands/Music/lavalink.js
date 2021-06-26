const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'stats',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    let msg, memory, cpu,  uptime, playingPlayers, players;
    if (args[0]) {
      if (!this.client.manager.nodes.get(args[0])) return message.channel.send('host invalido');
      msg = await message.channel.send('Getting lavalink stats...'),
      { memory, cpu,  uptime, playingPlayers, players } = this.client.manager.nodes.get(args[0]).stats;
    } else {
      msg = await message.channel.send('Getting lavalink stats...'),
      { memory, cpu,  uptime, playingPlayers, players } = this.client.manager.nodes.first().stats;
    }

    const allocated = Math.floor(memory.allocated / 1024 / 1024),
      used = Math.floor(memory.used / 1024 / 1024),
      free = Math.floor(memory.free / 1024 / 1024),
      reservable = Math.floor(memory.reservable / 1024 / 1024);

    const systemLoad = (cpu.systemLoad * 100).toFixed(2),
      lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(2);

      const embed = new MessageEmbed()
      .setAuthor('autor'+this.client.manager.nodes.get(args[0])?.options.host ?? this.client.manager.nodes.first().options.host )
      .addField(`Escuchando: ${playingPlayers}`, `Players: ${players}`)
      .addField(`Memoria: ${allocated}`, `Usada: ${used}. Free: ${free}. reservable: ${reservable}`)// { ALL: allocated, USED: used, FREE: free, RESERVE: reservable }))
      .addField(`Cpu: ${cpu.cores}`, `System: ${systemLoad} Lavalink: ${lavalinkLoad}`)// { CORES: cpu.cores, SYSLOAD: systemLoad, LVLLOAD: lavalinkLoad }))
      //.addField(`Uptime`,this.clientUptime)
      .setTimestamp(Date.now());
    return msg.edit('', embed);


    
};
}