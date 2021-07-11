const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'stonks',
        description: `Activos positivos para ti.`,
        category: 'memes',
        examples: ['stonks', 'stonks <@user>'],
        botPermissions: ['ATTACH_FILES'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    let user = message.mentions.users.first() || this.client.users.cache.find(user => user.username.toLowerCase() == args.join(' ').toLowerCase()) || this.client.users.cache.find(user => user.tag.toLowerCase() == args.join(' ').toLowerCase()) || message.author

    let img = await new DIG.Stonk().getImage(user.displayAvatarURL({ format: 'png', size: 1024}))
    let att = new Discord.MessageAttachment(img, 'stonks.png')
    message.channel.send(att)


      }
};