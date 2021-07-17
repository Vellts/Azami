const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

const ReactionRole = require("../../packages/reactionrole/index.js")
const react = new ReactionRole()
const config = require("../../config.json");
react.setURL(config.mongodb_url)

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'removereaction',
        aliases: ["removereactionrole"],
        description: 'remueve la reaction role.',
        category: 'Reaction Role',
        cooldown: 3,
        usage: '<channel> <messageID> <emoji>',
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
    let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      }); 
    

      
    

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(ch => ch.name === args[0])
    if (!channel) return message.channel.send('menciona un canal');
    
    let ID = args[1]
    if(!ID) return message.channel.send('menciona la id del mensaje');
    let messageID = await channel.messages.fetch(ID).catch(() => { return message.channel.send('id del mensaje no valida'); })

    let emoji = args[2]

    if (!emoji) return message.channel.send('menciona un emoji');

  
    
    if (isCustomEmoji(args[2])) return message.channel.send('no uses emojis personalizados');
    
   

    await react.reactionDelete(client, message.guild.id , ID, emoji);
    
     message.channel.send('eliminado el reaction role')
  


        function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }
    
    }
};
