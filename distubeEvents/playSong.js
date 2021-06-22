const { MessageEmbed } = require('discord.js')

module.exports = (message, queue, song) => {
  try{
  queue.textChannel.send(`Escuchando ${song.name}`)
	//const embed = new MessageEmbed()
   
    //.setTitle(`🔊 Escuchando ahora en **${message.member.voice.channel.name}**`)
   /* .setDescription(`Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}
    `)
    queue.channel.send(embed)*/
  }catch(e) {
    console.log(e)
  }

}