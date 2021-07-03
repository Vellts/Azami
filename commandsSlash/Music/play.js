const SlashCommand = require('../../structures/SlashCommand');
const azami = require("../../packages/imageng/src/index.js")
const Discord = require('discord.js')

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      name: 'play',
      description: `cachetada unu`,
      options: [
        {
          name: 'canción',
          description: 'Ingresa la canción que deseas escuchar.',
          type: 'STRING',
          required: true,
        },
      ],
      guildOnly: true,
      voiceOnly: true,
      cooldown: 5,
    });
  }

  async run(interaction, guild, args) {
    const channel = this.client.channels.cache.get(interaction.channelID)
    const member = guild.members.cache.get(interaction.user.id)

    const song = args.get('canción')?.value;
    let player, res;
    try{
      player = this.client.manager.create({
        guild: guild.id,
        voiceChannel: member.voice.channel.id,
        textChannel: channel.id,
        selfDeafen: true,
      })
    } catch(e){
      console.log(e)
      return interaction.reply({content: 'error xd', ephemeral: true})
    }

    try{
      res = await player.search(song, member);
      if(res.loadType == 'LOAD_FILE'){
        if(!player.queue.current) player.destroy()
          throw res.exception
      }
    } catch(e) {  
      console.log(e)
      return interaction.reply({content: 'error xd', ephemeral: true})
    }

    if(res.loadType == 'NO_MATCHES'){
      if(!player.queue.current) player.destroy()
      return interaction.reply({content: 'error xd', ephemeral: true})
    } else if (res.loadType == 'PLAYLIST_LOADED'){
      if(player.state !== 'CONNECTED') player.connect()
      return interaction.reply({
       content: `Playlist agregada a la queue. \`#${res.tracks.length} canciones.\``
      })
      player.queue.add(res.tracks)
      if(!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()
    } else {
      if(player.state !== 'CONNECTED') player.connect()
      player.queue.add(res.tracks[0])
      if(!player.playing && !player.paused && !player.queue.size){
        player.play()
        return interaction.reply({
          content: `Canción agregada. (${res.tracks[0].title})[${res.tracks[0].uri}]`
        })
      }
    }
  }
};
