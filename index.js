const botclient = require("./bot")
const config = require("./config.json")
const bot = new botclient(config)
const disbut = require('discord-buttons')(bot)
/*const Distube = require('distube')
const fs = require('fs')
const SpotifyPlugin = require("@distube/spotify")
const { Manager } = require("erela.js");
const Spotify  = require("erela.js-spotify");*/

// load colors
bot.emote = require('./assets/emojis.js'); 
bot.disbut = require('discord-buttons');
/*bot.distube = new Distube(bot, { 
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
})*/
const clientID = "3b41b0c10c1e4c7fa2956382db2f69ca"; // clientID from your Spotify app
const clientSecret = "428cd93c78524e6dab17bd9c85d2e765";

const a = require('./structures/erelaManager')(bot)
/*bot.manager = new Manager({
  // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
  nodes: [
    // If you pass a object like so the "host" property is required
    {
      host: "lava.link", // Optional if Lavalink is local
      port: 80, // Optional if Lavalink is set to default
      password: "youshallnotpass", // Optional if Lavalink is set to default
    },
  ],
  plugins: [
    // Initiate the plugin and pass the two required options.
    new Spotify({clientID, clientSecret })
  ],
  // A send method to send data to the Discord WebSocket using your library.
  // Getting the shard for the guild and sending the data to the WebSocket.
  send(id, payload) {
    const guild = bot.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
})
.on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
.on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
.on("trackStart", (player, track) => {
    bot.channels.cache
        .get(player.textChannel)
        .send(`Now playing: ${track.title}`);
})
.on("queueEnd", (player) => {
    bot.channels.cache
      .get(player.textChannel)
      .send("Queue has ended.");
    player.destroy();
});*/

bot.on("raw", (d) => bot.manager.updateVoiceState(d));


if(config.dashboard === "true"){
    const Dashboard = require("./dashboard/dashboard");
    Dashboard(bot); 
}

bot.react = new Map()

bot.start();









  