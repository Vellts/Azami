const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setlang',
        aliases: ['lang'],
        description: 'Customiza el prefix al que desees.',
        category: 'a',
        usage: [ '<prefix>' ],
        examples: [ 'prefix $', 'prefix +', 'prefix ?' ],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
        disabled: true,
      });
    }

    async run(message, args, client = message.client) {
      const settings = await Guild.findOne({
        guildId: message.guild.id,
      }, (err, guild) => {
        if (err) console.log(err)
      });

      const language = require(`../../data/language/${settings.language}.js`)
      let languages = ['spanish', 'english']
      let lang = args[0]
      if(!lang) return message.lineReply(`${client.emote.rabbitShocket} ${language.missLang}`)
      let setLangInvalidOption = language.validLanguage.replace("{languages}", languages.join(", "))
      if(lang.includes('español'.toLowerCase())) {
        lang = 'spanish'
      } else if (lang.includes('ingles'.toLowerCase())) {
        lang = 'english'
      } else if(!languages.includes(lang.toLowerCase())) {
        return message.lineReply(`${client.emote.rabbitConfused} ${language.errorLang}\n\n${client.emote.pinkarrow2} ${setLangInvalidOption}.`)
      }
      let setLangChange = language.successLang.replace("{language}", lang.toLowerCase())
      message.channel.send(`${client.emote.stars1} ${setLangChange}`)
      
      await settings.updateOne({
        language: lang.toLowerCase()
      });


    }
};
