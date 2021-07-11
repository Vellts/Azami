const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const animeList = require('../../models/animelist')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'animeapproved',
        description: 'Has que no vuelvan los malechores.',
        category: 'Moderacion',
        usage: ['<miembro>'],
        example: ['ban @Azami'],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args, client = message.client) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });

    let type = args[0]
    if(!type) return
    switch(type.toLowerCase()){
    	case 'list':
    	let data = await animeList.find({ statusAnime: 'false' })
    	message.lineReplyNoMention(new MessageEmbed()
    		.setTitle('Animes sin aprovar en la base de datos.')
    		.setDescription(
    		data.map((a, b) =>
    			`${b + 1}). ${a.anime.capitalize(true)} [Imagen](${a.image})`
    		).join("\n")
    	)
    	)
    	break;
    }
    

	}
};

String.prototype.capitalize = function(allWords) {
   	return (allWords) ? this.split(' ').map(word => word.capitalize()).join(' ') : this.charAt(0).toUpperCase() + this.slice(1);
}