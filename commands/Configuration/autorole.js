const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const autoRole = require('../../database/schemas/autoRole');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'autorole',
        description: 'Obtén el icono del servidor.',
        category: 'Configuración',
        usage: [ ''],
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

    const role = message.mentions.roles.first()
    if(!role) return
    let data = await autoRole.findOne({ guildId: message.guild.id })
    if(!data){
        let a = new autoRole({
            guildId: message.guild.id,
            roleID: role.id,
            roleToggle: true
        })
        a.save().catch(e => console.log(e))
    }

    }
};
