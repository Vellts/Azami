const Event = require('../../structures/Event');
const Discord = require('discord.js');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Event {

  async run(guild) {
  
    //console.log(`--| I just joined ${guild.name} |--`)
    this.client.channels.cache.get('856720235364483123').send(`¡He ingresado a un nuevo servidor llamado \`${guild.name}\`!`)

    const newGuild = await Guild.create({
      guildId: guild.id,
    })
    


    
  }
};