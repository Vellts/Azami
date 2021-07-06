const levelModel = require('../database/schemas/levelsSystem');
const xpSystem = require('../packages/Levels/index.js')
const embedModel = require('../database/schemas/embedSettings')
const { MessageEmbed } = require('discord.js')

module.exports = async message => {

  const levels = await levelModel.findOne({ guildId: message.guild.id });
  const data = await embedModel.findOne({ guildId: message.guild.id, name: levels.levelEmbed })
  const userlvl = await xpSystem.fetch(message.author.id, message.guild.id)

  const justLevel = levels.justChannel;
  if (typeof(justLevel) === 'string') justLevel = justLevel.split(' ');

  if(levels.levelStatus){
    if(justLevel && justLevel.includes(message.channel.id)){
      const levelUp = await xpSystem.appendXp(message.author.id, message.guild.id, 12)
      const user = await xpSystem.fetch(message.author.id, message.guild.id, true)
      const nextLVL = Math.floor(user.level + 1)
      const needxp = xpSystem.xpFor(nextLVL)
      const post = user.position

        if(levels.levelEmbed && data){
          let embed = new MessageEmbed()
          let author = data.author
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
          let title = data.title
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
          let description = data.description
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
          let footer = data.footer
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)

            if(data.thumbnail === '{user_avatar}') {
                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setThumbnail(data.thumbnail)
            }
            if(data.image === '{user_avatar}') {
                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setImage(data.image)
            }
            if(footer.includes('{user_avatar}')) {
               embed.setFooter(footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setFooter(footer)
            }
            if(data.author.includes('{user_avatar}')) {
                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setAuthor(author)
            }
            if(data.description) embed.setDescription(description)
            if(data.title) embed.setDescription(title)
            embed.setTimestamp(data.timestamp ? message.createdAt : false)
            embed.setColor(data.color ? data.color : '#71A1DF')
          if(levelUp){
            message.channel.send({embeds: [embed]})
          }
        } else {
          if(levelUp){
            message.channel.send(levels.levelMessage
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
            )
          }
        }
    } else {
      const levelUp = await xpSystem.appendXp(message.author.id, message.guild.id, 12)
      const user = await xpSystem.fetch(message.author.id, message.guild.id, true)
      const nextLVL = Math.floor(user.level + 1)
      const needxp = xpSystem.xpFor(nextLVL)
      const post = user.position


      if(levels.levelEmbed && data){
          let embed = new MessageEmbed()
          let author = data.author
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
          let title = data.title
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
          let description = data.description
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
          let footer = data.footer
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)

            if(data.thumbnail === '{user_avatar}') {
                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setThumbnail(data.thumbnail)
            }
            if(data.image === '{user_avatar}') {
                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setImage(data.image)
            }
            if(footer.includes('{user_avatar}')) {
               embed.setFooter(footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setFooter(footer)
            }
            if(data.author.includes('{user_avatar}')) {
                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setAuthor(author)
            }
            if(data.description) embed.setDescription(description)
            if(data.title) embed.setDescription(title)
            embed.setTimestamp(data.timestamp ? message.createdAt : false)
            embed.setColor(data.color ? data.color : '#71A1DF')
          if(levelUp){
            message.channel.send({embeds: [embed]})
          }
        } else {
          if(levelUp){
            message.channel.send(levels.levelMessage
            .replace(/{user}/g, message.author)
            .replace(/{username}/g, message.author.username)
            .replace(/{user_id}/g, message.author.id)
            .replace(/{user_tag}/g, message.author.tag)
            .replace(/{servername}/g, message.guild.name)
            .replace(/{user_xp}/g, user.xp)
            .replace(/{user_level}/g, user.level)
            )
          }
        }
    }
  }
}
