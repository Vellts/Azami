const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const mongoose = require("mongoose")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setnickname',
        aliases: ['nickname'],
        description: "Establece el nickname al usuario que desees.",
        category: 'Moderation',
        usage: '<user> <razon>',
        examples: [ 'setnickname @Azami Supremacy', 'nickname @Azami Nero' ],
        botPermission: ['MANAGE_NICKNAMES'],
        userPermission: ['MANAGE_NICKNAMES'],
      });
    }

    async run(message, args, client = message.client) {
     /*------ Guild Data ------*/
    const settings = await Guild.findOne({
      guildId: message.guild.id
    }, (err, guild) => {
      if (err) console.error(err)
});
    const lang = require(`../../data/language/${settings.language}.js`)

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    
    if (!user) return message.channel.send(`${client.emote.rabbitConfused} ${lang.missUserSN}`)
    //if (user.roles.highest.position >= message.user.roles.highest.position && user != message.user) return message.channel.send(`${client.emote.rabbitConfused} **¡Oups! Al usuario que has mencionado no le puedes cambiar el nickname.***`)
    let nickname = args[1]
    if (!nickname) return message.channel.send(`${client.emote.rabbitConfused} ${lang.missUsernameSN}`)
    if (nickname.length > 32) return message.channel.send(`${client.emote.rabbitConfused} ${lang.maxLengthSN}`)

    try {
      const oldNickname = user.username;
      await user.setNickname(nickname);
      message.channel.send(`*${client.emote.cuteBee} ${lang.setNicknameSN.replace("{username}", user.user.username).replace("{nickname}", nickname)}`)

        } catch (err) {
        message.channel.send(`${client.emote.rabbitConfused} ${lang.errorSN}`)
      }
  }
} 