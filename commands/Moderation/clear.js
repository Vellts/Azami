const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'clear',
        aliases: ['cc', 'clean'],
        description: 'Elimina la cantidad de mensajes que deseas, con un máximo de 100.',
        category: 'Moderation',
        userPermission: ['MANAGE_MESSAGES'],
        botPermission: ['MANAGE_MESSAGES'],
        usage: ['<cantidad>'],
        examples: ['clear 100'],
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

    const fetched = message.channel
    let messageArray = message.content.split(" ")
    const amount = parseInt(args[0]) + 1

    if (isNaN(amount)) {
        return message.lineReplyNoMention(` ${this.client.emote.rabbitSleeping} ${lang.missArgsClear}`)
    } else if (amount <= 1 || amount > 100) {
        return message.lineReplyNoMention(` ${this.client.emote.rabbitSleeping} ${lang.maxClear}`)
    }

    fetched.bulkDelete(amount, true)
    fetched.bulkDelete(amount);
    let a = lang.messagesCleaned.replace("{amount}", amount)
    message.lineReplyNoMention(`${this.client.emote.happyChick} ${a}`).then(msg => msg.delete({timeout: 5000}))

    }
};
