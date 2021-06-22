const Event = require('../../structures/Event');
const { MessageReaction, User, MessageEmbed } = require("discord.js");
const Db = require("../../packages/reactionrole/models/schema.js")
const reactionCooldown = new Set();
const discord = require("discord.js");
const Discord = require("discord.js");
const moment = require('moment')
const GuildDB = require('../../database/schemas/Guild');
const ticketCooldownLol = new Set();
const botCooldown = new Set();

/**
 *
 * @param {MessageReaction} reaction
 * @param {User} user
 */

module.exports = class extends Event {
	async run(messageReaction, user) {
	
//ignore bot's reactions
if (this.client.user === user) return;

const { message, emoji } = messageReaction;

// fetch the member
const member = message.guild.members.cache.get(user.id);


const guildDB = await GuildDB.findOne({
  guildId: message.guild.id
})

//find in database
await Db.findOne({
        guildid: message.guild.id,
        reaction: emoji.toString(),
        msgid: message.id,
      },

   async (err, db) => {

  // return if reaction isnt in database
  if(!db) return;

  // return if the reaction's message ID is different than in database
  if(message.id != db.msgid) return; 

  // fetch the role to give
  const rrRole = message.guild.roles.cache.get(db.roleid);
  
  // return if role doesn't exist
  if (!rrRole) return;

// return (avoid rate limit + SPAM)
if(botCooldown.has(message.guild.id)) return;

let guild = this.client.guilds.cache.get(db.guildid); 
let guildName = guild.name;

let slowDownEmbed = new MessageEmbed()
.setDescription(`${message.client.emote.rabbitShocket} Estás en cooldown, debes esperar un momento para obtener otro role.\n\n**Servidor:** ${guildName}`)

// add reaction Embed
let addEmbed = new MessageEmbed()
.setAuthor('Role agregado', message.guild.iconURL({dynamic: true}) )
.setDescription(`${message.client.emote.happyChick} Has recibido el role **${rrRole.name}** en ${guildName}.`)


// remove reaction Embed
let remEmbed = new MessageEmbed()
.setAuthor('Role removido', message.guild.iconURL({dynamic: true}) )
.setDescription(`${message.client.emote.rabbitFrustrated} Te has removido el role **${rrRole.name}** en ${guildName}.`)

//Reaction Role Error
let errorReaction = new MessageEmbed()
.setAuthor('Ha ocurrido un error.', message.guild.iconURL({dynamic: true}) )
.setDescription(`${message.client.emote.rabbitMad} No he podido agregarte el role **${rrRole.name}** en ${guildName}. Contacta con un administrador.`)

if(reactionCooldown.has(user.id)) {

 //Add user to a cooldown if he is spamming
 user.send(slowDownEmbed).catch(()=>{});
 botCooldown.add(message.guild.id)
 setTimeout(()=>{
 botCooldown.delete(message.guild.id)
 }, 4000)


}


//checking for options 


if(db.option === 1) {
      try {
       if(!member.roles.cache.find(r => r.name.toLowerCase() === rrRole.name.toLowerCase())){

  

        await member.roles.add(rrRole).catch(()=>{})
        if(guildDB.reactionDM === true){
        member.send(addEmbed).catch(()=>{})
        }
        reactionCooldown.add(user.id);
        setTimeout(()=>{
        reactionCooldown.delete(user.id)
        }, 2000);
      }
      } catch {


        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
       botCooldown.add(message.guild.id)
 setTimeout(()=>{
 botCooldown.delete(message.guild.id)
 }, 6000)
        return member.send(errorReaction).catch(()=>{})
    }
  }

if(db.option === 2) {
  try {
      if (!member.roles.cache.find(r => r.name.toLowerCase() === rrRole.name.toLowerCase())) {
      await member.roles.add(rrRole).catch(()=>{})
        if(guildDB.reactionDM === true){
        member.send(addEmbed).catch(()=>{})
        }
      reactionCooldown.add(user.id);
      setTimeout(() => {
        reactionCooldown.delete(user.id)
      }, 2000);
      }
  } catch (err) {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
 botCooldown.add(message.guild.id)
 setTimeout(()=>{
 botCooldown.delete(message.guild.id)
 }, 6000)
    return member.send(errorReaction).catch(()=>{})
   }
  }
  
  if(db.option === 3) {
    try {
      if (member.roles.cache.find(r => r.name.toLowerCase() === rrRole.name.toLowerCase())){
      await member.roles.remove(rrRole).catch(()=>{})
        if(guildDB.reactionDM === true){
        member.send(remEmbed).catch(()=>{})
        }
      reactionCooldown.add(user.id);
      setTimeout(() => {
        reactionCooldown.delete(user.id)
      }, 2000);
     }
    } catch (err) {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
 botCooldown.add(message.guild.id)
 setTimeout(()=>{
 botCooldown.delete(message.guild.id)
 }, 6000)
    return member.send(errorReaction).catch(()=>{})
    }
  }
  
  if(db.option === 4) {
    try {
         if (member.roles.cache.find(r => r.name.toLowerCase() === rrRole.name.toLowerCase())){
        await member.roles.remove(rrRole).catch(()=>{})
        reactionCooldown.add(user.id);
        if(guildDB.reactionDM === true){
        member.send(remEmbed).catch(()=>{})
        }
        setTimeout(()=>{
        reactionCooldown.delete(user.id)
        }, 2000);
        }
    } catch (err) {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
 botCooldown.add(message.guild.id)
 setTimeout(()=>{
 botCooldown.delete(message.guild.id)
 }, 6000)
    return member.send(errorReaction).catch(()=>{})   
    }
  }
  
  if(db.option === 5) {
    try {
  if (member.roles.cache.find(r => r.name.toLowerCase() === rrRole.name.toLowerCase())){
      await member.roles.remove(rrRole);
     message.reactions.cache.find(r => r.emoji.name == emoji.name).users.remove(user.id).catch(()=>{})
      
        if(guildDB.reactionDM === true){
        member.send(remEmbed).catch(()=>{})
        }
      reactionCooldown.add(user.id);
      setTimeout(() => {
        reactionCooldown.delete(user.id)
      }, 2000);
     }
    } catch (err) {
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
 botCooldown.add(message.guild.id)
 setTimeout(()=>{
 botCooldown.delete(message.guild.id)
 }, 6000)
   return member.send(errorReaction).catch(()=>{})
    }
  }


  if(db.option === 6) {
      try {



        if (member.roles.cache.find(r => r.name.toLowerCase() === rrRole.name.toLowerCase())){
          
     message.reactions.cache.find(r => r.emoji.name == emoji.name).users.remove(user.id).catch(()=>{})
        await member.roles.remove(rrRole).catch(()=>{})
    
                reactionCooldown.add(user.id);
        setTimeout(()=>{
        reactionCooldown.delete(user.id)
        }, 5000);

        return;

        } else  if (!member.roles.cache.find(r => r.name.toLowerCase() === rrRole.name.toLowerCase())) {

     message.reactions.cache.find(r => r.emoji.name == emoji.name).users.remove(user.id).catch(()=>{})
        await member.roles.add(rrRole).catch(()=>{})

        if(guildDB.reactionDM === true){
        member.send(addEmbed).catch(()=>{})
        }
        reactionCooldown.add(user.id);
        setTimeout(()=>{
        reactionCooldown.delete(user.id)
        }, 5000);
      }

      } catch (err) {

        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
 botCooldown.add(message.guild.id)
 setTimeout(()=>{
 botCooldown.delete(message.guild.id)
 }, 6000)
      return member.send(errorReaction).catch(()=>{})
    }
  }


    });
    
    
 
 }
}
