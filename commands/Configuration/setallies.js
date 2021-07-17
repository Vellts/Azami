const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const embedModel = require('../../database/schemas/embedSettings.js')
const mongoose = require("mongoose")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setallies',
        aliases: ['setcf'],
        description: "Configura las opciones disponibles para el sistema de partners.",
        category: 'Configuration',
        usage: '<tipo> <parametro>',
        examples: [ 'setallies channel enable #Partners', 'setallies role @PartnerStaff' ],
        botPermission: ['EMBED_LINKS', 'MANAGE_ROLES', 'ATTACH_FILES'],
        userPermission: ['MANAGE_NICKNAMES'],
      });
    }

    async run(message, args, client = message.client) {

    const guildDB = await Guild.findOne({
      guildId: message.guild.id
    });
 
    let type = args[0]
    if(!type) return message.channel.send(`${client.emote.bunnyconfused} ***Oops! No has escrito ningún argumento, escribe \`channel\`, \`message\` \`status\` o \`role\`.***\n *${client.emote.pinkarrow2} Ingresa \`${guildDB.prefix}help allies\` para mas ayuda.*`)

    switch(type.toLowerCase()){
      case 'channel':
      if(guildDB.alliesStatus === false) return message.channel.send(`${client.emote.kawaiiPig} ***Oups! No has activado el sistema de partners.***`)
      let canal = message.mentions.channels.first()
      if(!canal){
        if(!guildDB.alliesId.length) return message.channel.send('nao')
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => { 
          guild.alliesId = []
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***Canal de alianzas desactivado. Ya no podrán realizar alianzas.***`);
        })
      } else {
        if(guildDB.alliesId === canal.id) return message.channel.send(`${client.emote.rabbitMad} ***Ese canal ya ha sido configurado como receptor de alianzas. u.u***`)
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesId.push(canal.id)
          await guild.save().catch(() => {})
          return message.channel.send(`${client.emote.pinkBunny} ***Canal de alianzas activado en \`${canal.name}\`. :3***`)
        })
      }
      break;
      case 'role':
        if(guildDB.alliesStatus === false) return message.channel.send(`${client.emote.kawaiiPig} ***Oups! No has activado el sistema de partners.***`)
        let role = message.mentions.roles.first()
        if(!role){
          if(guildDB.alliesRole === 'false') return message.channel.send('nao')
          await Guild.findOne({
            guildId: message.guild.id
          }, async(err, guild) => {
            guild.alliesRole = false;
            await guild.save().catch(() => {})
            return message.channel.send(`${client.emote.pinkBunny} ***El role de staff ha sido desconfigurado.***`);
          })
        } else {
          await Guild.findOne({
            guildId: message.guild.id
          }, async(err, guild) => {
            if(guildDB.alliesRole === role.id) return message.channel.send(`${client.emote.kawaiiPig} ***Uh! Al parecer ya has guardado ese role.***`)
            guild.alliesRole = role.id
            await guild.save().catch(() => {})
            return message.channel.send(`${client.emote.pinkBunny} ***El role \`${role.name}\` ha sido configurado como staff partners.***`)
          })
        }
      break;
      case 'status':
      let st = args[1]
      if(st.toLowerCase() === 'enable'){
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesStatus = true
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***¡Yey! El sistema de partners fue activado en \`${message.guild.name}\`.***`);
        })
      } else if (st.toLowerCase() === 'disable'){
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesStatus = false
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***¡Ouh! El sistema de partners fue desactivado en \`${message.guild.name}\`.***`);
        })
      } else {
        return message.channel.send(`${client.emote.sakurahana} ***¡Woh! Parece que has ingresado datos erroneos, las propiedades disponibles son: \`enable\` y \`disable\`.*** `)
      }
      break;
      case 'message':
      if(guildDB.alliesStatus === false) return message.channel.send(`${client.emote.kawaiiPig} ***Oups! No has activado el sistema de partners.***`)
      let en = args[1]
      if(en.toLowerCase() === 'embed'){
        let emb = args[2]
        if(!emb) return message.channel.send(`${client.emote.kawaiiPig} ***¡Te ha faltado nombrar el embed! u.u***`)
        const data = await embedModel.findOne({ guildId: message.guild.id, name: emb })
        if(!data){
          return message.channel.send(`${client.emote.kawaiiPig} ***No he encontrado el embed, asegurate de que exista. u.u***`)
        } else {
          await Guild.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.alliesEmbed = data.name
            await guild.save().catch(()=>{})
            return message.channel.send(`${client.emote.pinkBunny} ***¡Yey! Ahora el mensaje de partners fue establecido al embed \`${emb}\`.***`);
          })
        }
      } else {
        await Guild.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.alliesMessage = en
            await guild.save().catch(()=>{})
            return message.channel.send(`${client.emote.pinkBunny} ***¡Yey! Ahora el mensaje de partners fue establecido exitosamente.***`);
          })
      }
      break;
    }

    /*if(type.toLowerCase() === 'channel'){
      if(guildDB.alliesStatus === false) return message.channel.send(`${client.emote.mad} ***Oups! No has activado el sistema de partners.***`)
      let en = args[1]
      if(!en) return message.channel.send(`${client.emote.bunnyconfused} ***Ooup! No has ingresado parametros correctos.\n ${client.emote.pinkarrow2} **Uso correcto:** \`${guildDB.prefix}help allies\``)
      if(en.toLowerCase() === 'enable'){
        let channel = await message.mentions.channels.first()
        if(!channel) return message.channel.send(`${client.emote.bunnyconfused} ***¿Se te ha olvidado mencionar un canal? u.u***`)
        if(guildDB.alliesId === channel.id) return message.channel.send(`${client.emote.rabbitMad} ***Ese canal ya ha sido configurado como receptor de confesiones. u.u***`)
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesId.push(channel.id)
          await guild.save().catch(() => {})
          return message.channel.send(`${client.emote.pinkBunny} ***Canal de alianzas activado en \`${channel.name}\`. :3***`)
        })
      } else if (en.toLowerCase() === 'disable'){
        if(guildDB.alliesId === 'false') return message.channel.send(`${client.emote.rabbitMad} ***El modulo ya está desactivado. u.u***`)
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesId = 'false'
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***Canal de alianzas desactivado. Ya no podrán confesar más.***`);
        })
      }
    } else if (type.toLowerCase() === 'role'){
      if(guildDB.alliesStatus === false) return message.channel.send(`${client.emote.mad} ***Oups! No has activado el sistema de partners.***`)
      let role = message.mentions.roles.first()
      if(!role){
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesRole = 'false'
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***El role \`${role}\` ha sido desconfigurado como staff partners.***`);
        })
      } else {
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesRole = role.id
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***El role \`${role.name}\` ha sido configurado como staff partners.***`);
        })
      }
    } else if(type.toLowerCase() === 'status'){
      let en = args[1]
      if(en.toLowerCase() === 'enable'){
        if(guildDB.alliesStatus === true) return message.channel.send(`${client.emote.mad} ***El sistema de partners ya está activado. u.u`)
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesStatus = true
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***¡Yey! El sistema de partners ha sido activado en \`${message.guild.name}\`.***`);
        })
      } else if (en.toLowerCase() === 'disable'){
        await Guild.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.alliesStatus = false
          await guild.save().catch(()=>{})
          return message.channel.send(`${client.emote.pinkBunny} ***¡Oup! El sistema de partners fue desactivado en \`${message.guild.name}\`.***`);
        })
      }
    } else if (type.toLowerCase() === 'message'){
      let en = args[1]
      if(en.toLowerCase() === 'embed'){
        let emb = args[2]
        if(!emb) return message.channel.send('menciona el embed')
        const data = await embedModel.findOne({ guildId: message.guild.id, name: emb })
        if(!data){
          return message.channel.send('Ese embed no está registrado')
        } else {
          await Guild.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.alliesEmbed = data.name
            await guild.save().catch(()=>{})
            return message.channel.send(`${client.emote.pinkBunny} ***¡Yey! Ahora el mensaje de partners fue establecido al embed \`${emb}\`.***`);
          })
        }
      } else {
        await Guild.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.alliesMessage = en
            await guild.save().catch(()=>{})
            return message.channel.send(`${client.emote.pinkBunny} ***¡Yey! Ahora el mensaje de partners fue establecido exitosamente.***`);
          })
      }
    }*/
  }
}

function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax= arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}