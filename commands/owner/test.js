const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { MessageButton } = require('discord-buttons')
const animeList = require('../../models/animelist')
const malScraper = require('mal-scraper');
const translate = require('@iamtraction/google-translate');
const os = require('node-os-utils')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'test',
        description: 'Has que no vuelvan los malechores.',
        category: 'Moderacion',
        usage: ['<miembro>'],
        example: ['ban @Azami'],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args, client = message.client) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });

    /*let search = args.join(" ").toLowerCase()
    let data = await animeList.findOne({ anime: search })
    if(data && data.statusAnime !== 'false'){
        malScraper.getInfoFromName(data.anime).then(r => {
            translate(r.synopsis, { from: 'en', to: 'es' }).then(res => {
                message.lineReplyNoMention(new MessageEmbed()
                .addField('Titulo', r.title)
                .addField('Sinopsis', `${res.text.slice(0, 534)}...`)
                .addField('popularidad', r.score)
                .addField('estudio', r.studios)
                .setImage(data.image)
                )
            })
        })
    } else {
        message.lineReplyNoMention('El anime no existe en nuestra base de datos.')
    }*/

    let mem = os.mem

    mem.info().then(info => {
    message.channel.send(info)
    })

    }
};
