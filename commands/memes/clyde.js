const Command = require('../../structures/Command');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'clyde',
        description: `Tus palabras dichas por clyde.`,
        category: 'memes',
        examples: ['changemymind <texto>'],
        botPermissions: ['ATTACH_FILES'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const text = args.join("+")
    if (!text) return message.channel.send(`${client.emote.bunnyconfused} ***¿Se te ha olvido agregar texto sir?***`)

    message.channel.send({files : [{attachment: `https://ctk-api.herokuapp.com/clyde/${text}`, name: 'clyde.png'}]})


      }
};