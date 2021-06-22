const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, MessageAttachment } = require('discord.js')
const fs = require('fs')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'serverinfo',
        aliases: ['infoserver'],
        description: 'Obtén la información del servidor.',
        category: 'Utilidad',
        usage: [''],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    const guild = message.guild

    let region = lang.regionsSI

    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " dia" : " dias");
    }

    let verifLevels = {
        NONE: "Nulo",
        LOW: "Bajo",
        MEDIUM: "Medio",
        HIGH: "Alto",
        VERY_HIGH: "Muy alto"
    }

    let dateOptions = {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    }

    let embed = new MessageEmbed()
    .setTitle('información del servidor')
    .setThumbnail(guild.iconURL({dynamic: true}))
    .addField('<:Az_server:855276936920956938> `Nombre`', guild.name, true)
    .addField('<a:Az_pinkarrow:839221969521213520> `Creación`', new Intl.DateTimeFormat('es-ES', dateOptions).format(guild.createdAt), true)
    .addField('<:Az_serverid:855278874317160478> `Server id`', guild.id, true)
    .addField('<:Az_planet:855279969352679464> `Región`', region[guild.region], true)
    .addField('<a:Az_sleeping:855625624625348608> `Canal afk`', guild.afkChannel ? guild.afkChannel : 'None', true)
    .addField('<:Az_BlurpleSparkles:855626539256250408> `Tiempo Afk`', guild.afkTimeout ? guild.afkTimeout : '0', true)
    .addField('<:Az_brpMembers:855627591486799882> `Humanos`', guild.members.cache.filter(m => !m.user.bot).size, true)
    .addField('<:Az_collarPink:855630230231318538> `Bots`', guild.members.cache.filter(m => m.user.bot).size, true)
    .addField('<a:Az_octopusPink:855630692217782292> `Miembros máximos`', guild.maximumMembers, true)
    .addField('<a:Az_kawaiiWatermelon:855633865469067285> `Emojis`', guild.emojis.cache.size, true)
    .addField('<a:Az_blueBoost:855634353450516500> `Boost`', guild.premiumSubscriptionCount.toString(), true)
    .addField('<:Az_BoostTier:855634782893113344> `Tier`', guild.premiumTier, true)
    .addField('<:Az_discordverify:855635099902804008> `¿Verificado?`', guild.verified ? guild.verified : "None", true)
    .addField(`<:Az_dchannels:855635486140006410> \`Canales\` **[${guild.channels.cache.size}]**`, `**Categorias**: [${guild.channels.cache.filter(x => x.type === "category").size}]\n**Texto**: [${guild.channels.cache.filter(x => x.type === "text").size}]\n **Voz**: [${guild.channels.cache.filter(x => x.type === "voice").size}]`, true)
    .addField('<:Az_verify:855635873331544104> `Nivel verificación`', verifLevels[guild.verificationLevel], true)
    .addField('<:Az_dmention:855636125476716544> `Roles`', `\`\`\`${guild.roles.cache.map(x => x.name.toString()).slice(0, 10).join(', ')}...\`\`\``)
    if(guild.banner) embed.setImage(guild.banner)
    /*.setTitle(`/*${lang.titleServerSI}${message.guild.name}`)
    .setThumbnail(guild.iconURL())
    .addField(lang.idServerSI, guild.id, true)
    .addField(lang.createAtServerSI, `${guild.createdAt.toDateString().split(" ")[2]}/${guild.createdAt.toDateString().split(" ")[1]}/${guild.createdAt.toDateString().split(" ")[3]} (${checkDays(message.channel.guild.createdAt)})`)
    .addField(lang.regionSI, region[guild.region], true)
    .addField(lang.ownerUserSI,`${guild.owner.user.username}`)
    .addField(lang.ownerUserIdSI,`${guild.ownerID}`)
    .addField(`${lang.channelsSI} [${guild.channels.cache.size}]ㅤㅤ`, `${lang.categoriesSI} ${guild.channels.cache.filter(x => x.type === "category").size} ${lang.textoSI} ${guild.channels.cache.filter(x => x.type === "text").size} ${lang.vozSI} ${guild.channels.cache.filter(x => x.type === "voice").size}`, true)
    .addField(lang.membersSI, message.guild.members.cache.filter(m => !m.user.bot).size)
    .addField(lang.botsSI,`${message.guild.members.cache.filter(m => m.user.bot).size}`)
    .addField(lang.emojisSI, message.guild.emojis.cache.size)
    .addField(lang.boostSI, message.guild.premiumSubscriptionCount.toString())
    .addField(lang.verificationLevel, message.guild.verificationLevel)
    .addField(lang.rolesSI, guild.roles.cache.size,true)
    .setColor("RANDOM")*/

    message.lineReplyNoMention(embed)

    }
};
