const Event = require('../../structures/Event');
const Discord = require('discord.js');
const Guild = require('../../database/schemas/Guild');
const ReactionRole = require("../../packages/reactionrole/models/schema");

module.exports = class extends Event {

  async run(guild) {

    this.client.channels.cache.get('856720235364483123').send(`¡He salido de un servidor llamado \`${guild.name}\`!`)

    Guild.findOneAndDelete({
      guildId: guild.id,
    }).catch(()=>{});


    const conditional = {
      guildid: guild.id
   }
   const results = await ReactionRole.find(conditional)
   
   if (results && results.length) {
       for (const result of results) {

           try {
               await ReactionRole.deleteOne(conditional)
           } catch (e) {
               console.log(e)
           }
   
       }
   
   };

   


   
  }
};