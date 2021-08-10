const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setconfession',
        aliases: ['setcf'],
        description: "Establece el canal de confesiones.",
        category: 'Configuración',
        usage: ['setconfession <enable> <canal>', 'setconfession <disable>'],
        examples: [ 'setconfession enable #Confesiones', 'setconfession disable' ],
        userPermission: ["MANAGE_GUILD"],
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
      guildId: message.guild.id
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let type = args[0]
    let vOp= lang.validOptionConfession.replace("{prefix}", settings.prefix)
    if(!type) return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.missTypeConfession}\n *${this.client.emote.pinkarrow2} ${vOp}*`, allowedMentions: { repliedUser: false }})

    if(type.toLowerCase() === 'enable'){

    const channel = await message.mentions.channels.first()
    if(!channel) return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.missChannelConfession}`,allowedMentions: { repliedUser: false }})
    if(settings.confessionId === channel.id) return message.reply({content: `${this.client.emote.rabbitMad} ${lang.sameChannelConfession}`, allowedMentions: { repliedUser: false }})

    await Guild.findOne({
        guildId: message.guild.id
    }, async (err, guild) => {
      guild.confessionId = channel.id
      await guild.save().catch(()=>{}) 
      return message.reply({content: `${this.client.emote.pinkBunny} ${lang.enableChannelConfession} \`${channel.name}\`. :3***`,allowedMentions: { repliedUser: false }})
    })

    } else if (type.toLowerCase() === 'disable'){

    if(settings.confessionId === null) return message.reply({content: `${this.client.emote.rabbitMad} ${lang.statusConfession}`, allowedMentions: { repliedUser: false }})

    await Guild.findOne({
        guildId: message.guild.id
    }, async (err, guild) => {
      guild.confessionId = null
      await guild.save().catch(()=>{})
      return message.reply({content: `${this.client.emote.pinkBunny} ${lang.disableChannelConfession}`,allowedMentions: { repliedUser: false }});
    })
  }
  }
} 