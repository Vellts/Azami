const Event = require('../../structures/Event');
const { Permissions, Collection } = require("discord.js");
const discord = require("discord.js");
const config = require('./../../config.json');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../database/schemas/Guild');
const permissions = require('../../permissions.json');
const moment = require('moment');
require("moment-duration-format");
const afkM = require("../../models/afk");
const customCommand = require('../../database/schemas/customCommand');
const levelModel = require('../../database/schemas/levelsSystem');
const fetchAllies = require('../../data/fetchAllies.js');
const getXp = require('../../data/levelsMessage.js');
const getRoles = require('../../data/levelRoles.js');
const embedModel = require('../../database/schemas/embedSettings');
const xpSystem = require('../../packages/Levels/index');

module.exports = class extends Event {
  constructor(...args) {
    super(...args);

    this.impliedPermissions = new Permissions([
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "ADD_REACTIONS"
    ]);

    this.ratelimits = new Collection();
  }

  async run(message) {
    if (!message.guild || message.author.bot) return;

    try {
      const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
      const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);

      const settings = await Guild.findOne({
        guildId: message.guild.id,
      }, async (err, guild) => {
        if (err) console.log(err)
        if (!guild) {
          const newGuild = await Guild.create({
            guildId: message.guild.id,
            prefix: config.prefix || '?',
          })
        }
      });

      const levels = await levelModel.findOne({
        guildId: message.guild.id,
      }, async (err, guild) => {
        if (err) console.log(err)
        if (!guild) {
          const newLevel = await levelModel.create({
            guildId: message.guild.id
          })
        }
      });

    if (message.content.match(mentionRegex)) return message.channel.send(`¡Hey que tal! Mi prefix en ${message.guild.name}** es ${settings.prefix || '?' }.`).catch(()=>{})

    let mainPrefix = settings ? settings.prefix : '?';
    const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : mainPrefix
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    moment.suppressDeprecationWarnings = true;

  if(message.mentions.members.first()){

        const userAfk = await afkM.findOne({ userId: message.mentions.members.first().id, guildId: message.guild.id});
        if(userAfk){

           await message.guild.members.fetch(userAfk.userId).then(member => {
           return message.channel.send(new Discord.MessageEmbed()
      .setTitle(`El usuario se encuentra afk.`)
      .setDescription(`
Estado afk de **${member.user.username}**: ${userAfk.estado}
Tiempo afk: ${moment(userAfk.timestamp).locale("es-co").fromNow()}
      `)
      )
           });
        }
        }

        const userAfk = await afkM.findOne({ userId: message.author.id, guildId: message.guild.id});


        if(userAfk) {

          await afkM.deleteOne({ userId: message.author.id });
          return message.channel.send(`
${message.author}, he removido tu estado afk.
**Estado**: ${userAfk.estado}
**Tiempo afk**: ${moment(userAfk.timestamp).locale("es-co").fromNow()}.
`).then(msg => msg.delete({timeout: 15000}))

        };

    //partners system
    if (settings && await fetchAllies(message)) return;
    //if(levels && await getXp(message)) return;

    // level system


    if (message.content.toLowerCase().startsWith(prefix)){

      const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));


      const customCommandSettings = await customCommand.findOne({ guildId: message.guild.id, name: cmd.toLowerCase() });
      if (customCommandSettings && customCommandSettings.name && customCommandSettings.content) {
        return message.channel.send(customCommandSettings.content
          .replace(/{user}/g, `${message.author}`)
          .replace(/{user_tag}/g, `${message.author.tag}`)
          .replace(/{user_name}/g, `${message.author.username}`)
          .replace(/{user_ID}/g, `${message.author.id}`)
          .replace(/{guild_name}/g, `${message.guild.name}`)
          .replace(/{guild_ID}/g, `${message.guild.id}`)
          .replace(/{memberCount}/g, `${message.guild.memberCount}`)
          .replace(/{size}/g, `${message.guild.memberCount}`)
          .replace(/{guild}/g, `${message.guild.name}`)
          .replace(/{member_createdAtAgo}/g, `${moment(message.author.createdTimestamp).fromNow()}`)
          .replace(/{member_createdAt}/g, `${moment(message.author.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
        )
      }

      if (command) {

        const disabledCommands = guildDB.disabledCommands;
        if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

        const rateLimit = this.ratelimit(message, cmd);
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
        if (typeof rateLimit === "string") return message.channel.send(`${message.author}, espera **${rateLimit}** antes de volver a ejecutar **${cmd}**.`);

        if (command.botPermission) {
          const missingPermissions = message.channel.permissionsFor(message.guild.me).missing(command.botPermission).map(p => permissions[p]);
          if (missingPermissions.length !== 0) return message.channel.send({embed: { title: '¡Error!', description: `Comando: **${command.name}**\nRequiere los siguientes permisos: \n\n**${missingPermissions.map(p => `${p}`).join(' - ')}**` }})
        }
        if (command.userPermission) {
          const missingPermissions = message.channel.permissionsFor(message.author).missing(command.userPermission).map(p => permissions[p]);
          if (missingPermissions.length !== 0) return message.channel.send({embed: { title: '¡Error! No tienes permisos.', description: `Commando: **${command.name}**\nRequiere los siguientes permisos: **${missingPermissions.map(p => `${p}`).join('\n')}**` }})
        }
        if (command.ownerOnly) {
          if (!this.client.config.developers.includes(message.author.id)) return message.channel.send(`Comando sólo para owners.`)
        }

        if(command.voiceOnly){
          if(!message.member.voice.channel) return message.channel.send('nostas en voz').then(m => m.timedDelete(5000));
        }

        if (command.disabled) return message.channel.send(`El comando ha sido deshabilitado por los owners.`)

        if(disabledCommands.includes(command.name || command)) return message.channel.send('Comando deshabilitado.');

      await this.runCommand(message, cmd, args, settings).catch(error => {
      this.client.channels.cache.get('856714305029013525').send(new MessageEmbed()
          .setTitle(`Nuevo error ejecutando la función de los comandos.`)
          .setDescription(`\`\`\`${error}\`\`\``))
      console.log(error)
      return message.channel.send(`Ha ocurrido un error. Contacta con los desarrolladores. https://azami.xyz/contact`)
        })
      }
    } else if(message.guild){

      if(levels && await getXp(message)) return;
      if(levels && await getRoles(message)) return;
    }
    } catch(error) {
      this.client.channels.cache.get('856714305029013525').send(new MessageEmbed()
          .setTitle(`Nuevo error para un comando.`)
          .setDescription(`\`\`\`${error}\`\`\``))
      console.log(error)
      return message.channel.send(`Ha ocurrido un error. Contacta con los desarrolladores. https://azami.xyz/contact`)
    }
  }

    async runCommand(message, cmd, args, settings) {

        if (!message.channel.permissionsFor(message.guild.me) || !message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
          return message.channel.send(`${message.client.emoji.fail} Missing bot Permissions - **Embeds Links**`)

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

        this.client.commandCount++;
        await command.run(message, args, settings)
    }

    ratelimit(message, cmd) {
      try {
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        if (message.author.permLevel > 4) return false;

        const cooldown = command.cooldown * 1000
        const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
        if (!ratelimits[command.name]) ratelimits[command.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
        const difference = Date.now() - ratelimits[command.name]; // easier to see the difference
        if (difference < cooldown) { // check the if the duration the command was run, is more than the cooldown
          return moment.duration(cooldown - difference).format("D [dias], H [horas], m [minutos], s [segundos]", 1); // returns a string to send to a channel
        } else {
          ratelimits[command.name] = Date.now(); // set the key to now, to mark the start of the cooldown
          this.ratelimits.set(message.author.id, ratelimits); // set it
          return true;
        }
      } catch(e) {
        this.client.channels.cache.get('856714305029013525').send(new MessageEmbed()
          .setTitle(`Nuevo error para el ratelimit.`)
          .setDescription(`\`\`\`${e}\`\`\``))
        message.channel.send(`Ha ocurrido un error. Contacta con los desarrolladores. https://azami.xyz/contact`)
        console.log(e)
      }
    }
}
