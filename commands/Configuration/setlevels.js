const Command = require('../../structures/Command');
const levelSystem = require('../../packages/Levels/index.js');
const levelModel = require('../../database/schemas/levelsSystem')
const embedModel = require('../../database/schemas/embedSettings.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setlevels',
        aliases: ['levels'],
        description: '¡Configura el sistema de nivele y hazlo único!',
        category: 'Configuración',
        usage: [ 'setlevels <tipo> <parametro>' ],
        examples: [ 'setwelcome channel #Bienvenidas', 'prefix +', 'prefix ?' ],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args, settings) {
    
    const levels = await levelModel.findOne({ 
      guildId: message.guild.id 
    }, (err, guild) => {
      if(!guild){
        const newSystem = levelModel.create({
          guildId: message.guild.id
        })
        message.reply({content: `${this.client.emote.kawaiiPig} ***¡He visto que es tu primera vez configurando los niveles! Espera \`7\` segundos mientras configuro todo para que puedas proceder con la debida configuración. :3***`, allowedMentions: { repliedUser: false }}).then(x => x.deleteTimed({ timeout: 7000}))
      }
    })

    if(!levels) await this.client.delay(7000)

    let type = args[0]
    if(!type) return message.reply({content: `${this.client.emote.bunnyconfused} ***Oops! No has escrito ningún argumento, escribe \`channel\`, \`status\`, \`message\` o \`role\`.***\n *${this.client.emote.pinkarrow2} Ingresa \`${settings.prefix}help setlevels\` para mas ayuda.*`, allowedMentions: { repliedUser: false }})

    switch(type.toLowerCase()){
      case 'channel':
      if(levels.levelStatus === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de niveles.***`, allowedMentions: { repliedUser: false }})
      let canal = message.mentions.channels.first()
      if(!canal){
        if(!levels.levelupChannel) return message.reply({content: 'nao', allowedMentions: { repliedUser: false }})
        await levelModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.levelupChannel = '0',
          guild.messageChannelType = '1'
          await guild.save().catch(() => {})
          return message.reply({content: `${this.client.emote.pinkBunny} ***Canal de niveles desactivado . u.u***`, allowedMentions: { repliedUser: false }})
        })
      } else {
        if(settings.welcomeChannel === canal.id) return message.reply({content:`${this.client.emote.rabbitMad} ***Ese canal ya ha sido configurado como receptor de niveles. u.u***`, allowedMentions: { repliedUser: false }})
        await levelModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.levelupChannel = canal.id,
          guild.messageChannelType = '2'
          await guild.save().catch(() => {})
          return message.reply({content: `${this.client.emote.pinkBunny} ***Canal de niveles activado en \`${canal.name}\`. :3***`, allowedMentions: { repliedUser: false }})
        })
      }
      break;
      case 'status':
      let st = args[1]
      if(st.toLowerCase() === 'enable'){
        await levelModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.levelStatus = true
          await guild.save().catch(()=>{})
          return message.reply({content:`${this.client.emote.pinkBunny} ***¡Yey! El sistema de niveles fue activado en \`${message.guild.name}\`.***`, allowedMentions: { repliedUser: false }});
        })
      } else if (st.toLowerCase() === 'disable'){
        await levelModel.findOne({
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.levelStatus = false
          await guild.save().catch(()=>{})
          return message.reply({content:`${this.client.emote.pinkBunny} ***¡Ouh! El sistema de niveles fue desactivado en \`${message.guild.name}\`.***`, allowedMentions: { repliedUser: false }});
        })
      } else {
        return message.reply({content: `${this.client.emote.sakurahana} ***¡Woh! Parece que has ingresado datos erroneos, las propiedades disponibles son: \`enable\` y \`disable\`.*** `, allowedMentions: { repliedUser: false }})
      }
      break;
      case 'message':
      if(levels.levelStatus === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de niveles.***`, allowedMentions: { repliedUser: false }})
      let en = args[1]
      if(en.toLowerCase() === 'embed'){
        let emb = args[2]
        if(!emb) return message.reply({content:`${this.client.emote.kawaiiPig} ***¡Te ha faltado nombrar el embed! u.u***`, allowedMentions: { repliedUser: false }})
        const data = await embedModel.findOne({ guildId: message.guild.id, name: emb })
        if(!data){
          return message.reply({content:`${this.client.emote.kawaiiPig} ***No he encontrado el embed, asegurate de que exista. u.u***`, allowedMentions: { repliedUser: false }})
        } else {
          await levelModel.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.levelEmbed = data.name
            await guild.save().catch(()=>{})
            return message.reply({content: `${this.client.emote.pinkBunny} ***¡Yey! Ahora el mensaje de niveles fue establecido al embed \`${emb}\`.***`, allowedMentions: { repliedUser: false }});
          })
        }
      } else {
        await levelModel.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.levelMessage = args.slice(1).join(" ")
            guild.levelEmbed = 'false'
            await guild.save().catch(()=>{})
            return message.reply({content: `${this.client.emote.pinkBunny} ***¡Naisu! Ahora el mensaje de niveles fue establecido exitosamente.***`, allowedMentions: { repliedUser: false }});
          })
      }
      break;
      case 'multiplier':
      if(levels.levelStatus === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de niveles.***`, allowedMentions: { repliedUser: false }})
      let mult = args[1]
      let validMult = ["0.5", "0.75", "1", "1.5", "2"]
      if(!validMult.includes(mult)) return message.reply({content: `Esos no son numeros válidos.\n\n${this.client.emote.star1} Números válidos: \`${validMult.join(", ")}\``, allowedMentions: { repliedUser: false }})
      await levelModel.findOne(
        {
          guildId: message.guild.id
        }, async (err, guild) => {
          guild.multiplier = parseFloat(mult)
          await guild.save().catch(()=>{})
          return message.reply({content: `${this.client.emote.pinkBunny} ***¡Naisu! Ahora obtendrán xp \`x${mult}\`.***`, allowedMentions: { repliedUser: false }});
        }
      )
      break;
      case 'rolelevel':
      if(levels.levelStatus === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de niveles.***`, allowedMentions: { repliedUser: false }})
      let typo = args[1]
      if(!typo) return message.reply("nao")
      if(typo.toLowerCase() === 'add'){
        let needLvl = args[3]
        let roleNeed = message.mentions.roles.first()
        if(roleNeed.managed) return message.reply({content: `No puedes ingresar roles de bots.`, allowedMentions: { repliedUser: false }})
        if(!needLvl || !roleNeed) return message.reply({content: `Te ha faltado ingresar el nivel requerido o el role.`, allowedMentions: { repliedUser: false }})
        await levelModel.findOne(
          {
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.roleAdd.push({ roleid: roleNeed.id, levelNeed: needLvl })
            await guild.save().catch(()=>{})
            return message.reply({content: `${this.client.emote.pinkBunny} ***¡Yeeey! Los que alcancen el nivel \`${needLvl}\` obtendrán el role \`${roleNeed.name}\`. n.n***`, allowedMentions: { repliedUser: false }});
          }
        )
      } else if(typo.toLowerCase() === 'delete'){
        let roleDeleteLevel = args[3]
        let roleDeleteNeed = message.mentions.roles.first()
        if(!roleDeleteLevel || !roleDeleteNeed) return message.reply({content: `Te ha faltado ingresar el nivel requerido o el role.`, allowedMentions: { repliedUser: false }})
        if(roleDeleteNeed.managed) return message.reply({content: `No puedes ingresar roles de bots.`, allowedMentions: { repliedUser: false }})
        let dataRemovedRole = await levelModel.findOne({ guildId: message.guild.id})
        if(!dataRemovedRole) return message.reply("nao")
        let checkRole = dataRemovedRole.roleAdd.filter(x => x.roleid === roleDeleteNeed.id && x.levelNeed === roleDeleteLevel)
        if(!checkRole.length) return message.reply("nao")
        let toreset = dataRemovedRole.roleAdd.length
        dataRemovedRole.roleAdd.splice(toreset - 1, toreset !== 1 ? toreset - 1 : 1)
        await dataRemovedRole.save().catch(err => console.log(err))
        return message.reply({content: `He eliminado el role \`${roleDeleteNeed.name}\`, ahora los usuarios que suban a nivel \`${roleDeleteLevel}\` no recibirán el role.`, allowedMentions: { repliedUser: false }})
      }
      break;
      case 'disablechannel':
      if(levels.levelStatus === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de niveles.***`, allowedMentions: { repliedUser: false }})
      let typos = args[1]
      if(!typos) return message.reply("nao")
      if(typos.toLowerCase() === 'add'){
        let channelNeeded = message.mentions.channels.first()
        if(!channelNeeded) return message.reply({content: `Te ha faltado ingresar el canal.`, allowedMentions: { repliedUser: false }})
        await levelModel.findOne(
          {
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.disableChannels.push(channelNeeded.id)
            await guild.save().catch(()=>{})
            return message.reply({content: `${this.client.emote.pinkBunny} ***¡Fantastic! Ahora ya no podrán farmear nivel en \`${channelNeeded.name}\`. :3***`, allowedMentions: { repliedUser: false }});
          }
        )
      } else if(typos.toLowerCase() === 'delete'){
        let channelDeleteNeed = message.mentions.channels.first()
        if(!channelDeleteNeed) return message.reply({content: `Te ha faltado ingresar el canal.`, allowedMentions: { repliedUser: false }})
        let dataRemovedChannel = await levelModel.findOne({ guildId: message.guild.id})
        if(!dataRemovedChannel) return message.reply("nao")
        let checkChannel = dataRemovedChannel.disableChannels.filter(x => x === channelDeleteNeed.id)
        if(!checkChannel.length) return message.reply("nao")
        let toreset = dataRemovedChannel.disableChannels.length
        dataRemovedChannel.disableChannels.splice(toreset - 1, toreset !== 1 ? toreset - 1 : 1)
        await dataRemovedChannel.save().catch(err => console.log(err))
        return message.reply({content: `He eliminado el canal \`${channelDeleteNeed.name}\` de la lista negra, ahora los usuarios podrán subir nivel.`, allowedMentions: { repliedUser: false }})
      }
      break;
      case 'disablerole':
      if(levels.levelStatus === false) return message.reply({content: `${this.client.emote.kawaiiPig} ***Oups! No has activado el sistema de niveles.***`, allowedMentions: { repliedUser: false }})
      let typor = args[1]
      if(!typor) return message.reply("nao")
      if(typor.toLowerCase() === 'add'){
        let roleDisable = message.mentions.roles.first()
        if(!roleDisable) return message.reply({content: `Te ha faltado ingresar el canal.`, allowedMentions: { repliedUser: false }})
        await levelModel.findOne(
          {
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.disableRoles.push(roleDisable.id)
            await guild.save().catch(()=>{})
            return message.reply({content: `${this.client.emote.pinkBunny} ***¡Yea! El role \`${roleDisable.name}\` detendrá sus acciones de farmeo. :3***`, allowedMentions: { repliedUser: false }});
          }
        )
      } else if(typor.toLowerCase() === 'delete'){
        let roleDisabled = message.mentions.roles.first()
        if(!roleDisabled) return message.reply({content: `Te ha faltado ingresar el canal.`, allowedMentions: { repliedUser: false }})
        let dataRemovedRoles = await levelModel.findOne({ guildId: message.guild.id})
        if(!dataRemovedRoles) return message.reply("nao")
        let checkChannel = dataRemovedRoles.disableRoles.filter(x => x === roleDisabled.id)
        if(!checkChannel.length) return message.reply("nao")
        let toreset = dataRemovedRoles.disableRoles.length
        dataRemovedRoles.disableRoles.splice(toreset - 1, toreset !== 1 ? toreset - 1 : 1)
        await dataRemovedRoles.save().catch(err => console.log(err))
        return message.reply({content: `He eliminado el canal \`${roleDisabled.name}\` de la lista negra, ahora los usuarios podrán subir nivel.`, allowedMentions: { repliedUser: false }})
      }
      break;
    }
  }
};
