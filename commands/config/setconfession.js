const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const mongoose = require("mongoose")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setconfession',
        aliases: ['setcf'],
        description: "Establece el nickname al usuario que desees.",
        category: 'moderacion',
        usage: '<user> <razon>',
        examples: [ 'setnickname @Azami Supremacy', 'nickname @Azami Krbl' ],
        guildOnly: true,
        botPermission: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
        userPermission: ['MANAGE_NICKNAMES'],
      });
    }

    async run(message, args, client = message.client) {

    const settings = await Guild.findOne({
      guildId: message.guild.id
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let type = args[0]
    let vOp= lang.validOptionConfession.replace("{prefix}", settings.prefix)
    if(!type) return message.lineReplyNoMention(`${client.emote.bunnyconfused} ${lang.missTypeConfession}\n *${client.emote.pinkarrow2} ${vOp}*`)

    if(type.toLowerCase() === 'enable'){

    const channel = await message.mentions.channels.first()
    if(!channel) return message.lineReplyNoMention(`${client.emote.bunnyconfused} ${lang.missChannelConfession}`)
    if(settings.confessionId === channel.id) return message.lineReplyNoMention(`${client.emote.rabbitMad} ${lang.sameChannelConfession}`)

    await Guild.findOne({
        guildId: message.guild.id
    }, async (err, guild) => {
      guild.confessionId = channel.id
      await guild.save().catch(()=>{})
      return message.lineReplyNoMention(`${client.emote.pinkBunny} ${lang.enableChannelConfession} \`${channel.name}\`. :3***`)
    })

    } else if (type.toLowerCase() === 'disable'){

    if(settings.confessionId === null) return message.lineReplyNoMention(`${client.emote.rabbitMad} ${lang.statusConfession}`)

    await Guild.findOne({
        guildId: message.guild.id
    }, async (err, guild) => {
      guild.confessionId = null
      await guild.save().catch(()=>{})
      return message.lineReplyNoMention(`${client.emote.pinkBunny} ${lang.disableChannelConfession}`);
      return;
    })
  }
  
  }
} 