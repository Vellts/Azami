const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const anmeList = require('../../models/animelist')
const myList = require('../../database/schemas/myanimelist')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'animelist',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
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
    let type = args[0]
    if(!type) return message.lineReply('nao');

    switch(type.toLowerCase()){
        case 'register':
        /*let check = ["visto", "no-visto", "por-ver", "completado", "dropped", "dejado"]
        let status = args[1]
        if(!check.includes(status)) return message.lineReplyNoMention('Status no´válidos.')
        let rate = args[2]
        let name = args.slice(3).join(" ")
        if(!rate) message.lineReplyNoMention('ingresa un valor.')
        if(isNaN(rate)) return message.lineReplyNoMention('ingresa un número, si aún no lo ves, ingresa 0 ó NaN.')
        if(!name) return message.lineReplyNoMention('ingresa el nombre del anime.')*/
        let name = args.slice(1).join(" ")
        if(!name) return message.lineReplyNoMention('ingresa el nombre del anime.')
        const anm = await anmeList.findOne({ anime: name.toLowerCase(), statusAnime: 'true' })
        if(!anm) return message.lineReplyNoMention('Aún no existe ese anime en nuestra lista. Utiliza \`?animelist animes\`')

        const myanm = await myList.findOne({ userId: message.author.id, anime: name.toLowerCase() })
        if(myanm){
            return message.lineReplyNoMention('Ese anime ya está registrado en tu lista.')
        } else {
            let newUser = await new myList({
                userId: message.author.id,
                anime: name.toLowerCase()
            })
            newUser.save().catch(() => {})
            message.lineReplyNoMention(`Anime \`${name}\` fue agregado a tu lista.`)
        }
        break;
        case 'view':
        const vanme = await myList.find({ userId: message.author.id })
        console.log(vanme)
        if(vanme){
            /*message.channel.send(vanme.map((b) => 
                `${b.anime}` 
            ).join("\n")
            )*/
        } else {
            message.lineReplyNoMention(`No tienes animes registrados en tu cuenta.`)
        }

        break;
        case 'edit':
            let param = args[1]
            if(!param) return message.lineReplyNoMention('baka')
            let anime = args.slice(2).join(" ")
            switch(param.toLowerCase()){
                case 'rate':
                    let rating = parseInt(args[2])
                    if(isNaN(rating)) return message.lineReplyNoMention('menciona un número.')
                    message.lineReplyNoMention(`Le has colocado un ${rating}/10 al anime.`)
                break;
                case 'episodes':
                    message.lineReplyNoMention('nice')
                break;
                case 'status':
                    message.lineReplyNoMention('nice')
                break;
            }
        break;
    }

    }
};
