const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, DiscordAPIError } = require('discord.js');
const config = require('../../config.json');
const { Menu } = require('discord.js-menu')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'aea',
        description: `Información con ayuda sobre los comandos de Azami.`,
        category: 'xd',
        cooldown: 3,
      });
    }

    async run(message, args, client = message.client) {

    let type = args[0]

    const guildDB = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${guildDB.language}.js`)

    let disabledCommands = guildDB.disabledCommands;
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');


    if(!type){

        let helpMenu = new Menu(message.channel, message.author.id, [
    {
        name: 'main',
        content: new MessageEmbed({
            title: '¡Hey! ¿En qué te puedo ayudar?',
            description: `
                *Averigua las caracteristicas, comandos y categorías que contiene Azami. ${client.emote.stars2}*
                \n*${client.emote.cuteBee} Mi prefix en **${message.guild.name}** es **${guildDB.prefix}**.*
                    
            `,
            //<:AK_fresh:821525301548154880> **Economia**
            thumbnail: {
                url: message.guild.iconURL({ dynamic: true })
            },
            fields: [
                {
                    name: 'Reacciona a los siguientes emotes para obtener los comandos de las categorias:',
                    value: `
                    ${client.emote.pinkarrow2} **FUN ∵ <a:AK_fun:821511513729794069> ∵**
                    ${client.emote.pinkarrow2} **UTILIDAD ∵ <:AK_util:821525323215667201> ∵**
                    ${client.emote.pinkarrow2} **CONFIGURACIÓN ∵ ⚙ ∵**
                    ${client.emote.pinkarrow2} **MODERACIÓN ∵ <a:AK_evil:821525625209880588> ∵**
                    ${client.emote.pinkarrow2} **NSFW ∵ <:AK_uy:803754858238574622> ∵**
                    ${client.emote.pinkarrow2} **MÚSICA ∵ <:AK_music:821513513297248296> ∵**
                        `
                },
                {
                    name: `👑 ¿Deseas apoyar a Azami?`,
                    value: 'Obtén premium para ti o para el servidor. [Click aquí](https://azamibot.xyz/).'
                },
                {
                    name: `🔔 Servidor de Soporte`,
                    value: '[Click aquí](https://discord.gg/qwATJpNhqG)'
                },
                {
                    name: `💎 Dashboard`,
                    value: '[Click aquí](https://azamibot.xyz/)'
                }
            ],
            footer: {
                text: 'Azami',
                icon_url: this.client.user.avatarURL()
            },
            timestamp: Date.now()
        }),
        reactions:{
        '821511513729794069': "fun",
        '821525323215667201': 'utility', 
        '⚙': "config",
        "821525625209880588": "mod",
        "803754858238574622": "nsfw",
        "821513513297248296": "music"
        }
        },
    {
        name: "fun",
        content: new MessageEmbed({
            title: 'Comandos de la categoría Fun.',
            description: `
            *¿No encuentras la forma de usarlo? Utiliza \`${guildDB.prefix}help <comando>\`.*
            `,
             fields: [
                {
                    name: `**Comandos:**`,
                    value: `${this.client.commands.filter(cmd => cmd.category.toLowerCase() === "interaction").map(cmd => `\`${cmd.name}\``).join(", ")}`
                }
            ]
        }),
        reactions:{  
        '◀': 'main', 
        '821511513729794069': "fun",
        '821525625209880588': 'utility', 
        '⚙': "config",
        "821525625209880588": "mod",
        "803754858238574622": "nsfw",
        "821513513297248296": "music"
    }
    },
    {
        name: "utility",
        content: new MessageEmbed({
            title: 'Comandos de la categoría Fun.',
            description: `
            *¿No encuentras la forma de usarlo? Utiliza \`${guildDB.prefix}help <comando>\`.*
            `,
             fields: [
                {
                    name: `**Comandos:**`,
                    value: `${this.client.commands.filter(cmd => cmd.category.toLowerCase() === "interaction").map(cmd => `\`${cmd.name}\``).join(", ")}`
                }
            ]
        }),
        reactions:{  
        '◀': 'main', 
        '821511513729794069': "fun",
        '821525625209880588': 'utility', 
        '⚙': "config",
        "821525625209880588": "mod",
        "803754858238574622": "nsfw",
        "821513513297248296": "music"
    }
    },
    {
        name: "config",
        content: new MessageEmbed({
            title: 'Comandos de la categoría Fun.',
            description: `
            *¿No encuentras la forma de usarlo? Utiliza \`${guildDB.prefix}help <comando>\`.*
            `,
             fields: [
                {
                    name: `**Comandos:**`,
                    value: `${this.client.commands.filter(cmd => cmd.category.toLowerCase() === "config").map(cmd => `\`${cmd.name}\``).join(", ")}`
                }
            ]
        }),
        reactions:{  
        '◀': 'main', 
        '821511513729794069': "fun",
        '821525625209880588': 'utility', 
        '⚙': "config",
        "821525625209880588": "mod",
        "803754858238574622": "nsfw",
        "821513513297248296": "music"
    }
    },
    {
        name: "mod",
        content: new MessageEmbed({
            title: 'Comandos de la categoría Fun.',
            description: `
            *¿No encuentras la forma de usarlo? Utiliza \`${guildDB.prefix}help <comando>\`.*
            `,
             fields: [
                {
                    name: `**Comandos:**`,
                    value: `${this.client.commands.filter(cmd => cmd.category.toLowerCase() === "moderacion").map(cmd => `\`${cmd.name}\``).join(", ")}`
                }
            ]
        }),
        reactions:{  
        '◀': 'main', 
        '821511513729794069': "fun",
        '821525625209880588': 'utility', 
        '⚙': "config",
        "821525625209880588": "mod",
        "803754858238574622": "nsfw",
        "821513513297248296": "music"
    }
    },
    /*{
        name: "nsfw",
        content: new MessageEmbed({
            title: 'Comandos de la categoría Fun.',
            description: `
            *¿No encuentras la forma de usarlo? Utiliza \`${guildDB.prefix}help <comando>\`.*
            `,
             fields: [
                {
                    name: `**Comandos:**`,
                    value: `${this.client.commands.filter(cmd => cmd.category.toLowerCase() === "nsfw").map(cmd => `\`${cmd.name}\``).join(", ")}`
                }
            ]
        }),
        reactions:{  
        '◀': 'main', 
        '821511513729794069': "fun",
        '821525625209880588': 'utility', 
        '⚙': "config",
        "821525625209880588": "mod",
        "803754858238574622": "nsfw",
        "821513513297248296": "music"
    }
    },
    {
        name: "music",
        content: new MessageEmbed({
            title: 'Comandos de la categoría Fun.',
            description: `
            *¿No encuentras la forma de usarlo? Utiliza \`${guildDB.prefix}help <comando>\`.*
            `,
             fields: [
                {
                    name: `**Comandos:**`,
                    value: `${this.client.commands.filter(cmd => cmd.category.toLowerCase() === "music").map(cmd => `\`${cmd.name}\``).join(", ")}`
                }
            ]
        }),
        reactions:{  
        '◀': 'main', 
        '821511513729794069': "fun",
        '821525625209880588': 'utility', 
        '⚙': "config",
        "821525625209880588": "mod",
        "803754858238574622": "nsfw",
        "821513513297248296": "music"
    }
    },*/
    ], 300000)
        helpMenu.start()
    } else {

        const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
        if(!cmd) return message.channel.send(`Could not find the following command.`);

        const embed = new MessageEmbed()
        embed.setTitle(`Información del comando \`${cmd.name}\``)
        embed.setDescription(cmd.description)
        embed.setFooter(cmd.disabled ? 'El comando está desactivado.' : message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
       
        
        embed.addField('Uso', `\`${cmd.usage}\`.`)
        embed.addField('Categoría', `\`${capitalize(cmd.category)}\`.`)

        if(cmd.aliases && cmd.aliases.length) embed.addField('Alias', cmd.aliases.map(alias => `\`${alias}\``).join(', '))
        if(cmd.cooldown && cmd.cooldown > 1) embed.addField('Cooldown', `\`${cmd.cooldown} segundos\`.`)
        if(cmd.examples && cmd.examples.length) embed.addField('Ejemplos', cmd.examples.map(example => `\`${example}\`.`).join('\n'))

        message.channel.send(embed)

    }


    
    /*if(!args[0]) {
    
    const embed = new MessageEmbed()
    .setColor('GREEN')
    .setTitle(`${config.bot_name || 'Bot'}'s Command List`)
    .setDescription(`**Please make sure to follow and star the github repo [here](https://github.com/peterhanania/reaction-roles)**`)


    const categories = message.client.utils.removeDuplicates(message.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));


    for (const category of categories) {
      embed.addField(`**${category}**`, this.client.commands.filter(cmd => 
        cmd.category === category).map(cmd => `\`${cmd.name}${" ".repeat(12 - Number(cmd.name.length))}:\` - ${cmd.description}`).join('\n'))
    }

    message.channel.send(embed)
    
    } else {
        const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
        if(!cmd) return message.channel.send(`Could not find the following command.`);

        const embed = new MessageEmbed()
        embed.setTitle(`Command: ${cmd.name}`)
        embed.setDescription(cmd.description)
        embed.setFooter(cmd.disabled ? 'This command is currently disabled.' : message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
       
        
        embed.addField('Usage',  `\`${cmd.usage}\``, true)
        embed.addField('category',  `\`${capitalize(cmd.category)}\``, true)

        if(cmd.aliases && cmd.aliases.length) embed.addField('Aliases', cmd.aliases.map(alias => `\`${alias}\``, true).join(', '), true)
        if(cmd.cooldown && cmd.cooldown > 1) embed.addField('Cooldown', `\`${cmd.cooldown}s\``, true)
        if(cmd.examples && cmd.examples.length) embed.addField('__**Examples**__', cmd.examples.map(example => `- \`${example}\``).join('\n'))

        message.channel.send(embed)
  

    }*/
    

    }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}