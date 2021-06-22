const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const wtf = require('wtf_wikipedia')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'wiki',
        aliases: ['wikipedia'],
        description: 'Busqueda de información en cuestion de segundos..',
        category: 'Utilidad',
        usage: ['<query>'],
        example: ['wiki Neutrones'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    let busqueda = args.join('_')
    if(!busqueda) return message.lineReplyNoMention(`${this.client.emote.bunnyconfused} ${lang.missArgsWK}`)
    wtf.fetch(busqueda, 'es').then(doc => {

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(doc.json().title)
        let texto = []
        let data = doc.json()
        let textos = data.sections[0].paragraphs[0].sentences
 
        for(let i = 0; i < textos.length; i++){
            texto.push(textos[i].text)
        }
        embed.setDescription(texto.join(' '))
        .setFooter(`${message.author.username}`, message.author.displayAvatarURL())
        .setTimestamp()
        message.lineReplyNoMention(embed)
    }).catch(err => message.lineReplyNoMention(`${this.client.emote.bunnyconfused} ${lang.errorWK}`))

    }
};
