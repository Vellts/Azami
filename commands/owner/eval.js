const Command = require('../../structures/Command');
const Discord = require('discord.js')
const { inspect } = require("util")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'eval',
        aliases: [ 'boteval' ],
        description: `Eval`,
        category: 'Owner',
        ownerOnly: true
      });
    }

    async run(message, args) {
    const code = args.join(" ")
    try {
        if(!code) return message.channel.send('tas pendejo')
        let evaled = await eval(code)

        const embed = new Discord.MessageEmbed()
            .addField(`📥 Entrada`, `\`\`\`\n${code}\n\`\`\``)
            .addField('📤 Salida', `\`\`\`js\n${inspect(evaled, { depth: 0})}\n\`\`\``)
            .addField('Tipo', typeof(evaled))
            .addField('Clase', evaled && evaled.constructor && evaled.constructor.name ? evaled.constructor.name || 'Sin clase' : 'Sin clase', true)
            return message.channel.send({embeds: [embed]});
        } catch (e) {
            //console.log(e);
            const embed = new Discord.MessageEmbed()
            .addField(`📥 Entrada`, `\`\`\`\n${code}\n\`\`\``)
            .addField(`📤 Salida`, `\`\`\`js\n${e}\n\`\`\``)
            return message.channel.send({embeds: [embed]});
        }
        //res_evalued && res_evalued.constructor && res_evalued.constructor.name) ? res_evalued.constructor.name || 'NO CLASS' : 'NO CLASS'
             
    }
};


/*addField(":inbox_tray: Entrada", `\`\`\`js\n${code}\n\`\`\``)
                .addField(":outbox_tray: Salida", `\`El codigo es muy largo, link:\` ${link.url}`)
                .addField("📟 Tipo", `\`\`\`js\n${mayuscula(tipo)}\n\`\`\``, true)
                //.addField("🗄 Clase", classe, true)
                .setColor("#7289DA")
                msg.edit({embeds: [embed]});*/