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
        category: 'Utility',
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
    if (!emoji) return message.channel.send(`${this.client.emote.bunnyconfused} ${lang.missArgsEM}`)

    let custom = Discord.Util.parseEmoji(emoji)
    if (custom.id) {
        let emj = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`
        //let att = new Discord.MessageAttachment(emj, `${custom.name}.${custom.animated ? "gif" : "png"} `)
        return message.channel.send({files: [{attachment: emj, name: `${custom.name}.${custom.animated ? "gif" : "png"}`}]})
    } else {
        let parsed = parse(emoji, { assetType: "png" || "gif" });
        if (!parsed[0]) return message.channel.send(`${client.emote.rabbitSleeping} ${lang.invalidEmojiEM}`);
        return;
    }

    }
};
