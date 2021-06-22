const { MessageEmbed } = require('discord.js')

module.exports = (queue, playlist) => {
  try{
  queue.textChannel.send(
    `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue!`
);
	//const embed = new MessageEmbed()
   
    //.setTitle(`🔊 Escuchando ahora en **${message.member.voice.channel.name}**`)
   /* .setDescription(`Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}
    `)
    queue.channel.send(embed)*/
  }catch(e) {
    console.log(e)
  }

}