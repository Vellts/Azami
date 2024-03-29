const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setprefix',
        aliases: ['prefix'],
        description: 'Personaliza el prefix del servidor, al más comodo.',
        category: 'Configuración',
        usage: [ '<prefix>' ],
        examples: [ 'prefix az!', 'prefix +', 'prefix !' ],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
      const settings = await Guild.findOne({
        guildId: message.guild.id,
      }, (err, guild) => {
        if (err) console.log(err)
      });
      const lang = require(`../../data/language/${settings.language}.js`)

      let rex = new RegExp(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])|<(a|):.+?:\d+>|([\uD800-\uDBFF][\uDC00-\uDFFF])/g)
      let nprefix = args[0]
      if(!nprefix) return message.reply({content: `${this.client.emote.bunnyconfused} **¿Qué agregarás como prefix?**`, allowedMentions: { repliedUser: false }})
      if(rex.test(nprefix)) return message.reply({content: `***${this.client.emote.bunnyconfused} ¡Eh! No puedes usar emojis personalizados o emojis unicodes.***`, allowedMentions: { repliedUser: false }})
      if (nprefix.length < 1) return message.reply({content:`${this.client.emote.rabbitConfused} ${lang.missPrefix}`, allowedMentions: { repliedUser: false }})
      if(nprefix.length > 4) return message.reply({content:`${this.client.emote.rabbitReally} ${lang.maxLengthPrefix}`, allowedMentions: { repliedUser: false }})

      await settings.updateOne({
        prefix: nprefix
      });

      return message.reply({content:`${this.client.emote.crayons} ${lang.newPrefix.replace("{prefix}", nprefix)}`, allowedMentions: { repliedUser: false }})
    }
};
