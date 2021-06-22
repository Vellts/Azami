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

    async run(message, args, client = message.client) {

      const settings = await Guild.findOne({
        guildId: message.guild.id
      });
      const lang = require(`../../data/language/${settings.language}.js`)

    if(!args[0]) return message.channel.send(`${client.emote.rabbitShocket} ${lang.missArgsTC}`);

    const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0])
    if (args.length === 0 || args[0].toLowerCase() === 'Owner') return message.channel.send(`${client.emote.bunnyconfused} ${lang.notValidCategoryTC}`)

    const type = args.slice(0).join(" ").toString().toLowerCase();
    let description;

    if(type === "config") return message.channel.send(`${client.emote.rabbitMad} ${lang.configCategoryTC}`)
    const typesMain = message.client.utils.removeDuplicates(message.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
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
          const disabledd = disabledCommands.map(c => `\`${c}\``).join(' ') || '`Ninguno.`';
          const embed = new discord.MessageEmbed()
          .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
          .setDescription(description)
          .addField(lang.disableCategoryTC, disabledd)
          .setTimestamp()

          message.channel.send(embed).catch(()=>{
            const errorEmbed = new discord.MessageEmbed()
            .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
            .setDescription(description)
            .addField(lang.listCategoriesTextTC, lang.listCategoriesErrorTC, true)
            .setTimestamp()
            message.channel.send(errorEmbed).catch(()=>{})
           })
    } else return message.channel.send(`${client.emote.rabbitMad} ${lang.notValidCategoryTC}\n\n${client.emote.pinkarrow2} ${lang.validCategories}\n*${typesMain.join(", ")}*`)

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