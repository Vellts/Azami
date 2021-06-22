const Command = require('../../structures/Command');
const Discord = require('discord.js')

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

    async run(message, args, client = message.client) {

        async function enviar(mensaje) {
        return await message.channel.send(mensaje)
        }

        async function exec(codigo) {
        return await require("child_process").execSync(codigo)
        }
    
    
        function mayuscula(string) {
            string = string.replace(/[^a-z]/gi, '')
            return string[0].toUpperCase()+string.slice(1)
        }
    
    // Este sera el tiempo que luego le restaremos a Date.now() para obtener los milisegundos que tardo en hacer el eval
        let tiempo1 = Date.now()
    
    
    // Este mensaje saldra primero y se editara cuando termine de hacer el eval
        const edit = new Discord.MessageEmbed()
        .setDescription(":stopwatch: Evaluando...")
        .setColor("#7289DA")
        message.channel.send(edit).then(async msg => { 
            try {
              let code = args.join(" ");
              let evalued = await eval(code);
              let tipo = typeof evalued || "Tipo no encontrado."
              if (typeof evalued !== 'string') evalued = require('util').inspect(evalued, { depth: 0, maxStringLength: 2000});
              let txt = "" + evalued;
    
    // Si el texto es mas grande que 1500 (ajustarlo a medida), el bot enviara un link con el codigo posteado en hastebin para que pueda ser del tamano que sea
    
              if (txt.length > 1000) {

                let link = await jsp.publicar(`- - - - Eval - - - -\n\n${txt.replace(client.token, "Wow, un token")}`)
            
                const embed = new Discord.MessageEmbed()
                .addField(":inbox_tray: Entrada", `\`\`\`js\n${code}\n\`\`\``)
                .addField(":outbox_tray: Salida", `\`El codigo es muy largo, link:\` ${link.url}`)
                .addField(":file_folder: Tipo", `\`\`\`js\n${mayuscula(tipo)}\n\`\`\``, true)
                .addField(":stopwatch: Tiempo", `\`\`\`fix\n${Date.now() - tiempo1}ms\n\`\`\``, true)
                .setColor("#7289DA")
                msg.edit(embed);
                
        
              } else { 
    
    // Si el texto es de una longitud normal hace el eval normal
    
    
                const embed = new Discord.MessageEmbed()
                .addField(":inbox_tray: Entrada", `\`\`\`js\n${code}\n\`\`\``)
                .addField(":outbox_tray: Salida", `\`\`\`js\n${txt.replace(client.token, "No quieres saber eso.")}\n\`\`\``)
                .addField(":file_folder: Tipo", `\`\`\`js\n${mayuscula(tipo)}\n\`\`\``, true)
                .addField(":stopwatch: Tiempo", `\`\`\`fix\n${Date.now() - tiempo1}ms\n\`\`\``, true)
                .setColor("#7289DA")
                msg.edit(embed);
              }
            } catch (err) {          
              let code = args.join(" ")
              const embed = new Discord.MessageEmbed()
              .setAuthor("Error en el eval", client.user.displayAvatarURL({dynamic : true}))
              .addField(":inbox_tray: Entrada", `\`\`\`js\n${code}\n\`\`\``)
              .addField(":outbox_tray: Salida", `\`\`\`js\n${err}\n\`\`\``)
              .addField(":file_folder: Tipo", `\`\`\`js\nError\n\`\`\``)
              .setColor("RED")
              msg.edit(embed);
          }
        })

        
        
      }
};
