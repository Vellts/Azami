const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'play',
        description: 'Reproduce las canciones que quieras escuchar en el momento. Ya sea a través de playlist o nombres de canciones.',
        category: 'Music',
        usage: [ '<Canción/playlist>'],
        examples: [ 'play Eminem - Godzilla', 'play <Playlist de spotify/facebook/soundcloud/youtube>' ],
        cooldown: 3,
        voiceOnly: true,
        //erelaCheck: true,
      });
    }

    async run(message, args) {

    //if (!message.member.voice.channel) return message.channel.send('nostas en voz');

    let player;
    try {
      player = this.client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });
    } catch (err) {
      if (message.deletable) message.delete();
      //bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
      return message.channel.send('error xde').then(m => m.delete({ timeout: 5000 }));
    }

    if (args.length == 0) {
      // Check if a file was uploaded to play instead
      const fileTypes = ['mp3', 'mp4', 'wav', 'm4a', 'webm', 'aac', 'ogg'];
      if (message.attachments.size > 0) {
        const url = message.attachments.first().url;
        for (let i = 0; i < fileTypes.length; i++) {
          if (url.endsWith(fileTypes[i])) {
            args.push(url);
          }
        }
        if (!args[0]) return message.channel.send('archivo no soportado').then(m => m.delete({ timeout: 10000 }));
      } else {
        return message.channel.send('ingresa algo pes').then(m => m.delete({ timeout: 10000 }));
      }
    }
    let res;
    const search = args.join(' ');

    try {
      res = await player.search(search, message.author);
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return message.channel.send('Error :( '+ err).then(m => m.delete({ timeout: 5000 }));
    }
    // Workout what to do with the results
    if (res.loadType == 'NO_MATCHES') {
      // An error occured or couldn't find the track
      if (!player.queue.current) player.destroy();
      return message.channel.send('noencontrelacancion');

    } else if (res.loadType == 'PLAYLIST_LOADED') {
      // Connect to voice channel if not already
      if (player.state !== 'CONNECTED') player.connect();

      // Show how many songs have been added
      const embed = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription('cancion agregada a la queue #'+ res.tracks.length);
      message.channel.send({embeds: [embed]});

      // Add songs to queue and then pLay the song(s) if not already
      player.queue.add(res.tracks);
      if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
    } else {
      // add track to queue and play
      if (player.state !== 'CONNECTED') player.connect();
      player.queue.add(res.tracks[0]);
      if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
      } else {
        const embed = new MessageEmbed()
          .setColor(message.member.displayHexColor)
          .setDescription('Cancion agregada. (Titulo: '+res.tracks[0].title+ ')[Url:'+res.tracks[0].uri+']');
        message.channel.send({embeds: [embed]});
      }
    }


    }
};
