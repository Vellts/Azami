const Event = require('../../structures/Event');
const Guild = require('../../database/schemas/Guild');
const WelcomeDB = require('../../database/schemas/welcome');
const { messageAttachment } = require('discord.js');
const discord = require("discord.js");
const moment = require('moment');
const Maintenance = require('../../database/schemas/maintenance')
const embedModel = require('../../database/schemas/embedSettings')
const Logging = require('../../database/schemas/logging');

module.exports = class extends Event {
  async run(member) {

  const maintenance = await Maintenance.findOne({ maintenance: "maintenance" })
  if(maintenance && maintenance.toggle == "true") return;

  const logging = await Logging.findOne({ guildId: member.guild.id });
  let guildDB = await Guild.findOne({ guildId: member.guild.id })
  let welcome = await WelcomeDB.findOne({ guildId: member.guild.id })
  if (!welcome) {
    const newSettings = new WelcomeDB({ guildId: member.guild.id });
    await newSettings.save().catch(()=>{});
    welcome = await WelcomeDB.findOne({ guildId: member.guild.id });
  }

  const data = await embedModel.findOne({ guildId: member.guild.id, name: welcome.welcomeCustomEmbed })
  let cauthor = data.author
    .replace(/{user}/g, member)
    .replace(/{user_username}/g, member.user.username)
    .replace(/{user_ID}/g, member.user.id)
    .replace(/{guild_name}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount)
  let ctitle = data.title
    .replace(/{user}/g, member.user)
    .replace(/{user_username}/g, member.user.username)
    .replace(/{user_ID}/g, member.user.id)
    .replace(/{guild_name}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount)
  let cdescription = data.description
    .replace(/{user}/g, member.user)
    .replace(/{user_username}/g, member.user.username)
    .replace(/{user_ID}/g, member.user.id)
    .replace(/{guild_name}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount)
  let cfooter = data.footer
    .replace(/{user}/g, member.user)
    .replace(/{user_username}/g, member.user.username)
    .replace(/{user_ID}/g, member.user.id)
    .replace(/{guild_name}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount)

  if(data.thumbnail === '{user_avatar}') data.thumbnail = member.user.displayAvatarURL({dynamic: true})
  if(data.image === '{user_avatar}') data.image = member.user.displayAvatarURL({dynamic: true})

  const cembed = new discord.MessageEmbed()
    .setAuthor(cauthor || ' ')
    .setTitle(ctitle || ' ')
    .setDescription(cdescription || '⠀')
    .setThumbnail(data.thumbnail || ' ')
    .setImage(data.image || ' ') 
    .setColor(data.color || '#71A1DF')
    .setFooter(cfooter || ' ')
    .setTimestamp(data.timestamp ? member.createdTimestamp : false)

  if(welcome.welcomeToggle == "true") {
    if(welcome.welcomeDM == "true"){
      let text = welcome.welcomeMessage
        .replace(/{user}/g, `${member}`)
        .replace(/{user_tag}/g, `${member.user.tag}`)
        .replace(/{user_name}/g, `${member.user.username}`)
        .replace(/{user_ID}/g, `${member.id}`)
        .replace(/{guild_name}/g, `${member.guild.name}`)
        .replace(/{guild_ID}/g, `${member.guild.id}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`)
        .replace(/{size}/g, `${member.guild.memberCount}`)
        .replace(/{guild}/g, `${member.guild.name}`)
        .replace(/{member_createdAtAgo}/g, `${moment(member.user.createdTimestamp).fromNow()}`)
        .replace(/{member_createdAt}/g, `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
        
    if(welcome.welcomeEmbed == "false") {
      member.send(text).catch(() => {})
    }
    
    if(welcome.welcomeEmbed == "true") { 
      member.send(cembed).catch(()=>{})
    }  
  }

  if(welcome.welcomeDM == "false"){
    if (welcome.welcomeChannel) {
      const greetChannel = member.guild.channels.cache.get(welcome.welcomeChannel)
      if (greetChannel) {
        let text = welcome.welcomeMessage
        .replace(/{user}/g, `${member}`)
        .replace(/{user_tag}/g, `${member.user.tag}`)
        .replace(/{user_name}/g, `${member.user.username}`)
        .replace(/{user_ID}/g, `${member.id}`)
        .replace(/{guild_name}/g, `${member.guild.name}`)
        .replace(/{guild_ID}/g, `${member.guild.id}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`)
        .replace(/{size}/g, `${member.guild.memberCount}`)
        .replace(/{guild}/g, `${member.guild.name}`)
        .replace(/{member_createdAtAgo}/g, `${moment(member.user.createdTimestamp).fromNow()}`)
        .replace(/{member_createdAt}/g, `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
        if(welcome.welcomeEmbed == "false") {           
          if(greetChannel && greetChannel.viewable && greetChannel.permissionsFor(member.guild.me).has(['SEND_memberS', 'EMBED_LINKS'])){
            greetChannel.send(text).catch(() => {})
          }
        }

        if(welcome.welcomeEmbed == "true") {
          if(greetChannel && greetChannel.viewable && greetChannel.permissionsFor(member.guild.me).has(['SEND_memberS', 'EMBED_LINKS'])){
            if(data){
              greetChannel.send(cembed)
            }
          }
        }
      }
    }
  }
}

  }
};