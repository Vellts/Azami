const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'lisapresentation',
        aliases: ['lisap'],
        description: `Lisa presentando tus palabras..`,
        category: 'Memes',
        usage: ['<Texto>'],
        examples: ['lisapresentation Woh', 'lisap Cool'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const text = args.join("+")
    if (!text) return message.reply({content: `${client.emote.bunnyconfused} ***¿Se te ha olvido agregar texto sir?***`, allowedMentions: { repliedUser: false }})

    let img = await new DIG.LisaPresentation().getImage(text)
    message.reply({
      files: [
        {
          attachment: img,
          name: `lisap.png`
        }
      ], allowedMentions: { repliedUser: false }
    })


      }
};
