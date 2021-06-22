const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const customCommand = require('../../database/schemas/customCommand.js');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'commandslist',
        aliases: ["commandlist", "cclist"],
        description: `Obtén la cantidad de comandos personalizados en el servidor.`,
        category: 'Configuración',
        examples: ['commandlist'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const guildDB = await Guild.findOne({
      guildId: message.guild.id
    });
    const lang = require(`../../data/language/${guildDB.language}.js`)

    await customCommand.find({
      guildId: message.guild.id,
    }, (err, data) => {
      if (!data && !data.name) return message.lineReplyNoMention(`${message.client.emoji.fail} ${language.cc5}`);
      let array =[]
      data.map((d, i) => array.push(d.name));

      let embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`${lang.ccListTitle.replace('{servername}', message.guild.name)}`)
      
      .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      .setTimestamp()

      if (!Array.isArray(array) || !array.length) {
        embed.setDescription(`${client.emote.rabbitMad} ${lang.ccErrorList}`)
      } else {
        embed.setDescription(`\`${(array).join(", ")}\``)
      }
      message.lineReplyNoMention(embed)
    });
  }
};