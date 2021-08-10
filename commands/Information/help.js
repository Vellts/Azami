const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, DiscordAPIError } = require('discord.js');
const config = require('../../config.json');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'help',
        description: `Información con ayuda sobre los comandos de Azami.`,
        category: 'Information',
        usage: ['<Comando opcional>'],
        examples: ['help', 'help <Comando>'],
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {


    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    let disabledCommands = settings.disabledCommands;
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');


    let type = args[0]
     let categorias = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category)).length

     if(!type){
     let msg = await message.channel.send({embeds: [
          {
               title: '¡Hey! La ayuda ha llegado.',
               description: `${this.client.emote.lollipop} ***Mi prefix en este servidor es \`${settings.prefix}\`.
               Soy Azami, y te presentaré mis características:***

               > *Cuento con \`${categorias}\` categorías.*
               > *Podrás usar \`${this.client.commands.size}\` comandos en \`${categorias}\` categorías.*
               > *Interactúa a través de \`${this.client.slashCommands.size}\` comandos de barra diagonal.*

               ${this.client.emote.pinkarrow2} *Usa \`${settings.prefix}help [Categoría]\` para ver los comandos de la categoría.
               ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para ver información detallada del comando.*
               `,
               fields: [
                    {
                        name: `${this.client.emote.kawaiiPig} Categorías disponibles.`,
                        value: `> **❰ <a:Az_cuteRabbit:862766266616250369> Configuración ❱ ➥ \`${settings.prefix}help config\`**
                        > **❰ <a:Az_bunnyPoke:862769207535075349> Moderación ❱ ➥ \`${settings.prefix}help mod\`**
                        > **❰ <a:Az_bunnyPompom:862767530824957972> Interacción ❱ ➥ \`${settings.prefix}help int\`**
                        > **❰ <a:Az_bunnyBubble:864671602360582165> Fun ❱ ➥ \`${settings.prefix}help fun\`**
                        > **❰ <a:Az_bunnyRainbow:862770934385606686> Niveles ❱ ➥ \`${settings.prefix}help level\`**
                        > **❰ <a:Az_kawaii_bunny:840354345345351680> Utilidad ❱ ➥ \`${settings.prefix}help util\`**
                        > **❰ <a:Az_bunnyDance:862771423226363934> Música ❱ ➥ \`${settings.prefix}help music\`**
                        `
                    },
                    {
                         name: `${this.client.emote.interdasting} Enlaces útiles`,
                         value: `> ${this.client.emote.pinkarrow2} [Dashboard](https://azamibot.xyz)
                         > ${this.client.emote.pinkarrow2} [Soporte](https://discord.gg/qwATJpNhqG)
                         `
                    }
               ],
               thumbnail: {url: message.guild.iconURL({dynamic: true})}
          }
          ],
               components:
          [
               new Discord.MessageActionRow()
               .addComponents(
                    new Discord.MessageSelectMenu()
                    .setCustomId('select1')
                    .setPlaceholder('Selecciona la categoría.')
                    .addOptions([
                        {
                            value: 'config',
                            label: 'Configuración',
                            emoji: '<a:Az_cuteRabbit:862766266616250369>',
                            description: '¡Logra un ambiente maravilloso! 🌈',
                        },
                        {
                            value: 'mod',
                            label: 'Moderación',
                            emoji: "<a:Az_bunnyPoke:862769207535075349>",
                            description: 'Mantén a raya los miembros del servidor.',
                        },
                        {
                            value: 'intc',
                            label: 'Interacción',
                            emoji: '<a:Az_bunnyPompom:862767530824957972>',
                            description: '¡Diviertete jugando e interactuando con los demás!',
                        },
                        {
                            value: 'fun',
                            label: 'Fun',
                            emoji: '<a:Az_bunnyBubble:864671602360582165>',
                            description: 'Has de tú día más divertido.'
                        },
                        {
                            value: 'lvl',
                            label: 'Niveles',
                            emoji: "<a:Az_bunnyRainbow:862770934385606686>",
                            description: 'Adapta el sistema de niveles a tu servidor.',
                        },
                        {
                            value: 'util',
                            label: 'Utilidad',
                            emoji: '<a:Az_kawaii_bunny:840354345345351680>',
                            description: '¡Descrubre nuevas cosas!',
                         },
                         {
                            value: 'music',
                            label: 'Música',
                            emoji: "<a:Az_bunnyDance:862771423226363934>",
                            description: 'Disfruta y convive con tus canciones favoritas.',
                        },
                        {
                            value: 'dm',
                            label: 'Dm',
                            emoji: "<a:Az_bunnyhappy:862771692124110889>",
                            description: 'Todos los comandos a tu buzón.',
                        }
                    ])
               )
          ]
     })
     const filter = (interaction) => interaction.customId === 'select1' && interaction.user.id === message.author.id;
     const collector = await msg.createMessageComponentCollector({ filter, time: 30000 });
     collector.on("collect", async (i) => {
          switch(i.values[0]){
               case 'config':
               await i.update({embeds:
                    [
                         {
                              title: `∷ Comandos de Configuración ∷`,
                              description: `
                              ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                              `,
                              fields: [
                                   {
                                        name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                        value: `\`\`\`${this.client.commands.filter(x => x.category === 'Configuración').map(c => c.name).join(", ")}\`\`\``
                                   }
                              ]
                         }
                    ]
               })
               break;
               case 'lvl':
               await i.update({embeds:
                    [
                         {
                              title: `∷ Comandos de Niveles ∷`,
                              description: `
                              ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                              `,
                              fields: [
                                   {
                                        name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                        value: `\`\`\`${this.client.commands.filter(x => x.category === 'Niveles').map(c => c.name).join(", ")}\`\`\``
                                   }
                              ]
                         }
                    ]
               })
               break;
               case 'mod':
               await i.update({embeds:
                    [
                         {
                              title: `∷ Comandos de Moderación ∷`,
                              description: `
                              ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                              `,
                              fields: [
                                   {
                                        name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                        value: `\`\`\`${this.client.commands.filter(x => x.category === 'Moderación').map(c => c.name).join(", ")}\`\`\``
                                   }
                              ]
                         }
                    ]
               })
               break;
               case 'intc':
               await i.update({embeds:
                    [
                         {
                              title: `∷ Comandos de Interacción ∷`,
                              description: `
                              ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                              `,
                              fields: [
                                   {
                                        name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                        value: `\`\`\`${this.client.commands.filter(x => x.category === 'Interacción').map(c => c.name).join(", ")}\`\`\``
                                   }
                              ]
                         }
                    ]
               })
               break;
                case 'fun':
                await i.update({embeds:
                    [
                         {
                              title: `∷ Comandos de Diversión ∷`,
                              description: `
                              ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                              `,
                              fields: [
                                   {
                                        name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                        value: `\`\`\`${this.client.commands.filter(x => x.category === 'Fun').map(c => c.name).join(", ")}\`\`\``
                                   }
                              ]
                         }
                    ]
                })
                break;
               case 'util':
               await i.update({embeds:
                    [
                         {
                              title: `∷ Comandos de Utilidad ∷`,
                              description: `
                              ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                              `,
                              fields: [
                                   {
                                        name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                        value: `\`\`\`${this.client.commands.filter(x => x.category === 'Utilidad').map(c => c.name).join(", ")}\`\`\``
                                   }
                              ]
                         }
                    ]
               })
               break;
               case 'music':
               await i.update({embeds:
                    [
                         {
                              title: `∷ Comandos de Música ∷`,
                              description: `
                              ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                              `,
                              fields: [
                                   {
                                        name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                        value: `\`\`\`${this.client.commands.filter(x => x.category === 'Musica').map(c => c.name).join(", ")}\`\`\``
                                   }
                              ]
                         }
                    ]
               })
               break;
               case 'dm':
               await i.update({content: 'Te he enviado todos los comandos a tu Dm!', components: [], ephemeral: true})
               await message.author.send({content: 'xd'}).catch(() => {})
               break;
        }
     })
     collector.on("end", async (a) => {
          await msg.edit({components: []})
     })
     } else if(type.toLowerCase() === 'config'){
          message.channel.send({embeds:
               [
                    {
                         title: `∷ Comandos de Configuración ∷`,
                         description: `
                         ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                         `,
                         fields: [
                              {
                                   name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                   value: `\`\`\`${this.client.commands.filter(x => x.category === 'Configuración').map(c => c.name).join(", ")}\`\`\``
                              }
                         ]
                    }
               ]
          })
     } else if(type.toLowerCase() === 'mod'){
          message.channel.send({embeds:
               [
                    {
                         title: `∷ Comandos de Moderación ∷`,
                         description: `
                         ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                         `,
                         fields: [
                              {
                                   name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                   value: `\`\`\`${this.client.commands.filter(x => x.category === 'Moderación').map(c => c.name).join(", ")}\`\`\``
                              }
                         ]
                    }
               ]
          })
     } else if(type.toLowerCase() === 'int'){
          message.channel.send({embeds:
               [
                    {
                         title: `∷ Comandos de Interacción ∷`,
                         description: `
                         ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                         `,
                         fields: [
                              {
                                   name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                   value: `\`\`\`${this.client.commands.filter(x => x.category === 'Interacción').map(c => c.name).join(", ")}\`\`\``
                              }
                         ]
                    }
               ]
          })
     } else if(type.toLowerCase() === 'fun'){
          message.channel.send({embeds:
               [
                    {
                         title: `∷ Comandos de Diversión ∷`,
                         description: `
                         ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                         `,
                         fields: [
                              {
                                   name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                   value: `\`\`\`${this.client.commands.filter(x => x.category === 'Fun').map(c => c.name).join(", ")}\`\`\``
                              }
                         ]
                    }
               ]
          })
     } else if(type.toLowerCase() === 'level'){
          message.channel.send({embeds:
               [
                    {
                         title: `∷ Comandos de Niveles ∷`,
                         description: `
                         ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                         `,
                         fields: [
                              {
                                   name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                   value: `\`\`\`${this.client.commands.filter(x => x.category === 'Niveles').map(c => c.name).join(", ")}\`\`\``
                              }
                         ]
                    }
               ]
          })
     } else if(type.toLowerCase() === 'util'){
          message.channel.send({embeds:
               [
                    {
                         title: `∷ Comandos de Utilidad ∷`,
                         description: `
                         ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                         `,
                         fields: [
                              {
                                   name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                   value: `\`\`\`${this.client.commands.filter(x => x.category === 'Utilidad').map(c => c.name).join(", ")}\`\`\``
                              }
                         ]
                    }
               ]
          })
     } else if(type.toLowerCase() === 'music'){
          message.channel.send({embeds:
               [
                    {
                         title: `∷ Comandos de Música ∷`,
                         description: `
                         ${this.client.emote.pinkarrow2} Usa \`${settings.prefix}help [Comando]\` para saber información detallada del comando.
                         `,
                         fields: [
                              {
                                   name: `${this.client.emote.kawaiiBunny} Lista de comandos `,
                                   value: `\`\`\`${this.client.commands.filter(x => x.category === 'Musica').map(c => c.name).join(", ")}\`\`\``
                              }
                         ]
                    }
               ]
          })
     } else {
          const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]))
          if (!cmd) return message.channel.send('nao nao');
          if(cmd.category === "Owner") return
          message.channel.send({embeds:
               [
                    {
                         title: `Comando \`${cmd.name}\` ∷ \`${capitalize(cmd.category)}\``,
                         description: `<:Az_froggy:862889024641040395> ∷ ***${cmd.description}***`,
                         fields: [
                              {
                                   name: `<a:Az_starsPink:862889160029372438> ∷ Alias`,
                                   value: `***\`${cmd.aliases.map(alias => `${alias}`, true).join(', ') || "No tiene."}\`***`
                              },
                              {
                                   name: `<a:Az_starsPink:862889160029372438> ∷ Uso`,
                                   value: `***${cmd.usage.map(uso => `\`${settings.prefix}${uso}\``).join('\n') || "`No ha sido proporcionado un uso.`"}***`
                              },
                              {
                                   name: `<a:Az_starsPink:862889160029372438> ∷ Ejemplos`,
                                   value: `***${cmd.examples.map(example => `\`${settings.prefix}${example}\``).join('\n') || "`No tiene.`"}***`
                              },
                              {
                                   name: `<a:Az_starsPink:862889160029372438> ∷ Cooldown`,
                                   value: `\`${cmd.cooldown}seg\``
                              },
                              {
                                   name: `<a:Az_starsPink:862889160029372438> ∷ Premium`,
                                   value: `\`No premium.\``
                              },
                              {
                                   name: `<a:Az_starsPink:862889160029372438> ∷ Permisos bot`,
                                   value: `\`\`\`${cmd.botPermission.map(x => x).join(", ")}\`\`\``
                              },
                              {
                                   name: `<a:Az_starsPink:862889160029372438> ∷ Permisos usuario`,
                                   value: `\`\`\`${cmd.userPermission.map(x => x).join(", ") || "No requiere."}\`\`\``
                              }
                         ]
                    }
               ]
            })
        }
    }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
