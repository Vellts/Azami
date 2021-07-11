const Command = require('../../structures/Command');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'changemymind',
        aliases: ['ccm'],
        description: `Desafía a los otros, con tus palabras.`,
        category: 'memes',
        examples: ['changemymind <texto>'],
        botPermissions: ['ATTACH_FILES'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const text = args.join("+")
    if (!text) return message.channel.send(`${client.emote.bunnyconfused} ***¿Se te ha olvido agregar texto sir?***`)

    message.channel.send({ files: [{ attachment: `https://vacefron.nl/api/changemymind?text=${text}`, name: "changemymind.png"}]})


      }
};