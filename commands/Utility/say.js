const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'say',
        description: 'Tus palabras dichas por Azami.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: ['say ¡Hey!'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let content = args.join(" ")
    if(!content) return;

    message.channel.send(content, { allowedMentions: { parse:["users"] } })
    message.delete()

    }
};
