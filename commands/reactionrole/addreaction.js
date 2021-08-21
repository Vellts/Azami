const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const ReactionRole = require("../../packages/reactionrole/index.js")
const config = require("../../config")
const react = new ReactionRole()
react.setURL(config.mongoDB)

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'addreaction',
      aliases: ["rr", "createrr"],
      description: 'Crea un reaction role, con mensaje personalizado.',
      category: 'Reaction role',
      cooldown: 3,
      usage: '<canal> <messageID> <role> <emoji>',
      userPermission: ['MANAGE_GUILD'],
      examples: ['addreaction #general 123456789123456789 @Moon :poop:']
    });
  }

  async run(message, args, client = message.client) {
  
  const settings = await Guild.findOne({ guildId: message.guild.id });
  const lang = require(`../../data/language/${settings.language}.js`)

  let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(ch => ch.name === args[0]) || message.channel
  if (!channel) return message.channel.send(`${client.emote.bunnyconfused} ${lang.errorRL}`);
    
  let ID = args[1]
  if(!ID) return message.channel.send(`${client.emote.bunnyconfused} ${lang.errorRL}`);

  let messageID = await channel.messages.fetch(ID).catch(() => { return message.channel.send(`${client.emote.bunnyconfused} ${lang.messageNotFoundRL}`); })

  let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(rl => rl.name === args[2])
  if (!role) return message.channel.send(`${client.emote.bunnyconfused} ${lang.errorRL}`);

  if(role.managed) return message.channel.send(`${client.emote.bunnyconfused} ${lang.roleManagedRL}`)
      
  let emoji = args[3]
  if (!emoji) return message.channel.send(`${client.emote.bunnyconfused} ${lang.errorRL}`);
  if (isCustomEmoji(args[3])) return message.channel.send(`${client.emote.bunnyconfused} ${lang.customEmojiRL}`);

  try {
    await messageID.react(emoji)
  } catch(err){
    return message.channel.send(`${client.emote.bunnyconfused} ${lang.errorRL}`);
  }
 
  let option = 1

  await react.reactionCreate(client, message.guild.id , ID, role.id, emoji, "false", option);

  message.channel.send(`${client.emote.rocketPink} ${lang.reactionAddedRL}`)

  /*message.channel.send(new MessageEmbed()
                .setAuthor('Reaction Roles', message.guild.iconURL(),messageID.url)
                .setColor(client.color.green)
                .addField('Channel', channel, true)
                .addField('Emoji', emoji, true)
                .addField('Type', option, true)
                .addField('Message ID', ID, true)
                .addField('Message', `[Jump To Message](${messageID.url})`, true)
                .addField('Role', role, true)
                .setFooter('https://github.com/peterhanania/reaction-roles'))*/

  function isCustomEmoji(emoji) {
    return emoji.split(":").length == 1 ? false : true;
  }

  }
};