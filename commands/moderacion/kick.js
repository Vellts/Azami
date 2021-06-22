const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'kick',
        description: 'Expulsa a los miembros no deseados.',
        category: 'moderacion',
        userPermission: ['MANAGE_MESSAGES'],
        botPermission: ['MANAGE_MESSAGES'],
        usage: ['<miembro>'],
        example: ['kick @Azami'],
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

    if (!args[0]) return message.lineReplyNoMention(`${this.client.emote.rabbitReally} ${lang.missArgsKick}`)

    let kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (!kickMember) return message.lineReplyNoMention(`${this.client.emote.rabbitConfused} ${lang.missMentionKick}`);
    if (kickMember.id === message.member.id) return message.lineReplyNoMention(`${this.client.emote.rabbitConfused} ${lang.sameMemberKick}`)
    if (!kickMember.kickable) return message.lineReplyNoMention(`${this.client.emote.bunnyconfused} ${lang.highestMemberKick}`)

    var reason = args.slice(1).join(" ")

    message.react('✅').then(() => message.react('❎'))

    const filter = (reaction, user) => {
        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
    }

    message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
    const reaction = collected.first();

   if (reaction.emoji.name === '✅') {
        try {
            const sembed2 = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(lang.memberSendKick.repalce("{servername}", message.guild.name).replace("{reason}", reason || ''))
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
            kickMember.send(sembed2).then(() =>
            kickMember.kick()).catch(() => null)
        } catch {
            kickMember.kick()
        }
        if (reason) {
            var sembed = new MessageEmbed() 
            .setColor("RANDOM")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`**${kickMember.user.username}** ${lang.memberKickkedKick} **${reason}.**`)
            .setFooter(`${lang.kickedByBan} ${message.author.username}`)
            .setTimestamp()
            message.lineReplyNoMention(sembed);
        } else {
            var sembed2 = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`**${kickMember.user.username}** ${lang.memberKickeddWithoutReaseonKick}`)
            .setFooter(`${lang.kickedByBan} ${message.author.username}`)
            .setTimestamp()
            message.lineReplyNoMention(sembed2) 
        }
        } else {
            message.lineReplyNoMention(`${this.client.emote.BananaCat} ${lang.noKick}`);
        }
    })
    .catch(collected => {
        message.lineReplyNoMention(`${this.client.emote.BananaCat} ${lang.errorKick}`);
    })

    }
};
