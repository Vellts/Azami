const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'pressf',
        description: `Muestra tus respetos a la entidad deseada.`,
        category: 'memes',
        examples: ['pressf', 'pressf <@user>'],
        botPermissions: ['ATTACH_FILES'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    let user = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase()) || message.author

    let img = await new DIG.Rip().getImage(user.displayAvatarURL({ format: 'png', size: 1024}))
    let att = new Discord.MessageAttachment(img, 'ripeo.png')
    message.channel.send(att)


      }
};