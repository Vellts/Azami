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
        category: 'Moderación',
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

    if (!user) return message.reply({content: `${client.emote.rabbitConfused} ${lang.missUserSN}`, allowedMentions: { repliedUser: false }})
    //if (user.roles.highest.position >= message.user.roles.highest.position && user != message.user) return message.reply(`${client.emote.rabbitConfused} **¡Oups! Al usuario que has mencionado no le puedes cambiar el nickname.***`)
    let nickname = args[1]
    if (!nickname) return message.reply({content: `${client.emote.rabbitConfused} ${lang.missUsernameSN}`, allowedMentions: { repliedUser: false }})
    if (nickname.length > 32) return message.reply({content: `${client.emote.rabbitConfused} ${lang.maxLengthSN}`, allowedMentions: { repliedUser: false }})

    try {
      const oldNickname = user.username;
      await user.setNickname(nickname);
      message.reply({content: `*${client.emote.cuteBee} ${lang.setNicknameSN.replace("{username}", user.user.username).replace("{nickname}", nickname)}`, allowedMentions: { repliedUser: false }})

        } catch (err) {
        message.reply({content: `${client.emote.rabbitConfused} ${lang.errorSN}`, allowedMentions: { repliedUser: false }})
      }
  }
}
