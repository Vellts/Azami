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
        name: 'resetwarns',
        description: 'Devuelve al punto inicial las advertencias que tenga el usuario.',
        category: 'Moderación',
        usage: ['<@Usuario>'],
        examples: [ 'resetwarns @Azami'],
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
    if(!mention) return message.reply({content: `${client.emote.rabbitMad} ${lang.missMentionRW}`, allowedMentions: { repliedUser: false }})

    const mentionedPotision = mention.roles.highest.position
    const memberPotision = message.member.roles.highest.position

    if (memberPotision <= mentionedPotision) return message.reply({content: `${client.emote.rabbitShocket} ${lang.highestRoleRW}`, allowedMentions: { repliedUser: false }})

    let reason = args.slice(2).join(' ');
    if (!reason) reason = 'Sin razón.';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    const warnDoc = await warnModel.findOne({ guildID: message.guild.id, memberID: mention.id }).catch(err => console.log(err))
    if (!warnDoc || !warnDoc.warnings.length) return message.reply({embed: {color: 'RANDOM', description: `${lang.userWarnsRW.replace("{username}", mention.user.username)}`}, allowedMentions: { repliedUser: false }})

    await warnDoc.updateOne({
        modType: [],
        warnings: [],
        warningID: [],
        moderator: [],
        date: [],
    })

    message.reply({content: `${client.emote.pinkBunny} ${lang.removeUserWarnsRW.replace("{username}", mention.user.username)}.`, allowedMentions: { repliedUser: false }})


  }
}
