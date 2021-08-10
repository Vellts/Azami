const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const customCommand = require('../../database/schemas/customCommand.js');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'deletecommand',
        aliases: ["dcommand", "dcc"],
        description: `Elimina los comandos personalizados que ya no deseas en el servidor.`,
        category: 'Configuración',
        examples: ['dcc Neour'],
        userPermission: ['MANAGE_GUILD'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    const guildDB = await Guild.findOne({
      guildId: message.guild.id
    });
    const lang = require(`../../data/language/${guildDB.language}.js`)

    let namee = args[0]
    if (!namee) return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.ccmissContent}.`, allowedMentions: { repliedUser: false }})
    let name = namee.toLowerCase()
    if (name.length > 30) return message.reply({content:`${this.client.emote.rabbitMad} ${lang.ccmaxCommandLength}`, allowedMentions: { repliedUser: false }});

    let data = customCommand.findOne({ guildId: message.guild.id, name: name})
      if (data) {
        await customCommand.findOneAndDelete({ guildId: message.guild.id, name: name })
        message.reply({content:`${this.client.emote.rocketPink} ${lang.ccDeletingCommand.replace('{nombre}', name)}`, allowedMentions: { repliedUser: false }})
      } else {
        return message.reply({content:`${this.client.emote.rabbitMad} ${lang.ccNotFound}`, allowedMentions: { repliedUser: false }})
      }
  }
};