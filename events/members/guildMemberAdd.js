const Event = require('../../structures/Event');
const Guild = require('../../database/schemas/Guild');
const WelcomeDB = require('../../database/schemas/welcome');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");
const moment = require('moment');
const Maintenance = require('../../database/schemas/maintenance')
const embedModel = require('../../database/schemas/embedSettings')
const autoRole = require('../../database/schemas/embedSettings')
const Logging = require('../../database/schemas/logging');

module.exports = class extends Event {
  async run(member) {

    // Mantenimiento //

    const maintenance = await Maintenance.findOne({ maintenance: "maintenance" })
    if(maintenance && maintenance.toggle == "true") return;

    // Bienvenidas //

    const welcome = await WelcomeDB.findOne({ guildId: member.guild.id })
    if(welcome && welcome.welcomeToggle === true){
      if(welcome.welcomeChannel){
        const channel = await member.guild.channels.cache.get(welcome.welcomeChannel)
        if(channel){
          const dataEmbed = await embedModel.findOne({ guildId: member.guild.id, name: welcome.welcomeEmbed })
          if(dataEmbed){
            let embed = new MessageEmbed()
            let author = dataEmbed.author
            .replace(/{user}/g, member)
            .replace(/{username}/g, member.user.username)
            .replace(/{userId}/g, member.id)
            .replace(/{guildname}/g, member.guild.name)
            .replace(/{memberCount}/g, member.guild.memberCount)
            let title = dataEmbed.title
            .replace(/{user}/g, member)
            .replace(/{username}/g, member.user.username)
            .replace(/{userId}/g, member.id)
            .replace(/{guildname}/g, member.guild.name)
            .replace(/{memberCount}/g, member.guild.memberCount)
            let description = dataEmbed.description
            .replace(/{user}/g, member)
            .replace(/{username}/g, member.user.username)
            .replace(/{userId}/g, member.id)
            .replace(/{guildname}/g, member.guild.name)
            .replace(/{memberCount}/g, member.guild.memberCount)
            let footer = dataEmbed.footer
            .replace(/{user}/g, member)
            .replace(/{username}/g, member.user.username)
            .replace(/{userId}/g, member.id)
            .replace(/{guildname}/g, member.guild.name)
            .replace(/{memberCount}/g, member.guild.memberCount)

            if(dataEmbed.thumbnail === '{user_avatar}') {
              embed.setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            } else if(dataEmbed.thumbnail === '{guild_icon}') {
              embed.setThumbnail(member.guild.iconURL({dynamic: true}))
            } else {
              embed.setThumbnail(dataEmbed.thumbnail)
            };
            if(dataEmbed.image === '{user_avatar}') {
              embed.setImage(member.user.displayAvatarURL({dynamic: true}))
            } else if (dataEmbed.image === '{guild_icon}'){
              embed.setImage(member.guild.iconURL({dynamic: true}))
            } else {
              embed.setImage(dataEmbed.image)
            };
            if(footer.includes('{user_avatar}')) {
              embed.setFooter(footer.replace('{user_avatar}', ''), member.user.displayAvatarURL({dynamic: true}))
            } else if(footer.includes('{guild_icon}')){
              embed.setFooter(footer.replace('{guild_icon}', ''), member.guild.iconURL({dynamic: true}))
            } else {
              embed.setFooter(footer)
            };
            if(author.includes('{user_avatar}')) {
              embed.setAuthor(author.replace('{user_avatar}', ''), member.user.displayAvatarURL({dynamic: true}))
            } else if (author.includes('{guild_icon}')){
              embed.setAuthor(author.replace('{guild_icon}', ''), member.guild.iconURL({dynamic: true}))
            } else {
              embed.setAuthor(author)
            };
            if(dataEmbed.description) embed.setDescription(description)
            if(dataEmbed.title) embed.setDescription(title)
            embed.setTimestamp(dataEmbed.timestamp ? member.user.createdTimestamp : false)
            embed.setColor(dataEmbed.color ? dataEmbed.color : '#71A1DF')
            channel.send({embeds: [embed]}).catch((e) => console.log(e))
          } else {
            let msgData = welcome.welcomeMessage
            .replace(/{user}/g, member)
            .replace(/{username}/g, member.user.username)
            .replace(/{userId}/g, member.id)
            .replace(/{guildname}/g, member.guild.name)
            .replace(/{memberCount}/g, member.guild.memberCount)
            channel.send(msgData).catch((e) => console.log(e))
          }
        }
      }
    }

    // Autoroles //

    let rolesAuto = await autoRole.findOne({ guildId: member.guild.id })
    if(rolesAuto && rolesAuto.toggle === true){
      if(rolesAuto.roleID){
        let checkRole = member.guild.roles.cache.get(rolesAuto.roleID)
        if(checkRole){
          member.roles.add(checkRole)
        }
      }
    }
    ///fin
  }
};