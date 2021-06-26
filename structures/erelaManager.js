const { Manager } = require("erela.js"),
	Deezer = require('erela.js-deezer'),
	Spotify = require('erela.js-spotify'),
	Facebook = require('erela.js-facebook');
const { player } = require('./Player');
const Discord = require('discord.js');
const hook = new Discord.WebhookClient('857351252668317716', 'mIs9FWVj2NvvE9b-Yp_wTpTCh1bussi56A77nPJjlRrYKsxvoVn0QHKnikZc4xU9hRaj')

module.exports = (client) => {
	const clientID = "3b41b0c10c1e4c7fa2956382db2f69ca";
	const clientSecret = "428cd93c78524e6dab17bd9c85d2e765";
	client.manager = new Manager({
		nodes: [
			{
				host: 'lava.link',
				port: 80,
				password: 'youshallnotpass'
			},
		],
		plugins: [
			new Spotify({ clientID, clientSecret }),
			new Deezer({ playlistLimit: 1, albumLimit:1 }),
			new Facebook(),
		],
		send(id, payload){
			const guild = client.guilds.cache.get(id);
			if(guild) guild.shard.send(payload)
		},
	})
	.on('nodeConnect', node => {
		client.channels.cache.get('856714305029013525').send(`Lavalink encendido en ${node.options.identifier}.`)
		console.log(`Lavalink en ${node.options.identifier}.`)
	})
	.on('nodeDisconnect', (node, reason) => client.channels.cache.get('856714305029013525').send(`Lavalink node: ${node.options.identifier} fue desconectado.\nRazón: ${(reason.reason) ? reason.reason : 'nosejajaxd'}.`))
	.on('nodeError', (node, error) => client.channels.cache.get('856714305029013525').send(`Lavalink node: '${node.options.identifier}', tuvo un error: '${error.message}'.`))
	.on('playerCreate', player => {
		hook.send(`Lavalink player creado en el servidor: ${player.guild}.`);
	})
	.on('playerDestroy', player => {
		hook.send(`Lavalink player destruido en el servidor: ${player.guild}.`);
	})
	.on('trackStart', (player, track) => {
	const embed = new Discord.MessageEmbed() // When a song starts
	.setColor('RANDOM')
	.setTitle('nueva cancion xde')
	.setDescription(`[${track.title}](${track.uri}) [${client.guilds.cache.get(player.guild).member(track.requester)}]`);
	const channel = client.channels.cache.get(player.textChannel);
	if (channel) channel.send(embed).then(m => m.delete({ timeout: (track.duration < 6.048e+8) ? track.duration : 60000 }));
	if (player.timeout != null) return clearTimeout(player.timeout);// clear timeout (for queueEnd event)
	})
	.on('trackEnd', (player, track) => {
		player.addPreviousSong(track); // when track finishes add to previous songs array
	})
	.on('trackError', (player, track, payload) => {
		hook.send(`Track error: ${payload.error} en el servidor: ${player.guild}.`); // when a track causes an error
		player.resetFilter(); // reset player filter (might be the cause)
		const embed = new Discord.MessageEmbed()
		.setColor(15158332)
		.setDescription(`Se ha producido un error en la reproducción: \`${payload.error}\``);
		const channel = client.channels.cache.get(player.textChannel);
		if (channel) channel.send(embed).then(m => m.delete({ timeout: 15000 }));
	})
	.on('queueEnd', (player) => {
		player.timeout = setTimeout(() => { // When the queue has finished
		if (player.twentyFourSeven) return; // Don't leave channel if 24/7 mode is active
		const vcName = client.channels.cache.get(player.voiceChannel) ? client.channels.cache.get(player.voiceChannel).name : 'unknown';
		const embed = new Discord.MessageEmbed()
			.setDescription('He salido del canal de voz debido a que estuve 3 minutos sin reproducir nada.');
			const channel = client.channels.cache.get(player.textChannel);
			if (channel) channel.send(embed);
			player.destroy();
		}, 180000);
	})
	.on('playerMove', (player, currentChannel, newChannel) => {
		if (!newChannel) { // Voice channel updated
			const embed = new Discord.MessageEmbed()
			.setDescription('Musica terminada debido a que me sacaron del canal de voz.');
			const channel = client.channels.cache.get(player.textChannel);
			if (channel) channel.send(embed);
			player.destroy();
		} else {
			player.voiceChannel = client.channels.cache.get(newChannel);
		}
	});
}