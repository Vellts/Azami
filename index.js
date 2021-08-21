const botclient = require("./bot")
const bot = new botclient()
const fs = require('fs')

bot.emote = require('./assets/emojis.js'); 

require('./Util/LoL/LoLClient')(bot);
//require('./structures/erelaManager')(bot);
//bot.on("raw", (d) => bot.manager.updateVoiceState(d));

bot.on('messageCreate', async message => {
    if(!bot.application?.owner) await bot.application?.fetch()

    if(message.content.toLowerCase() === `${bot.prefix}gcc` && message.author.id === bot.application?.owner.id){
    let slash = []
    bot.slashCommands.filter(x => x.guildOnly).forEach(e => {
        slash.push({
            name: e.name,
            description: e.description,
            options: e.options
        })
    })
    bot.guilds.cache.forEach(async guild => {
        await bot.guilds.cache.get(guild.id)?.commands.set(slash).catch(err => console.log(err))
    })
    message.channel.send('comandos setiado')
    }

    if (message.content.toLowerCase() === '!delete') {
        bot.application?.commands.delete('860194936364204055')
        .then(console.log)
        .catch(console.error);
    }
})
 
/*bot.on('message', async message => {
    if (!bot.application?.owner) await bot.application?.fetch();

    if (message.content.toLowerCase() === '!deploy' && message.author.id === bot.application?.owner.id) {
        const data = [
        {
            name: 'e',
            description: 'asdasdasd',
        },
        {
            name: 'ping',
            description: 'pong',
        },
        ]
        const command = await bot.application?.commands.set(data);
        //console.log(command);
    }
});

bot.on('interaction', async interaction => {
    if (!interaction.isCommand()) return;
    //console.log(interaction)
    console.log(interaction.commandName)
    if(interaction.commandName === 'ping'){
        await interaction.reply({content: 'aaa'})
    }
    if (interaction.commandName === 'ping') {
        await interaction.reply({content: 'Aaa'});
    }
    if(interaction.commandName === 'e'){
        await interaction.reply({content: 'asdasd'})
    }
});*/

process.on('unhandledRejection', err => {
    //bot.channels.cache.get('856714305029013525').send(`Unhandled promise rejection: ${err.message}.`);
    console.log(err); 
    });

bot.react = new Map()

bot.start();









  