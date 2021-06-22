const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'ban',
        description: 'Has que no vuelvan los malechores.',
        category: 'moderacion',
        userPermission: ['BAN_MEMBERS'],
        botPermission: ['BAN_MEMBERS'],
        usage: ['<miembro>'],
        example: ['ban @Azami'],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase())
    if (!banMember) return message.lineReplyNoMention(`${this.client.emote.bunnyconfused} ${lang.userNotFoundBan}`)
    if (banMember === message.member) return message.lineReplyNoMention(`${this.client.emote.bunnyconfused} ${lang.sameMemberBan}`)
    if (!banMember.bannable) return message.lineReplyNoMention(`${this.client.emote.bunnyconfused} ${lang.highestMemberBan}`)

    var reason = args.slice(1).join(" ")

    message.react('✅').then(() => message.react('❎'))

    const filter = (reaction, user) => {
        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id
    }

    message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
    const reaction = collected.first()

    if (reaction.emoji.name === '✅') {
        try {
            let s = lang.memberSendBan.replace("{servername}", message.guild.name).replace("{reason}", reason || '')
            const sembed2 = new Discord.MessageEmbed() 
            .setColor("RED")
            .setDescription(`${s}`)
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
            banMember.send(sembed2).then(() =>
            message.guild.members.ban(banMember, { reason: reason })).catch(() => null)
        } catch {
            message.guild.members.ban(banMember, { reason: reason })
        }
        if (reason) {
            var sembed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`**${banMember.user.username}** ${lang.memberBannedBan} ${reason}`)
            .setFooter(`${lang.bannedByBan} ${message.author.username}`)
            .setTimestamp()
            message.channel.send(sembed)
        } else {
            var sembed2 = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`**${banMember.user.username}** ${lang.memberBannedWithoutReaseonBan}`)
            .setFooter(`${lang.bannedByBan} ${message.author.username}`)
            .setTimestamp()
            message.channel.send(sembed2)
        }
        } else {
            message.channel.send(`${this.client.emote.rabbitFrustrated} ${lag.noBan}`);
        }
    })
    .catch(collected => {
        message.channel.send(`${this.client.emote.rabbitShocket} ${lang.errorBan}`);
    })

    }
};
