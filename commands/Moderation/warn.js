const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require("discord.js")
const randoStrings = require("randostrings")
const random = new randoStrings
const Logging = require('../../database/schemas/logging.js')
const warnModel = require('../../models/moderation.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'warn',
        description: '¡Regala una advertencia! Que bien merecida la tiene.',
        category: 'Moderación',
        usage: ['<@Usario>'],
        examples: [ 'warn @Azami'],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args, client = message.client) {

    const settings = await Guild.findOne({ guildId: message.guild.id });
    const lang = require(`../../data/language/${settings.language}.js`)
    const logging = await Logging.findOne({ guildId: message.guild.id })

    let mention = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!mention) return message.reply({content: `${client.emote.rabbitMad} ${lang.missUserWR}`, allowedMentions: { repliedUser: false }})
    if(mention.user.bot) return message.reply({content: `${this.client.emote.bunnyPoke} ***¡Hey hey! No puedes advertir a bots.`, allowedMentions: { repliedUser: false }})

    const mentionedPotision = mention.roles.highest.position
    const memberPotision = message.member.roles.highest.position

    if (memberPotision <= mentionedPotision) return message.reply({content: `${client.emote.rabbitShocket} ${lang.highestRoleWR}`, allowedMentions: { repliedUser: false }})
    let razon = args.slice(1).join(' ') || 'Sin razón.'

    let warnID = random.password({
      length: 14,
      string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    })

    let warnDoc = await warnModel.findOne({
      guildID: message.guild.id,
      memberID: mention.id,
    }).catch(err => console.log(err))

    if (!warnDoc) {
      warnDoc = new warnModel({
        guildID: message.guild.id,
        memberID: mention.id,
        modAction: [],
        warnings: [],
        warningID: [],
        moderator: [],
        date: [],
      })
      await warnDoc.save().catch(err => console.log(err));
      warnDoc = await warnModel.findOne({
        guildID: message.guild.id,
        memberID: mention.id,
      })
    }

    warnDoc.modType.push("warn")
    warnDoc.warnings.push(razon)
    warnDoc.warningID.push(warnID)
    warnDoc.moderator.push(message.member.id)
    warnDoc.date.push(Date.now())/* asd */

    await warnDoc.save().catch(err => console.log(err))
    let dmEmbed = `${this.client.emote.BananaCat} ${lang.sendUserWanrWR.replace("{servername}", message.guild.name).replace("{author_username}", message.author.username).replace("{razon}", razon)}`
    mention.send({embeds: [{description: dmEmbed, color: 'RANDOM', author: {name: message.guild.name, icon_url: message.guild.iconURL({dynamic: true})}}]}).catch(()=>{})

    message.reply({embeds: [{color: 'RANDOM', description: `${client.emote.cuteBee} ${lang.sendWarnWR.replace("{username}", mention.user.username).replace("{razon}", razon)}`}], allowedMentions: { repliedUser: false }}).catch(()=>{});

    if(logging && logging.moderation.auto_punish.toggle === "true"){
      if(Number(logging.moderation.auto_punish.amount) <= Number(warnDoc.warnings.length)){
        const punishment = logging.moderation.auto_punish.punishment;
        let action;
        if(punishment === "1"){
          action = `banead@`;
          await mention.ban({ reason: `Autobaneo / Usuario responsable: ${message.author.tag}` }).catch(()=>{})
        } else if (punishment === "2"){
          action = `kikead@`;
          await mention.kick({ reason: `Autokickeo / Usuario responable: ${message.author.tag}` }).catch(()=>{})
        } else if (punishment === "3"){
          action = `Softbanead@`;
          await mention.ban({ reason:`Autoban / Usuario responable: ${message.author.tag}`, days: 7 });
          await message.guild.members.unban(mention.user, `Autodesbaneo / Usuario responsable: ${message.author.tag}`);
        }
        message.reply({embeds: [{description: `Castigo activado, ${action} **${mention.user.username}** ${client.emote.cuteBee}`, color: 'RANDOM'}], allowedMentions: { repliedUser: false }})
          const auto = logging.moderation.auto_punish;
          if(auto.dm && auto.dm !== "1"){
            let dmEmbed;
            if(auto.dm === "2"){
              dmEmbed = `${client.emote.cuteBee} Has sido ${action} de **${message.guild.name}**`
          } else if(auto.dm === "3"){
            dmEmbed = `${client.emote.cuteBee} Has sido ${action} de **${message.guild.name}**\n\n**Advertencias:** ${warnDoc.warnings.length}`
          }
          mention.send({embeds: [{color: 'RANDOM', description: dmEmbed, author: {name: message.guild.name, icon_url: message.guild.iconURL({dynamic: true})}}]})
          }
        }
      }

    if(logging){
      if(logging.moderation.delete_after_executed === "true"){
        message.delete().catch(()=>{})
      }
    const role = message.guild.roles.cache.get(logging.moderation.ignore_role);
    const channel = message.guild.channels.cache.get(logging.moderation.channel)

    if(logging.moderation.toggle == "true"){
      if(channel){
        if(message.channel.id !== logging.moderation.ignore_channel){
          if(!role || role && !message.member.roles.cache.find(r => r.name.toLowerCase() === role.name)){
            if(logging.moderation.warns == "true"){
              let color = logging.moderation.color;
              if(color == "#000000") color = message.client.color.red;
                let logcase = logging.moderation.caseN
                if(!logcase) logcase = `1`
                const logEmbed = new MessageEmbed()
                .setAuthor(`Acción: \`Warn\` | ${mention.user.tag} | Caso #${logcase}`, mention.user.displayAvatarURL({ format: 'png' }))
                .addField('User', mention, true)
                .addField('Moderator', message.member, true)
                .addField('Reason', razon, true)
                .setFooter(`ID: ${mention.id} | Warn ID: ${warnID}`)
                .setTimestamp()
                .setColor(color)
                channel.send({embeds: [logEmbed]}).catch((e)=>{console.log(e)})

      logging.moderation.caseN = logcase + 1
await logging.save().catch(()=>{})
}
      }
    }
    }
  }
}



function match(msg, i) {
  if (!msg) return undefined;
  if (!i) return undefined;
  let user = i.members.cache.find(
    m =>
      m.user.username.toLowerCase().startsWith(msg) ||
      m.user.username.toLowerCase() === msg ||
      m.user.username.toLowerCase().includes(msg) ||
      m.displayName.toLowerCase().startsWith(msg) ||
      m.displayName.toLowerCase() === msg ||
      m.displayName.toLowerCase().includes(msg)
  );
  if (!user) return undefined;
  return user.user;
}
};
};
