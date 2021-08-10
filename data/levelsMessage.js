const levelModel = require('../database/schemas/levelsSystem');
const xpSystem = require('../packages/Levels/models/levels')
const embedModel = require('../database/schemas/embedSettings')
const { MessageEmbed } = require('discord.js')
const CooldownLvl = new Set();

module.exports = async message => {

  const levels = await levelModel.findOne({ guildId: message.guild.id });
  const data = await embedModel.findOne({ guildId: message.guild.id, name: levels.levelEmbed })

  let justLevel = levels.justChannel;
  if (typeof(justLevel) === 'string') justLevel = justLevel.split(' ');
  let disableChannels = levels.disableChannels
  if (typeof(disableChannels) === 'string') disbleChannels = justLevel.split(' ');
  let disableRoles = levels.disableRoles
  if (typeof(disableRoles) === 'string') disableRoles = justLevel.split(' ');

  if(levels.levelStatus){
    if(disableChannels && disableChannels.includes(message.channel.id.toString())) return message.channel.send("no role");
    if(disableRoles && message.member.roles.cache.map(r => r.id).some(x => disableRoles.includes(x))) return message.channel.send("no role");

    if (!CooldownLvl.has(message.author.id)) {
    const xpAdd = Math.round((Math.floor(Math.random() * 7) + 8) * levels.multiplier);
    xpSystem.findOne({
		    userID: message.author.id,
			  guildID: message.guild.id,
		}, (err, Xp) => {
		    if (err) bot.logger.error(err);
		    if (!Xp) {
				      const xpnew = new xpSystem({
				            userID: message.author.id,
				            guildID: message.guild.id,
				            xp: xpAdd,
                    level: 1,
                    countXp: xpAdd,
					          lastUpdated: Date.now(),
				      });
				xpnew.save().catch(err => console.log(err.message));
			  } else {
				      Xp.xp = Xp.xp + xpAdd;
              Xp.countXp = Xp.countXp + xpAdd
				      const xpNeed = (12 * (Xp.level ** 2) + 50 * Xp.level + 100);
				      if (Xp.xp >= xpNeed) {
					           Xp.level = Xp.level + 1;
                     Xp.xp = 1
                     //let nextLvl = Xp.level - 1;
                     if(levels.messageChannelType === '2'){
                     //if(levels.levelupChannel){
                     const lvlchannel = message.guild.channels.cache.get(levels.levelupChannel);
                     if(lvlchannel){
                       if(data){
                         let embed = new MessageEmbed()
                         let author = data.author
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)
                         let title = data.title
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)
                         let description = data.description
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)
                         let footer = data.footer
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)

                         if(data.thumbnail === '{user_avatar}') {
                             embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                         } else if(data.thumbnail === '{guild_icon}') {
                             embed.setThumbnail(message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setThumbnail(data.thumbnail)
                         };
                         if(data.image === '{user_avatar}') {
                             embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                         } else if (data.image === '{guild_icon}'){
                             embed.setImage(message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setImage(data.image)
                         };
                         if(footer.includes('{user_avatar}')) {
                            embed.setFooter(footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                         } else if(footer.includes('{guild_icon}')){
                            embed.setFooter(footer.replace('{guild_icon}', ''), message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setFooter(footer)
                         };
                         if(author.includes('{user_avatar}')) {
                             embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                         } else if (author.includes('{guild_icon}')){
                             embed.setAuthor(author.replace('{guild_icon}', ''), message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setAuthor(author)
                         };
                         if(data.description) embed.setDescription(description)
                         if(data.title) embed.setDescription(title)
                         embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                         embed.setColor(data.color ? data.color : '#71A1DF')
                         lvlchannel.send({embeds: [embed]}).catch((e) => console.log(e))
                       } else {
                         lvlchannel.send(`${levels.levelMessage.replace("{username}", message.author.username).replace("{user_level}", Xp.level)}`).catch(e => console.log(e))
                       };
                     }
                   } else if(levels.messageChannelType === '1') {
                       if(data){
                         let embed = new MessageEmbed()
                         let author = data.author
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)
                         let title = data.title
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)
                         let description = data.description
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)
                         let footer = data.footer
                         .replace(/{user}/g, message.author)
                         .replace(/{username}/g, message.author.username)
                         .replace(/{userId}/g, message.author.id)
                         .replace(/{guildname}/g, message.guild.name)
                         .replace(/{memberCount}/g, message.guild.memberCount)

                         if(data.thumbnail === '{user_avatar}') {
                             embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                         } else if(data.thumbnail === '{guild_icon}') {
                             embed.setThumbnail(message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setThumbnail(data.thumbnail)
                         }
                         if(data.image === '{user_avatar}') {
                             embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                         } else if (data.image === '{guild_icon}'){
                             embed.setImage(message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setImage(data.image)
                         }
                         if(footer.includes('{user_avatar}')) {
                            embed.setFooter(footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                         } else if(footer.includes('{guild_icon}')){
                            embed.setFooter(footer.replace('{guild_icon}', ''), message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setFooter(footer)
                         }
                         if(author.includes('{user_avatar}')) {
                             embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                         } else if (author.includes('{guild_icon}')){
                             embed.setAuthor(author.replace('{guild_icon}', ''), message.guild.iconURL({dynamic: true}))
                         } else {
                             embed.setAuthor(author)
                         }
                         if(data.description) embed.setDescription(description)
                         if(data.title) embed.setDescription(title)
                         embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                         embed.setColor(data.color ? data.color : '#71A1DF')
                         message.channel.send({embeds: [embed]})
                       } else {
                         message.channel.send(`${levels.levelMessage.replace("{username}", message.author.username).replace("{user_level}", Xp.level)}`)
                       }
                     }
				      }
        Xp.save().catch(err => console.log(err.message));
			}
		});
    CooldownLvl.add(message.author.id);
		setTimeout(() => {
			CooldownLvl.delete(message.author.id);
		}, 90000);
  }
  }

}
