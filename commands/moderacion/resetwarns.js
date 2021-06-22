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
        description: 'Disable or enable commands in the guild',
        category: 'config',
        examples: [ 'togglecommand rob'],
        cooldown: 3,
        guildOnly: true,
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
    if(!mention) return message.channel.send(`${client.emote.rabbitMad} ${lang.missMentionRW}`)

    const mentionedPotision = mention.roles.highest.position
    const memberPotision = message.member.roles.highest.position

    if (memberPotision <= mentionedPotision) return message.channel.send(`${client.emote.rabbitShocket} ${lang.highestRoleRW}`)

    let reason = args.slice(2).join(' ');
    if (!reason) reason = 'None';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    const warnDoc = await warnModel.findOne({ guildID: message.guild.id, memberID: mention.id }).catch(err => console.log(err))
    if (!warnDoc || !warnDoc.warnings.length) return message.channel.send({embed: {color: 'RANDOM', description: `${lang.userWarnsRW.replace("{username}", mention.user.username)}`}})

    await warnDoc.updateOne({
        modType: [],
        warnings: [],
        warningID: [],
        moderator: [],
        date: [],
    })

    message.channel.send(`${client.emote.pinkBunny} ${lang.removeUserWarnsRW.replace("{username}", mention.user.username)}\`.*** ${logging && logging.moderation.include_reason === "true" ?`\n\n${lang.reasonRW} ${reason}`:``}`)


  }
}    
