const Command = require('../../structures/Command');
const DIG = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'podium',
        description: `Imagen que desees, pero invertida.`,
        category: 'Memes',
        usage: ['<Miembro opcional>'],
        examples: ['invert', 'invert @Nero.'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    let user = message.mentions.users.first()
    let user2 = message.mentions.users.first(2)[1]
    let user3 = message.mentions.users.first(3)[2]

    if(!user) return message.reply({content: `${client.emote.bunnyconfused} ***Ocurrió un error. Asegura de haber mencionado algún usuario.***`, allowedMentions: { repliedUser: false }})
    if(!user2) return message.reply({content: `${client.emote.bunnyconfused} ***Ocurrió un error. Asegura de haber mencionado algún usuario.***`, allowedMentions: { repliedUser: false }})
    if(!user3) user3 = message.author

    let img = await new DIG.Podium().getImage(user.displayAvatarURL({ format: 'png'}), user2.displayAvatarURL({ format: 'png' }), user3.displayAvatarURL({ format: 'png'}), user.username, user2.username, user3.username)
    message.reply({
      files: [
        {
          attachment: img,
          name: `podium.png`
        }
      ], allowedMentions: { repliedUser: false }
    })


      }
};
