const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const afkModel = require('../../models/afk.js');
const { MessageEmbed } = require('discord.js')

module.exports = class Afk extends Command {
    constructor(...args) {
      super(...args, {
        name: 'Utilidad',
        description: 'Establece tu estado afk.',
        category: 'Utility',
        usage: [ '<mensaje opcional>'],
        examples: [ 'afk Chill.' ],
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

    let afkM = args.join(" ")
    if(!afkM) afkM = `${lang.missStatusAK}`

    await afkModel.findOne({ guildId: message.guild.id, userId: message.author.id }, async (err, data) => {
        if(err) throw err;
        if(!data){
            data = new afkModel({ guildId: message.guild.id, userId: message.author.id, estado: afkM, timestamp: new Date().getTime() })
            await data.save();

            const embed = new MessageEmbed()
            .setTitle(`${message.author.username} ${lang.titleAK}`)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`
            **Motivo:** ${afkM}
            `)
            .setColor('RANDOM')
            .setFooter(lang.footerAFK)
            message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
        }
    })

    }
};
