const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'userinfo',
        aliases: ['infouser'],
        description: 'Obtén la información del usuario.',
        category: 'Utilidad',
        usage: [''],
        example: ['userinfo @Azami'],
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

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    //return console.log(user.presence)
    if(user === user.user.bot) return;
    const server = await message.guild.members.fetch(user.id)

    /*let estato;
    switch (user.presence) {
        case user.presence.status === "online":
            estato = `<:Az_onlineStatus:854528081145364510> ${lang.onlineUF}`;
            break;
        case user.presence.status === "dnd":
            estato = `<:Az_dndStatus:854529483347197992> ${lang.dndUF}`;
            break;
        case user.presence.status === "idle":
            estato = `<:Az_idleStatus:854530327199481896> ${lang.idleUF}`;
            break;
        case user.presence.status === "offline":
            estato = `<:Az_offlineStatus:854530663838384178> ${lang.offlineUF}`;
            break;
        case null:
            estato = '\u200b'
    }*/

    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " dia" : " dias");
    }

    let badges = {
        DISCORD_EMPLOYEE: '<:Az_Demployee:854546051108044831>',
        HOUSE_BRILLIANCE: '<:Az_hBriliance:854544896417333258>',
        PARTNERED_SERVER_OWNER: '<:Az_Dpartner:854548029322821643>',
        HYPESQUAD_EVENTS: '<:Az_hypesquad:854548531012567050>',
        BUGHUNTER_LEVEL_1: '<:Az_bughunter1:854550285208518666>',
        HOUSE_BRAVERY: '<:Az_hbravery:854549594180681758>',
        HOUSE_BALANCE: '<:Az_hbalance:854549256378777631>',
        EARLY_SUPPORTER: '<:Az_earlysupporter:854550513709088768>',
        SYSTEM: '<:Az_systemUser:854551096922996746>',
        BUGHUNTER_LEVEL_2: '<:Az_bughunter2:854550368125976586>',
        VERIFIED_BOT: '<:Az_botverified:854551325323690005>',
        EARLY_VERIFIED_BOT_DEVELOPER: '<a:Az_botdeveloper:854551602777948241>'
    }
    let nrt = user.user.displayAvatarURL().endsWith(".gif") ? "<:Az_dnitro:855250997730082827>" : ""
    let bst = user.premiumSinceTimestamp ? '<a:Az_dboost:855250325032534036>' : ''

    let permisos = {
        CREATE_INSTANT_INVITE: "Crear invitación instantanea",
        KICK_MEMBERS: "Expulsar miembros",
        BAN_MEMBERS: "Banear miembros",
        ADMINISTRATOR: "Administrador",
        MANAGE_CHANNELS: "Gestionar canales",
        MANAGE_GUILD: "Gestionar servidor",
        ADD_REACTIONS: "Agregar reacciones",
        VIEW_AUDIT_LOG: "Ver el registro de auditoría",
        PRIORITY_SPEAKER: "Prioridad de palabra",
        STREAM: "Vídeo",
        VIEW_CHANNEL: "Ver canales",
        SEND_MESSAGES: "Enviar mensajes",
        SEND_TTS_MESSAGES: "Enviar mensajes de texto a voz",
        MANAGE_MESSAGES: "Gestionar mensajes",
        EMBED_LINKS: "Insertar enlaces",
        ATTACH_FILES: "Adjuntar archivos",
        READ_MESSAGE_HISTORY: "Leer el historial de mensajes",
        MENTION_EVERYONE: "Mencionar everyone",
        USE_EXTERNAL_EMOJIS: "Usar emojis externos",
        VIEW_GUILD_INSIGHTS: "Ver información del servidor",
        CONNECT: "Conectarse",
        SPEAK: "Hablar",
        MUTE_MEMBERS: "Silenciar miembros",
        DEAFEN_MEMBERS: "Ensorceder miembros",
        MOVE_MEMBERS: "Mover miembros",
        USE_VAD: "Usar actividad de voz",
        CHANGE_NICKNAME: "Cambiar apodo",
        MANAGE_NICKNAMES: "Gestionar apodos",
        MANAGE_ROLES: "Gestionar roles",
        MANAGE_WEBHOOKS: "Gestionar webhooks",
        MANAGE_EMOJIS: "Gestionar emojis",
        USE_SLASH_COMMANDS: "Usar comandos de barra diagonal",
        REQUEST_TO_SPEAK: "Solicitar hablar",
        MANAGE_THREADS: "Gestionar hilos",
        USE_PUBLIC_THREADS: "Usar hilos públicos",
        USE_PRIVATE_THREADS: "Usar hilos privados"
    }

    const embed = new MessageEmbed()
    .setTitle(`${lang.infouserUF} ${user.user.username}`)
    .setColor(`RANDOM`)
    .setThumbnail(user.user.displayAvatarURL({dynamic : true}))
    .setDescription(`
    > **\`Usuario\`:** *${user}*
    > **\`Id\`:** *${user.id}*
    > **\`Tag\`:** *${user.user.tag}*
    > **\`Badges\`:** ${user.user.flags ? user.user.flags.toArray().map(flag => `${badges[flag]}`) : ""} ${bst} ${nrt}
    > **\`Cuenta creada\`:** *${user.user.createdAt.toLocaleDateString("es-co")} (${checkDays(user.user.createdAt)})*
    > **\`Ingreso al servidor\`:** *${user.joinedAt.toLocaleDateString("es-co")} (${checkDays(user.joinedAt)})*
    \n
    > **\`Permisos\`:** \`\`\`${server.permissions.toArray().map(x => permisos[x]).join(", ")}\`\`\`
    > **\`Roles\`:** \`\`\`${server.roles.cache.map(role => role.name.toString()).slice(0, 100).join(", ")}\`\`\`
    `)
    .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setTimestamp()
    /*.addField("🆔 ID", user.user.id)
    .addField(`💠 ${lang.statusUserUF}`, status)
    .addField(`♾ ${lang.estadoUserUF}`, user.presence.activities[0] ? user.presence.activities[0].state : "Sin estado")
    .addField(`📟 ${lang.createdAtUserUF}`, `${user.user.createdAt.toLocaleDateString("es-co")} (${checkDays(user.user.createdAt)})`)
    .addField(`🗄 ${lang.joinedAtUserUF}`, `${user.joinedAt.toLocaleDateString("es-co")} (${checkDays(user.joinedAt)})`)
    .addField(`🎎 ${lang.rolesUserUF}`, user.roles.cache.map(role => role.toString()).join(" ,"))*/
    message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})

    }
};
