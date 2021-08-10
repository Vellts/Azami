const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'cwaifu',
        aliases: ['waifu'],
        description: 'Obtén una waifu creada a base de inteligencia artificial.',
        category: 'Utilidad',
        usage: [''],
        examples: ["cwaifu"],
        cooldown: 3,
      });
    }

    async run(message) {

    const embed = new MessageEmbed()
    .setTitle('Has creado una waifu.')
    .setImage(`https://www.thiswaifudoesnotexist.net/example-${Math.floor(Math.random() * 100000)}.jpg`)
    .setFooter(`Pedido por ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))
    .setTimestamp()
    
    message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})

    }
};
