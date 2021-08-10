const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'togglecategory',
        description: 'Deshabilita los comandos de una categoría en especifico.',
        category: 'Configuración',
        usage: ['<categoria>'],
        examples: [ 'togglecategory fun'],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args, settings) {

    const lang = require(`../../data/language/${settings.language}.js`)

    if(!args[0]) return message.reply({content: `${this.client.emote.rabbitShocket} ${lang.missArgsTC}`, allowedMentions: { repliedUser: false }});

    const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0])
    if (args.length === 0 || args[0].toLowerCase() === 'Owner') return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.notValidCategoryTC}`, allowedMentions: { repliedUser: false }})

    const type = args.slice(0).join(" ").toString().toLowerCase();
    let description;

    if(type === "config") return message.reply({content: `${this.client.emote.rabbitMad} ${lang.configCategoryTC}`, allowedMentions: { repliedUser: false }})
    const typesMain = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
    const types = typesMain.map(item => item.toLowerCase());
    const commands = message.client.commands.array().filter(c => c.category.toLowerCase() === type);
    let disabledCommands = settings.disabledCommands

    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ')
    if (types.includes(type)) {
      if (commands.every(c => disabledCommands.includes(c.name || c))) {
        for (const cmd of commands) {
          if (disabledCommands.includes(cmd.name || cmd)) 
            removeA(disabledCommands, cmd.name || cmd)
        }
        description = `${lang.enableCategoryTC.replace('{type}', type)}`;
      } else {
        for (const cmd of commands) {
          if (!disabledCommands.includes(cmd.name || cmd)) {
            settings.disabledCommands.push(cmd.name || cmd); 
          }
        }
        description = `${lang.disableCategoryTC.replace('{type}', type)}`;
      }
      await settings.save().catch(()=>{})
      const disabledd = disabledCommands.map(c => `\`${c}\``).join(' ') || '\u200b';
      const embed = new discord.MessageEmbed()
      .setAuthor(message.author.username, message.guild.iconURL({ dynamic: true }))
      .addField(description, disabledd)
      .setTimestamp()
      message.reply({embeds: [embed], allowedMentions: { repliedUser: false }}).catch(()=>{
        const errorEmbed = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
        .addField(description, lang.listCategoriesErrorTC, true)
        .setTimestamp()
        message.reply({embeds: [errorEmbed], allowedMentions: { repliedUser: false }}).catch(()=>{})
      })
    } else return message.reply({content: `${this.client.emote.rabbitMad} ${lang.notValidCategoryTC}\n\n${this.client.emote.pinkarrow2} ${lang.validCategories}\n*${typesMain.join(", ")}*`, allowedMentions: { repliedUser: false }})
  }
}    
  
function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax= arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}