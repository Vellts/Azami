const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'confession',
        aliases: ['cf', 'confesion'],
        description: 'Confiesa tus más oscuros secretos.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ 'confession ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    if(!settings.confessionId || !settings.confessionId === null) return;

    let msg = args.join(" ")
    if(!msg) return;
    let type = args.slice(1).join(" ")

    try{

    if(msg && !type){
        let content = new Discord.MessageEmbed()
        .setTitle(lang.newConfessionCF)
        .setDescription(msg)
        .setFooter(lang.anonConfessionCF)
        .setColor('RANDOM')
        .setTimestamp()

        message.guild.channels.cache.get(settings.confessionId).send(content)
        message.delete()
    } else if (msg && type){
        let content = new Discord.MessageEmbed()
        .setTitle(lang.nonAnonConfessionCF)
        .setDescription(msg.replace("-cn", ""))
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setColor('RANDOM')
        .setTimestamp()

        message.guild.channels.cache.get(settings.confessionId).send(content)
        message.delete()
    }
    }catch(e){
        console.log(e)
    }

    }
};
