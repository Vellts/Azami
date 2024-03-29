const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const moment = require("moment")
const { MessageEmbed } = require('discord.js');
const warnModel = require('../../models/moderation.js');
const ReactionMenu = require('../../structures/ReactionMenu.js');
const Logging = require('../../database/schemas/logging.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'warndelete',
        description: 'Elimina cierta cantidad de advertencias al usuario.',
        category: 'Moderación',
        usage: ['<@Usuario>'],
        examples: ['warndelete @Nero'],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args, client = message.client) {

    const settings = await Guild.findOne({
      guildId: message.guild.id
    })
    const lang = require(`../../data/language/${settings.language}.js`)
    const logging = await Logging.findOne({ guildId: message.guild.id })

    let mention = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    if(!mention) return message.reply({content:`${client.emote.rabbitMad} ${lang.missMentionRW}`, allowedMentions: { repliedUser: false }})

    const mentionedPotision = mention.roles.highest.position
    const memberPotision = message.member.roles.highest.position

    if (memberPotision <= mentionedPotision) return message.reply({content: `${client.emote.rabbitShocket} ${lang.highestWarnRW}`, allowedMentions: { repliedUser: false }})

    let reason = args.slice(2).join(' ');
    if (!reason) reason = 'Sin razón';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    const warnDoc = await warnModel.findOne({ guildID: message.guild.id, memberID: mention.id }).catch(err => console.log(err))
    if (!warnDoc || !warnDoc.warnings.length) return message.reply({embeds: [{color: 'RANDOM', description: `${lang.emptyWarnsRW.replace("{username}", "")}`}], allowedMentions: { repliedUser: false }})

    let warningID = args[1]
    if(!warningID) return message.reply({content: `${client.emote.rabbitMad} ${lang.missWarnKeyRW}`, allowedMentions: { repliedUser: false }})

    let check = warnDoc.warningID.filter(word => args[1] === word)
    if(!warnDoc.warningID.includes(warningID)) return message.reply({content: `${client.emote.rabbitReally} ${lang.keyNotFoundRW}`, allowedMentions: { repliedUser: false }})
    if(!check) return message.reply({content: `${client.emote.rabbitReally} ${lang.keyNotFoundRW}`, allowedMentions: { repliedUser: false }})
    if(check < 0) return message.reply({content: `${client.emote.rabbitReally} ${lang.keyNotFoundRW}`, allowedMentions: { repliedUser: false }})

    let toReset = warnDoc.warningID.length

    warnDoc.warnings.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1)
    warnDoc.warningID.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1)
    warnDoc.modType.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1)
    warnDoc.moderator.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1)
    warnDoc.date.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1)
    await warnDoc.save().catch(err => console.log(err))

    message.reply({content: `${client.emote.pinkBunny} ${lang.warnDeletedRW.replace("{keyWarn}", warningID).replace("{username}", mention.user.username)} ${logging && logging.moderation.include_reason === "true" ?`\n\n${lang.reasonRW} ${reason}`:``}`, allowedMentions: { repliedUser: false }})


  }
}
