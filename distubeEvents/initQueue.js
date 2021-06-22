const { MessageEmbed } = require('discord.js')

module.exports = (message, queue, song) => {
  queue.autoplay = false;
  queue.volume = 100;
}