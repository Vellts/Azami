const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'togglecommand',
        description: 'Disable or enable commands in the guild',
        category: 'Configuration',
        examples: [ 'togglecommand angry'],
        cooldown: 3,
        guildOnly: true,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
      const settings = await Guild.findOne({
        guildId: message.guild.id,
      }, (err, guild) => {
        if (err) console.log(err)
      });

      const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
      const lang = require(`../../data/language/${guildDB.language}.js`)

      if(!args[0]) return message.channel.send(`${client.emote.bunnyconfused} ${lang.missArgsTCC}`);

       const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0])

    if (!command || (command && command.category == 'Owner')) 
      return message.channel.send(`${client.emote.rabbitReally} ${lang.notValidCommandTCC}`)

  if(command && command.category === "Config") return message.channel.send(`${client.emote.rabbitReally} ${lang.configCommandTCC}`)

       let disabled = guildDB.disabledCommands
       if (typeof(disabled) === 'string') disabled = disabled.split(' ');

    let description;

    if (!disabled.includes(command.name || command)) {
      guildDB.disabledCommands.push(command.name || command); 
      description = `${lang.disableCommandTCC.replace('{commands}', command.name || command)}`;
    
    } else {
      removeA(disabled, command.name || command)
      description = `${lang.enableCommandTCC.replace('{commands}', command.name || command)}`;
    }
     await guildDB.save().catch(()=>{})

     const disabledCommands = disabled.map(c => `\`${c}\``).join(' ') || `\`${lang.disableCommandsTCC}\``;

         const embed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField(lang.disableCommandsListTCC, disabledCommands, true)
      .setTimestamp()
 message.channel.send(embed).catch(()=>{
               const errorEmbed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField(lang.disableCommandsListTCC, `\`${lang.listCategoriesErrorTC}\``, true)
      .setTimestamp()
      message.channel.send(errorEmbed).catch(()=>{})
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