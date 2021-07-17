const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'ban',
        description: 'Has que no vuelvan los malechores.',
        category: 'Moderation',
        userPermission: ['BAN_MEMBERS'],
        botPermission: ['BAN_MEMBERS'],
        usage: ['<miembro>'],
        examples: ['ban @Nero.'],
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

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase())
    if(!member) return message.channel.send(`${this.client.emote.bunnyPoke} ***No has introducido algún miembro. u.u***`)
    if(member.id === message.author.id) return message.channel.send(`${this.client.emote.bunnyHmm} ***¿Por qué te banearías?***`)
    if(!member.bannable || member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send(`${this.client.emote.bunnyPoke} ***Parece que intentas banear a un rango superior. u.u***`)

    let reason = args.slice(1).join(" ") || "Sin razón"

    let msg = await message.channel.send(`${this.client.emote.puppySlap} ***¿Deseas banear a ${member.user.tag}? Esta desición implicaría que no estará más en el servidor, a menos que lo revoques.***`)
    await msg.react('✅')
    await msg.react('❎')

    const filter = (reaction, user) => ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id

    msg.awaitReactions({ filter, max: 1, time: 5000, errors: ['time'] })
    .then(async (cc) => {
        const rr = cc.first()
        if(rr.emoji.name === '✅'){
            try{
                let s = lang.memberSendBan.replace("{servername}", message.guild.name).replace("{reason}", reason)
                const sembed2 = new Discord.MessageEmbed() 
                .setColor("RED")
                .setDescription(`${s}`)
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp()
                member.send(sembed2).catch(() => {})

                member.ban({ reason: reason })
                await msg.edit(`${this.client.emote.cuteRabbit} ***¡Naisu! Se ha baneado exitosamente.***`)
                await msg.reactions.removeAll()
            } catch(e){
                await msg.edit(`${this.client.emote.bunnyconfused} ***Oops! Algo salió mal. Si el problema consiste envía un reporte. u.u`)
                await msg.reactions.removeAll()
            }
            //message.channel.send('xd')
        } else if(rr.emoji.name === '❎') {
            await msg.edit(`${this.client.emote.cuteRabbit} ***Una misteriosa fuerza ha decidio que el miembro no fuera baneado.***`)
            await msg.reactions.removeAll()
        }
    })
    .catch(async () => {
        await msg.edit(`${this.client.emote.rabbitSleeping} ***Parece que se ha acabado el tiempo, asegurate de ejecutar la acción antes de los 15 segundos.***`)
        await msg.reactions.removeAll()
    })
    }
};
