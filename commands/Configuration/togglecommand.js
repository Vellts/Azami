const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'togglecommand',
        description: 'Disable or enable commands in the guild',
        category: 'Configuración',
        examples: [ 'togglecommand angry'],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args, settings) {

    const lang = require(`../../data/language/${settings.language}.js`)

    if(!args[0]) return message.reply({content: `${this.client.emote.bunnyconfused} ${lang.missArgsTCC}`, allowedMentions: { repliedUser: false }});

    const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0])

    if (!command || (command && command.category == 'Owner')) return message.reply({content: `${this.client.emote.rabbitReally} ${lang.notValidCommandTCC}`, allowedMentions: { repliedUser: false }})

    if(command && command.category === "Config") return message.reply({content: `${this.client.emote.rabbitReally} ${lang.configCommandTCC}`, allowedMentions: { repliedUser: false }})

    let disabled = settings.disabledCommands
    if (typeof(disabled) === 'string') disabled = disabled.split(' ');

    let description;
    if (!disabled.includes(command.name || command)) {
      settings.disabledCommands.push(command.name || command); 
      description = `${lang.disableCommandTCC.replace('{commands}', command.name || command)}`;
    } else {
      removeA(disabled, command.name || command)
      description = `${lang.enableCommandTCC.replace('{commands}', command.name || command)}`;
    }
    await settings.save().catch(()=>{})

    const disabledCommands = disabled.map(c => `\`${c}\``).join(' ') || '\u200b';

    const embed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
      .addField(description, disabledCommands, true)
      .setTimestamp()
    message.reply({embeds: [embed], allowedMentions: { repliedUser: false }}).catch(()=>{
      const errorEmbed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
      .addField(description, `\`${lang.listCategoriesErrorTC}\``, true)
      .setTimestamp()
      message.reply({embeds: [embed], allowedMentions: { repliedUser: false }}).catch(()=>{})
    })
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