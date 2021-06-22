const Event = require('../../structures/Event');
const Discord = require('discord.js');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Event {

  async run(guild) {
  
    console.log(`--| I just joined ${guild.name} |--`)

    const newGuild = await Guild.create({
      guildId: guild.id,
    })
    


    
  }
};