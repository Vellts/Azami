const Guild = require('../database/schemas/Guild');
const fetch = require('node-fetch');
const alliesPoints = require('../packages/alliesPoints/index.js')
const embedModel = require('../database/schemas/embedSettings')
const { MessageEmbed } = require('discord.js')

module.exports = async message => {

  const settings = await Guild.findOne({
    guildId: message.guild.id,
  });
  const data = await embedModel.findOne({ guildId: message.guild.id, name: settings.alliesEmbed })

  const alliesId = settings.alliesId;
  if (typeof(alliesId) === 'string') alliesId = alliesId.split(' ');

  if (settings.alliesStatus && alliesId.includes(message.channel.id)) {
    if(message.member.roles.cache.has(settings.alliesRole)){
      const inviteLink = new RegExp(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g);
      if (inviteLink.test(message.content)) { 
            await alliesPoints.addPoints(message.author.id, message.guild.id, 1);
            const user = await alliesPoints.fetch(message.author.id, message.guild.id, true);
            const nextLVL = Math.floor(user.level + 1);
            const needxp = alliesPoints.pointsFor(nextLVL);
            const pos = user.position;

            let embed = new MessageEmbed()
            let author = data.author
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)
            let title = data.title
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)
            let description = data.description
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)
            let footer = data.footer
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)

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
            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
            embed.setColor(data.color ? data.color : '#71A1DF')

            if(settings.alliesEmbed){
              message.channel.send(embed)
            } else {
              message.channel.send(`¡Has hecho una alianza ${message.author}! Ahora tienes ${user.xp} puntos y te encuentras en la posición ${pos}.`)
            }
      }
    } else return;
  } 
}