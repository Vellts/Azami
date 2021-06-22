const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'lisapresentation',
        aliases: ['lisap'],
        description: `Lisa presentando tus palabras..`,
        category: 'memes',
        examples: ['lisapresentation <texto>', 'lisap <texto>'],
        botPermissions: ['ATTACH_FILES'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const text = args.join("+")
    if (!text) return message.channel.send(`${client.emote.bunnyconfused} ***¿Se te ha olvido agregar texto sir?***`)

    let img = await new DIG.LisaPresentation().getImage(text)
    let att = new Discord.MessageAttachment(img, 'lisap.png')
    message.channel.send(att)


      }
};