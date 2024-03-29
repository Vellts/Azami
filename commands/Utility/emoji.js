const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')
const { parse } = require("twemoji-parser")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'emote',
        aliases: ['e', 'emoji', 'jumbo'],
        description: 'Haz más grande el emote que has introducido.',
        category: 'Utilidad',
        usage: [ '<emoji>'],
        examples: ['emote :poop:'],
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

    const emoji = args[0]
    if (!emoji) return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.missArgsEM}`, allowedMentions: { repliedUser: false }})

    let custom = Discord.Util.parseEmoji(emoji)
    if (custom.id) {
        let emj = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`
        //let att = new Discord.MessageAttachment(emj, `${custom.name}.${custom.animated ? "gif" : "png"} `)
        return message.reply({files: [{attachment: emj, name: `${custom.name}.${custom.animated ? "gif" : "png"}`}], allowedMentions: { repliedUser: false }})
    } else {
        let parsed = parse(emoji, { assetType: "png" || "gif" });
        if (!parsed[0]) return message.reply({content: `${client.emote.rabbitSleeping} ${lang.invalidEmojiEM}`, allowedMentions: { repliedUser: false }});
        return;
    }

    }
};
