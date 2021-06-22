const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'addemoji',
        aliases: ['addemj'],
        description: 'Agrega nuevos emojis a tu servidor de forma rápida.',
        category: 'Moderación',
        userPermission: ['MANAGE_EMOJIS'],
        botPermission: ['MANAGE_EMOJIS'],
        usage: ['<emoji>'],
        example: ['addemoji Chacarron https://cdn.discordapp.com/emojis/822552236381962251.gif', 'addemoji Chacarron <attachment>'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let url = message.attachments.first() ? message.attachments.first().url : undefined || args[1]
    if (!url || url === undefined) return message.lineReplyNoMention(`${this.client.emote.rabbitMad} ${lang.missLinkEmojiAE}`)
    let name = args[0]
    if (!name) return message.lineReplyNoMention(`${this.client.emote.rabbitMad} ${lang.missNameEmojiAE}`)

    if (!message.attachments.first()) {
        message.guild.emojis.create(url, name).then(emoji => {
            message.channel.send(`${emoji} **|** ${lang.addedEmojiAE}`).then(r => {
                r.react('✅')
            })
        }).catch(() => {
                message.channel.send(`${this.client.emote.bunnyconfused} ${lang.errorEmojiAE}`)
            })
    } else {
        message.guild.emojis.create(url, name).then(emoji => {
            message.channel.send(`${emoji} **|** ${lang.addedEmojiAE}`).then(r => {
                r.react('✅')
            })
        }).catch(() => {
            message.channel.send(`${this.client.emote.bunnyconfused} ${lang.errorEmojiAE}`)
        })
    }

    }
};
