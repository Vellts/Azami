const levelModel = require('../database/schemas/levelsSystem');
const xpSystem = require('../packages/Levels/models/levels')
const embedModel = require('../database/schemas/embedSettings')
const { MessageEmbed } = require('discord.js')
const CooldownLvl = new Set();

module.exports = async message => {

  let nivel = await levelModel.findOne({ guildId: message.guild.id }).catch(err => console.log(err))
  let lvl = await xpSystem.findOne({guildID: message.guild.id, userID: message.author.id})
  if(!lvl) return
  if(nivel.levelStatus){
    if (!CooldownLvl.has(message.author.id)) {
      let data = nivel.roleAdd
      let arr = []
      for(const key of data){
        arr.push({
          roles: key.roleid,
          needLevel: key.levelNeed
        })
      }
      let ae = arr.filter(x => x.needLevel == lvl.level)
      let role = ae.map(x => x.roles)
      if(ae.length){
        message.member.roles.add(role)
        .catch(() => {})
      }
      CooldownLvl.add(message.author.id);
  		setTimeout(() => {
  			CooldownLvl.delete(message.author.id);
  		}, 90000);
    }
  }
}
