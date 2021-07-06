const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const moment = require("moment")
const { MessageEmbed } = require('discord.js');
const warnModel = require('../../models/moderation.js');
const ReactionMenu = require('../../structures/ReactionMenu.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'warnings',
        description: 'Disable or enable commands in the guild',
        category: 'config',
        examples: [ 'togglecommand rob'],
        cooldown: 3,
        guildOnly: true,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args, client = message.client) {

    const settings = await Guild.findOne({
      guildId: message.guild.id
    })
    const lang = require(`../../data/language/${settings.language}.js`)

    let mention = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    const warnDoc = await warnModel.findOne({ guildID: message.guild.id, memberID: mention.id }).catch(err => console.log(err))
    if (!warnDoc || !warnDoc.warnings.length) return message.channel.send({embed: {color: 'RANDOM', description: `${lang.emptyWarnsWN}`}})

    const data = []
    for (let i = 0; warnDoc.warnings.length > i; i++) {
      data.push(`${lang.moderatorWN} ${await message.client.users.fetch(warnDoc.moderator[i])}\n${lang.reasonWN} ${warnDoc.warnings[i]}\n${lang.dateWN} ${moment(warnDoc.date[i]).format("dddd, MMMM Do YYYY")}\n**Warning ID:** ${i + 1}\n`)
    }
        
    const count = warnDoc.warnings.length;

    const embed = new MessageEmbed()
      //.setAuthor(mention.user.tag, mention.user.displayAvatarURL({ dynamic: true }))
      
      .setThumbnail(message.guild.iconURL({dynamic: true}))
      .setTimestamp()

    const buildEmbed = (current, embed) => {
      const max = (count > current + 4) ? current + 4 : count;
      let amount = 0;
      //let moderador = me
      for (let i = current; i < max; i++) {
        if (warnDoc.warnings[i].length > 1000) warnDoc.warnings[i] = warnDoc.warnings[i].slice(0, 1000) + '...';
          embed // Build warning list
            .addField('\u200b', `${lang.warnTitleWN.replace("{i + 1}", i + 1)}`)
            .addField(`Warning ID` || `${lang.emptyWN}`, `${warnDoc.warningID[i]}`, true)
            .addField(`${lang.moderatorWN}` || `${lang.emptyWN}`, message.guild.members.cache.get(warnDoc.moderator[i]).user.tag, true)
            //.addField(`Acción` || 'Desconocido', warnDoc.modType[i], true) //it says if its mute or warn or ban etc
            .addField(`${lang.reasonWN}` || `${lang.emptyWN}`, warnDoc.warnings[i], true)
            .addField(`${lang.dateWN}` || `${lang.emptyWN}`, `${moment(warnDoc.date[i]).locale("es-co").fromNow()}`, true);
            amount += 1;
      }
    return embed
      .setTitle(`${lang.titleWarnsWN}`)
      .setDescription(`${lang.descriptionWarnsWN.replace("{user_tag}", mention.user.tag).replace("{count}", count)}`)
      .setFooter(`${message.author.username} [${current} - ${max}]`, message.author.displayAvatarURL({ dynamic: true }))
    };

    if (count < 4) return message.channel.send({embeds: [buildEmbed(0, embed)]});
      else {
        let n = 0;
        const json = embed.setFooter(
          `${lang.ExpiredAt}\n` + message.member.displayName, 
          message.author.displayAvatarURL({ dynamic: true })
        ).toJSON(); 

        const first = () => {
          if (n === 0) return;
            n = 0;
            return buildEmbed(n, new MessageEmbed(json));
          };
    
        const previous = () => {
          if (n === 0) return;
            n -= 4;
            if (n < 0) n = 0;
            return buildEmbed(n, new MessageEmbed(json));
        };
    
        const next = () => {
          const cap = count - (count % 4);
          if (n === cap || n + 4 === count) return;
            n += 4;
            if (n >= count) n = cap;
            return buildEmbed(n, new MessageEmbed(json));
        };
    
        const last = () => {
          const cap = count - (count % 4);
          if (n === cap || n + 4 === count) return;
            n = cap;
            if (n === count) n -= 4;
            return buildEmbed(n, new MessageEmbed(json));
        };
    
        const reactions = {
          '⏪': first,
          '◀️': previous,
          '⏹️': null,
          '▶️': next,
          '⏩': last,
        };
    
        const menu = new ReactionMenu(
          message.client,
          message.channel, 
          message.member, 
          buildEmbed(n, new MessageEmbed(json)), 
          null,
          null,
          reactions, 
          180000
        )
    
        menu.reactions['⏹️'] = menu.stop.bind(menu)
    };
  }
}    
