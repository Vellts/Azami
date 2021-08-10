const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const embedModel = require('../../database/schemas/embedSettings.js')
const WelcomeModel = require('../../database/schemas/welcome.js')
const mongoose = require("mongoose")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'welcome',
        aliases: ['setwelcome'],
        description: "Configura el sistema de bienvenidas.",
        category: 'Configuración',
        usage: ['<tipo> <parametro>'],
        examples: [ 'setwelcome channel #Bienvenidas', 'setwelcome status enable', 'setwelcome message embed BienvenidasEmbed' ],
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args, settings) {

    const welcomeDB = await WelcomeModel.findOne({
      guildId: message.guild.id
    }, async (err, guild) => {
      if (err) console.log(err)
      if (!guild) {
        const newGuild = await WelcomeModel.create({
          guildId: message.guild.id,
        });
        message.reply({content: `${this.client.emote.kawaiiPig} ***¡He visto que es tu primera vez configurando las bienvenidas! Espera \`7\` segundos mientras configuro todo para que puedas proceder con la debida configuración. :3***`, allowedMentions: { repliedUser: false }}).then(x => x.deleteTimed({ timeout: 7000}))
      }
    })
    if(!welcomeDB) await this.client.delay(7000)
  
    let type = args[0]
    if(!type) return message.reply({content: `${this.client.emote.bunnyconfused} ***Oops! No has escrito ningún argumento, escribe \`channel\`, \`status\`, \`message\` o \`role\`.***\n *${this.client.emote.pinkarrow2} Ingresa \`${settings.prefix}help allies\` para mas ayuda.*`, allowedMentions: { repliedUser: false }})

    switch(type.toLowerCase()){
      case 'channel':
      if(settings.welcomeToggle === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de bienvenidas.***`, allowedMentions: { repliedUser: false }})
      let canal = message.mentions.channels.first()
      if(!canal){
        if(!settings.welcomeChannel) return message.reply({content: 'nao', allowedMentions: { repliedUser: false }})
        await WelcomeModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.welcomeChannel = 'false'
          await guild.save().catch(() => {})
          return message.reply({content: `${this.client.emote.pinkBunny} ***Canal de bienvenidas desactivado . u.u***`, allowedMentions: { repliedUser: false }})
        })
      } else {
        if(settings.welcomeChannel === canal.id) return message.reply({content:`${this.client.emote.rabbitMad} ***Ese canal ya ha sido configurado como receptor de bienvenidas. u.u***`, allowedMentions: { repliedUser: false }})
        await WelcomeModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.welcomeChannel = canal.id
          await guild.save().catch(() => {})
          return message.reply({content: `${this.client.emote.pinkBunny} ***Canal de bienvenidas activado en \`${canal.name}\`. :3***`, allowedMentions: { repliedUser: false }})
        })
      }
      break;
      case 'status':
      let st = args[1]
      if(st.toLowerCase() === 'enable'){
        await WelcomeModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.welcomeToggle = true
          await guild.save().catch(()=>{})
          return message.reply({content:`${this.client.emote.pinkBunny} ***¡Yey! El sistema de bienvenidas fue activado en \`${message.guild.name}\`.***`, allowedMentions: { repliedUser: false }});
        })
      } else if (st.toLowerCase() === 'disable'){
        await WelcomeModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.welcomeToggle = false
          await guild.save().catch(()=>{})
          return message.reply({content:`${this.client.emote.pinkBunny} ***¡Ouh! El sistema de bienvenidas fue desactivado en \`${message.guild.name}\`.***`, allowedMentions: { repliedUser: false }});
        })
      } else {
        return message.reply({content: `${this.client.emote.sakurahana} ***¡Woh! Parece que has ingresado datos erroneos, las propiedades disponibles son: \`enable\` y \`disable\`.*** `, allowedMentions: { repliedUser: false }})
      }
      break;
      case 'message':
      if(settings.alliesStatus === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de bienvenidas.***`, allowedMentions: { repliedUser: false }})
      let en = args[1]
      if(en.toLowerCase() === 'embed'){
        let emb = args[2]
        if(!emb) return message.reply({content:`${this.client.emote.kawaiiPig} ***¡Te ha faltado nombrar el embed! u.u***`, allowedMentions: { repliedUser: false }})
        const data = await embedModel.findOne({ guildId: message.guild.id, name: emb })
        if(!data){
          return message.reply({content:`${this.client.emote.kawaiiPig} ***No he encontrado el embed, asegurate de que exista. u.u***`, allowedMentions: { repliedUser: false }})
        } else {
          await WelcomeModel.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.welcomeEmbed = data.name
            await guild.save().catch(()=>{})
            return message.reply({content: `${this.client.emote.pinkBunny} ***¡Yey! Ahora el mensaje de bienvenidas fue establecido al embed \`${emb}\`.***`, allowedMentions: { repliedUser: false }});
          })
        }
      } else {
        await WelcomeModel.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.welcomeMessage = en
            await guild.save().catch(()=>{})
            return message.reply({content: `${this.client.emote.pinkBunny} ***¡Naisu! Ahora el mensaje de bienvenidas fue establecido exitosamente.***`, allowedMentions: { repliedUser: false }});
          })
      }
      break;
    }
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