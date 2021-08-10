const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js')
const { read24hrFormat }  = require('../../structures/Timer')
const { getSong } = require('genius-lyrics-api')
//const lyricsFinder = require('lyrics-finder');
const { paginator, swap_pages2 } = require(`../../structures/EmbedPaginator`);

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'lyrics',
        description: 'Letra de la canción que escuchas actualmente o que deseas saber.',
        category: 'Music',
        usage: [ '<Canción opcional>'],
        examples: [ 'lyrics', 'lyrics <Canción>' ],
        cooldown: 3,
      });
    }

    async run(message, args) {
      let options;
		if (args.length == 0) {
			// Check if a song is playing and use that song
			const player = this.client.manager.players.get(message.guild.id);
			if (!player) return message.channel.send('nao nao')
			options = {
				apiKey: this.client.config.geniusApi,
				title: player.queue.current.title,
				artist: '',
				optimizeQuery: true,
			};
		} else {
			// Use the message.args for song search
			options = {
				apiKey: this.client.config.geniusApi,
				title: args.join(' '),
				artist: '',
				optimizeQuery: true,
			};
		}

		// send 'waiting' message to show bot has recieved message
		//const msg = await message.channel.send(message.translate('misc:FETCHING', {
			//EMOJI: message.checkEmoji() ? bot.customEmojis['loading'] : '', ITEM: this.help.name }));

		// display lyrics
		const lyrics = await this.searchLyrics(this.client, message.guild, options, message.author);
		//msg.delete();
		if (Array.isArray(lyrics)) {
			paginate(this.client, message.channel, lyrics);
		} else {
			message.channel.send({ content: lyrics });
		}
    }

    async searchLyrics(bot, guild, options, author) {
		// search for and send lyrics
		const info = await getSong(options);

		// make sure lyrics were found
		if (!info || !info.lyrics) {
			return "nao"
		}

		// create pages
		let pagesNum = Math.ceil(info.lyrics.length / 2048);
		if (pagesNum === 0) pagesNum = 1;

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const embed = new Embed(bot, guild)
				.setTitle(options.title)
				.setURL(info.url)
				.setDescription(info.lyrics.substring(i * 2048, (i + 1) * 2048))
				.setTimestamp()
				//.setFooter('music/lyrics:FOOTER', { TAG: author.tag }, author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
			pages.push(embed);
		}

		// show paginator
		return pages;
	}
};
