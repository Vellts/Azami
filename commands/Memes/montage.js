const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'montage',
        description: `Tu avatar como obra de arte.`,
        category: 'Memes',
        usage: ['Miembro opcional>'],
        examples: ['montage', 'montage @Nero.'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase()) || message.member
    let img = await new DIG.Ad().getImage(user.user.displayAvatarURL({ format: 'png', size: 1024}))
    message.reply({
      files: [
        {
          attachment: img,
          name: `montage.png`
        }
      ], allowedMentions: { repliedUser: false }
    })
  }
};
