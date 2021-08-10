const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const customCommand = require('../../database/schemas/customCommand.js');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'createcommand',
        aliases: ["ccreate", "commandcreate"],
        description: `Crea comandos personalizados que funcionan con el prefijo de Azami.`,
        category: 'Configuración',
        examples: ['ccreate Neour Obtén premium.'],
        userPermission: ['MANAGE_GUILD'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const guildDB = await Guild.findOne({
      guildId: message.guild.id
    });
    const lang = require(`../../data/language/${guildDB.language}.js`)

    let namee = args[0]
    if(!namee) return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.ccmissContent.replace('{prefix}', guildDB.prefix)}.`, allowedMentions: { repliedUser: false }})
    let content = args.slice(1).join(" ")
    let name = namee.toLowerCase()

    if (!content) return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.ccmissContent.replace('{prefix}', guildDB.prefix)}.`, allowedMentions: { repliedUser: false }})
    if (namee.length > 30) return message.reply({content: `${this.client.emote.rabbitMad} ${lang.ccmaxCommandLength}`, allowedMentions: { repliedUser: false }});
    if (content.length > 2000) return message.reply({content: `${this.client.emote.rabbitMad} ${lang.ccmaxResLength}`, allowedMentions: { repliedUser: false }}); 
    if (this.client.commands.get(namee) || this.client.aliases.get(namee)) return message.reply({content: `${this.client.emote.rabbitReally} ${lang.ccCommandExist}`, allowedMentions: { repliedUser: false }});


    if(guildDB.isPremium === "false"){
      const conditional = {
        guildId: message.guild.id
      }
      const results = await customCommand.find(conditional)

      if(results.length >= 10){
        return message.reply(`${this.client.emote.rabbitMad} ${lang.ccNotPremium}`)
      }
    }

    customCommand.findOne({ 
        guildId: message.guild.id,
        name
    }, async(err, data) => {
      if (!data) {
        customCommand.create({ guildId: message.guild.id, name, content });
        message.reply({content: `${this.client.emote.rocketPink} ${lang.ccSaveCommand} \`${name}\`!* ***\n\n${this.client.emote.pinkarrow2} ${lang.ccDeleteCommand.replace('{prefix}', guildDB.prefix)}***`, allowedMentions: { repliedUser: false }})
      } else {
        return message.reply({content: `${this.client.emote.rabbitMad} ${lang.ccCommandExist}`, allowedMentions: { repliedUser: false }})
      }
    })
  }
};