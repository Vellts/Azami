const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'baby',
        description: `Tal vez, te identifiques.`,
        category: 'Memes',
        usage: ['<Miembro opcional>'],
        examples: ['baby', 'baby @Nero.'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.displayName.toLowerCase() === args.join(" ").toLowerCase()) || message.member
    let img = await new DIG.Affect().getImage(user.user.displayAvatarURL({ format: 'png', size: 1024}))
    message.reply({
      files: [
        {
          attachment: img,
          name: `baby.png`
        }
      ], allowedMentions: { repliedUser: false }
    }) 


      }
};
