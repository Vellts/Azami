const botclient = require("./bot")
const config = require("./config.json")
const bot = new botclient(config)
const disbut = require('discord-buttons')(bot)
const Distube = require('distube')
const fs = require('fs')
const SpotifyPlugin = require("@distube/spotify")

// load colors
bot.emote = require('./assets/emojis.js'); 
bot.disbut = require('discord-buttons');
bot.distube = new Distube(bot, { 
    emitNewSongOnly: true, 
    leaveOnEmpty: true,
    plugins: [new SpotifyPlugin({ parallel: true })]
});

fs.readdir('./distubeEvents/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./distubeEvents/${file}`);
        let eventName = file.split(".")[0];
        bot.distube.on(eventName, event.bind(null, bot));
    });
})


if(config.dashboard === "true"){
    const Dashboard = require("./dashboard/dashboard");
    Dashboard(bot); 
}

//Map needed for reaction roles
bot.react = new Map()

//start the bot
bot.start();









  