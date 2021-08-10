const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild')
const config = require('../../config.json');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'simprate',
        aliases: ["simp"],
        description: `Calcula que tan simp es la otra persona.`,
        usage: ['<@Mención>'],
        examples: ['simprate', 'simprate @Nero'],
        category: 'Fun',
        cooldown: 3,
      });
    }

    async run(message) {

    const settings = await Guild.findOne({ guildId: message.guild.id })
    const lang = require(`../../data/language/${settings.language}.js`)

    function random(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min +1)) + min
    }

    const member = message.mentions.users.first() || message.author
    let amount = random(1, 100)
    message.reply({embeds:
      [
        {
          title: 'Simprate',
          description: `${lang.IsSIMP.replace('{username}', member.username).replace('{per}', amount)}`,
          footer: {
            text: message.author.username,
            icon_url: message.author.displayAvatarURL({dynamic: true})
          },
          timestamp: new Date()
        }
      ], allowedMentions: { repliedUser: false }
    })
  }
};