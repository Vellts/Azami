const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'podium',
        description: `Imagen que desees, pero invertida.`,
        category: 'memes',
        examples: ['invert', 'invert <@user>'],
        botPermissions: ['ATTACH_FILES'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    let user = message.mentions.users.first()
    let user2 = message.mentions.users.first(2)[1] 
    let user3 = message.mentions.users.first(3)[2]

    if(!user) return message.channel.send(`${client.emote.bunnyconfused} ***Ocurrió un error. Asegura de haber mencionado algún usuario.***`)
    if(!user2) return message.channel.send(`${client.emote.bunnyconfused} ***Ocurrió un error. Asegura de haber mencionado algún usuario.***`)
    if(!user3) user3 = message.author

    let img = await new DIG.Podium().getImage(user.displayAvatarURL({ format: 'png'}), user2.displayAvatarURL({ format: 'png' }), user3.displayAvatarURL({ format: 'png'}), user.username, user2.username, user3.username)
    let att = new Discord.MessageAttachment(img, 'podium.png')
    message.channel.send(att)


      }
};