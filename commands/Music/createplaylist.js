const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const PlaylistSchema = require('../../models/playlist')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'c-playlist',
        description: 'Adivina adivinador, que saldrá hoy.',
        category: 'Utilidad',
        usage: [ '<mensaje>'],
        examples: [ '8ball ¿Los jugadores de LoL son humanos?' ],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args, client = message.client) {

    let ar = args[0]
    if(!ar) return message.lineReplyNoMention('nao argumentos')
    if(ar.length > 32) return message.lineReplyNoMention('naoxd')

    const msg = await message.channel.send('aguanta pes');

    PlaylistSchema.find({
      creator: message.author.id,
    }, async (err, p) => {
    if (err) {
        if (message.deletable) message.delete();
        console.log(`Command: error: ${err.message}.`);
        return message.channel.send('ha ocurrido un errorxd').then(m => m.delete({ timeout: 5000 }));
      }

      // response from database
      if (!p[0]) {
        await this.savePlaylist(this.client, message);
      } else if (p[0] && !message.author.premium) {
        // User needs premium to save more playlists
        return msg.edit('no permisos');
      } else if (p.length >= 3 && message.author.premium) {
        // there is a max of 3 playlists per a user even with premium
        return msg.edit('max playlist');
      } else if (p && message.author.premium) {
        // user can have save another playlist as they have premium
        const exist = p.find(obj => obj.name == message.args[0]);
        if (!exist) {
          await this.savePlaylist(this.client, message, args);
        } else {
          msg.edit('ya existe xd');
        }
      }
    });
  }

  // Check and save playlist to database
  async savePlaylist(client, message, args) {
    // Get songs to add to playlist
    this.client = client
    let res;
    try {
      res = await this.client.manager.search(args.slice(1).join(' '), message.author);
    } catch (err) {
      return message.channel.send('error'+err.message).then(m => m.delete({ timeout: 5000 }));
    }

    // Workout what to do with the results
    if (res.loadType == 'NO_MATCHES') {
      // An error occured or couldn't find the track
      msg.delete();
      return message.channel.send('no cancion');
    } else if (res.loadType == 'PLAYLIST_LOADED' || res.loadType == 'TRACK_LOADED' || res.loadType == 'SEARCH_RESULT') {
      let tracks = [], thumbnail, duration;
      if (res.loadType == 'SEARCH_RESULT') {
        // Display the options for search
        let max = 10, collected;
        const filter = (m) => m.author.id === message.author.id && /^(\d+|cancel)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;

        const results = res.tracks.slice(0, max).map((track, index) => `${++index} - \`${track.title}\``).join('\n');
        const embed = new MessageEmbed()
          .setTitle('titulo'+args.join(' '))
          .setColor(message.member.displayHexColor)
          .setDescription(results+'selecciona 1-10');
        const search = await message.channel.send(embed);

        try {
          collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
        } catch (e) {
          return message.reply('expiro el time');
        }

        const first = collected.first().content;
        if (first.toLowerCase() === 'cancel') {
          return message.channel.send('cancelado');
        }

        const index = Number(first) - 1;
        if (index < 0 || index > max - 1) return message.reply('invalido bro 1'+ max );

        tracks.push(res.tracks[index]);
        thumbnail = res.tracks[index].thumbnail;
        duration = res.tracks[index].duration;
        search.delete();
      } else {
        tracks = res.tracks.slice(0, message.author.premium ? 200 : 100);
        thumbnail = res.playlist?.selectedTrack.thumbnail ?? res.tracks[0].thumbnail;
        duration = res.playlist?.duration ?? res.tracks[0].duration;
      }

      // Save playlist to database
      const newPlaylist = new PlaylistSchema({
        name: message.args[0],
        songs: tracks,
        timeCreated: Date.now(),
        thumbnail: thumbnail,
        creator: message.author.id,
        duration: duration,
      });
      newPlaylist.save().catch(err => console.log(err));

      // Show that playlist has been saved
      const embed = new MessageEmbed()
        .setAuthor(newPlaylist.name, message.author.displayAvatarURL())
        .setDescription([
          'Created a playlist with name'+args[0],
          'Playlist duration '+getReadableTime(parseInt(newPlaylist.duration)),
          //'music/p-create:DESC_3 '+(res.loadType == 'PLAYLIST_LOADED') ? res.playlist.name : tracks[0].title, NUM: tracks.length, TITLE: message.args[0],
        ].join('\n'))
        //.setFooter('music/p-create:FOOTER', { ID: newPlaylist._id, NUM: newPlaylist.songs.length, PREM: (message.author.premium) ? '200' : '100' })
        .setTimestamp();
      msg.edit('', embed);
    } else {
      msg.delete();
      return message.channel.send('no cancionx d');
    }

    /*PlaylistSchema.findOne({
      name: ar,
      creator: message.author.id,
    }, async (err, p) => {
      // if an error occured
      if (err) {
        if (message.deletable) message.delete();
        console.log(`Comando: comando create-playlist tiene error ${err}.`);
        return message.channel.send('ha ocurrido un error.').then(m => m.delete({ timeout: 5000 }));
      }

      // playlist found
      if (p) {
        // Get songs to add to playlist
        let res;
        try {
          res = await this.client.manager.search(args.slice(1).join(' '), message.author);
        } catch (err) {
          return message.channel.send('ha ocurrido un error buscando la canción. '+err.message);
        }

        // Workout what to do with the results
        if (res.loadType == 'NO_MATCHES') {
          // An error occured or couldn't find the track
          return message.channel.send('no he encontrado la canción.');
        } else if (res.loadType == 'PLAYLIST_LOADED' || res.loadType == 'TRACK_LOADED') {
          try {
            // add songs to playlist
            const newTracks = res.tracks.slice(0, (message.author.premium ? 200 : 100) - p.songs.length);
            p.songs.push(...newTracks);
            p.duration = parseInt(p.duration) + parseInt(res.tracks.reduce((prev, curr) => prev + curr.duration, 0));
            await p.save();
            message.channel.send('agregadas '+newTracks.length+' a la playlist: '+ args[0]);
          } catch (err) {
            if (message.deletable) message.delete();
            console.log(`Ha ocurrido un error. Error: ${err.message}.`);
            message.channel.send('ha ocurrido un error buscando la canción. '+err.message).then(m => m.delete({ timeout: 5000 }));
          }
        } else if (res.loadType == 'SEARCH_RESULT') {
          // Display the options for search
          let max = 10, collected;
          const filter = (m) => m.author.id === message.author.id && /^(\d+|cancel)$/i.test(m.content);
          if (res.tracks.length < max) max = res.tracks.length;

          const results = res.tracks.slice(0, max).map((track, index) => `${++index} - \`${track.title}\``).join('\n');
          const embed = new MessageEmbed()
            .setTitle('Resultados para' +args.join(' '))
            .setColor(message.member.displayHexColor)
            .setDescription(results+' selecciona 1-10 o cancela.');
          message.channel.send(embed);

          try {
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
          } catch (e) {
            return message.reply(e);
          }

          const first = collected.first().content;
          if (first.toLowerCase() === 'cancel') {
            return message.channel.send('cancelao')
          }

          const index = Number(first) - 1;
          if (index < 0 || index > max - 1) return message.reply('numero muy grado 1-'+max);

          const track = res.tracks[index];
          p.songs.push(track);
          p.duration = parseInt(p.duration) + parseInt(track.duration);
          await p.save();
          message.channel.send('added 1 new song(s) to playlist:'+track.title);
        } else {
          message.channel.send('no he encontrado la cancion');
        }
      } else {
        message.channel.send('no he encontrado la playlist'+args[0]);
      }
    });*/

    }
};
