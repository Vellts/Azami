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

    const server = await message.guild.members.fetch({force: true})
    const srv = await message.guild.fetch()
    const ch = await message.guild.channels.fetch()
    const guild = message.guild
    const owner = await message.guild.fetchOwner()


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

    let guildTier = {
      NONE: "Nivel 0.",
      TIER_1: "Nivel 1.",
      TIER_2: "Nivel 2.",
      TIER_3: "Nivel 3."
    }

    let nivelNsfw = {
      DEFAULT: "Predeterminado.",
      EXPLICIT: "Explicito.",
      SAFE: "¡Quiero estar seguro!",
      AGE_RESTRICTED: "Restricción de edad."
    }

    let dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    let embed = new MessageEmbed()
    .setTitle('Información del servidor')
    .setThumbnail(guild.iconURL({dynamic: true}))
    .addField('<:Az_server:855276936920956938> `Nombre`', guild.name, true)
    .addField('<a:Az_pinkarrow:839221969521213520> `Creación`', new Intl.DateTimeFormat('es-ES', dateOptions).format(guild.createdAt), true)
    .addField('<:Az_serverid:855278874317160478> `Server ID`', guild.id, true)
    .addField(`${this.client.emote.pinkarrow2} Owner`, owner.user.tag, true)
    .addField('<a:Az_octopusPink:855630692217782292> `Miembros Totales`', `${srv.approximateMemberCount}`, true)
    .addField('<:Az_brpMembers:855627591486799882> `Humanos`', `${server.filter(m => !m.user.bot).size}`, true)
    .addField('<:Az_collarPink:855630230231318538> `Bots`', `${server.filter(m => m.user.bot).size}`, true)
    .addField('<a:Az_sleeping:855625624625348608> `Canal afk`', guild.afkChannel ? guild.afkChannel : 'Sin establecer.', true)
    .addField('<a:Az_kawaiiWatermelon:855633865469067285> `Emojis`', `${srv.emojis.cache.size}`, true)
    .addField('<a:Az_blueBoost:855634353450516500> `Boost`', guild.premiumSubscriptionCount.toString(), true)
    .addField('<:Az_BoostTier:855634782893113344> `Tier`', guildTier[guild.premiumTier], true)
    .addField('<:Az_discordverify:855635099902804008> `¿Verificado?`', guild.verified ? guild.verified : "No verificado.", true)
    .addField('<:Az_verify:855635873331544104> `Nivel verificación`', verifLevels[guild.verificationLevel], true)
    .addField('<:Az_nsfw:868532892094050346> `Nivel Nsfw`', nivelNsfw[guild.nsfwLevel], true)
    .addField('<:Az_butterfly:868533404411498529> `Vanity URL`', message.guild.vanityURLCode ? `(Url)[https://discord.gg/${message.guild.vanityURLCode}]` : "No cuenta con vanity url.", true)
    .addField(`<:Az_dchannels:855635486140006410> \`Canales\` **[${ch.size}]**`, `**Categorias**: [${ch.filter(x => x.type === "GUILD_CATEGORY").size}]\n**Texto**: [${ch.filter(x => x.type === "GUILD_TEXT").size}]\n **Voz**: [${ch.filter(x => x.type === "GUILD_VOICE").size}]\n **Hilos públicos**: [${ch.filter(x => x.type === "GUILD_PUBLIC_THREAD").size}]\n **Stage**: [${ch.filter(x => x.type === "GUILD_STAGE_VOICE").size}]`, true)
    .addField('<:Az_dmention:855636125476716544> `Roles`', `\`\`\`${guild.roles.cache.map(x => x.name.toString()).slice(0, 10).join(', ')}...\`\`\``)
    if(guild.banner) embed.setImage(guild.banner)

    message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})

    }
};
