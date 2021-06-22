const Command = require('../../structures/Command');
const levelSystem = require('../../packages/Levels/index.js');
const levelModel = require('../../database/schemas/levelsSystem')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setlevels',
        aliases: ['levels'],
        description: 'Customiza el prefix al que desees.',
        category: 'config',
        usage: [ '<prefix>' ],
        examples: [ 'prefix $', 'prefix +', 'prefix ?' ],
        cooldown: 3,
        guildOnly: true,
        userPermission: ['MANAGE_GUILD']
      });
    }

    async run(message, args, client = message.client) {
    
    const levels = await levelModel.findOne({ 
      guildId: message.guild.id 
    }, (err, guild) => {
      if(!guild){
        const newSystem = levelModel.create({
          guildId: message.guild.id
        })
        return message.channel.send(`Documento registrado, vuelve a ejecutar el comando.`);
      }
      //return message.channel.send(`Documento registrado, vuelve a ejecutar el comando.`)
    })

    let type = args[0]
    if(!type) return message.lineReply('Menciona la prpiedad')

    switch(type){
      case 'channel':
        let en = args[1]
        if(!en) return message.lineReply('Menciona enable o disable')
        let channel = message.mentions.channels.first()
        if(!channel) return message.lineReply('Menciona un canal.')

        if(en.toLowerCase() === 'enable'){
          if(channel.id === levels.channelId) return message.lineReply('Ese canal ya está configurado.')
          await levelModel.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.channelId = channel.id
            await guild.save().catch(() => {})
            return message.lineReply(`${client.emote.pinkBunny} ***Ahora los mensajes de cuando se sube de nivel seran enviados en \`${channel.name}\`. :3***`)
          })
        } else if(en.toLowerCase() === 'disable'){
          if(levels.channelId === 'false') return message.lineReply('ese canal ya esta desactivado')
          await levelModel.findOne({
            guildId: message.guild.id
          }, async (err, guild) => {
            guild.channelId = 'false'
            await guild.save().catch(()=>{})
            return message.lineReply(`${client.emote.pinkBunny} ***Canal de subida de nivel desactivado.***`);
          })
        }
      break;
    }
  }
};
