const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const config = require("../../config")
const ReactionRole = require("../../packages/reactionrole/index.js")
const react = new ReactionRole()
react.setURL(config.mongoDB)

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'editreaction',
        aliases: ["editreactionrole", "err"],
        description: 'edita la reaction role',
        category: 'Reaction Role',
        cooldown: 3,
        usage: '<channel> <messageID> <newRoleID> <emoji>',
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
    let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    

      
 
      /*let fail = message.client.emoji.fail
      let success = message.client.emoji.success
  const missingPermEmbed = new MessageEmbed()
  .setAuthor(`Missing User Permissions`, message.author.displayAvatarURL())
  .setDescription(`${fail} The following command the **Administrator** Permission`)
  .setFooter(`https://github.com/peterhanania/reaction-roles`)
   .setColor(client.color.red)*/


        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(ch => ch.name === args[0])
        if (!channel) return message.channel.send('menciona canal pues')
    
    let ID = args[1]
    if(!ID) return message.channel.send('menciona la id del mensaje');
    let messageID = await channel.messages.fetch(ID).catch(() => { return message.channel.send('mensaje no valido'); })


    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(rl => rl.name === args[2])
    if (!role) return message.channel.send('menciona run rol valido');

        if(role.managed){
      return message.channel.send(`no puedes usar eso`)
    }

      
     let emoji = args[3]



    await react.reactionEdit(client, message.guild.id , ID, role.id, emoji);
    
                message.channel.send('reaccion editada')


        function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }

    }
};
