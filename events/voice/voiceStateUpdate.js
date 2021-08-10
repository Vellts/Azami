const Event = require('../../structures/Event'),
	delay = ms => new Promise(res => setTimeout(res, ms))

module.exports = class voiceStateUpdate extends Event {
	async run(oldState, newState){
		/*const newMember = newState.guild.members.cache.get(newState.id);
		const channel = newState.channelId ? newState.guild.channels.cache.get(newState.channelId.id || newState.channelId) : null;

		const player = this.client.manager.players.get(newState.guild.id)
		if(!player) return;
		if (!newState.guild.members.cache.get(this.client.user.id).voice.channelId) player.destroy();

		if (newState.id == this.client.user.id && newState.channelId.type == 'stage') {
			if (!oldState.channelId) {
				try {
					await newState.guild.me.voice.setSuppressed(false).then(() => console.log(null));
				} catch (err) {
					player.pause(true);
				}
			} else if (oldState.suppress !== newState.suppress) {
				player.pause(newState.suppress);
			}
		}
		if (oldState.id === this.client.user.id) return;
		if (!oldState.guild.members.cache.get(this.client.user.id).voice.channelId) return;
		if (player.twentyFourSeven) return;
		if (oldState.guild.members.cache.get(this.client.user.id).voice.channelId === oldState.channelId) {
			if (oldState.guild.voice?.channel && oldState.guild.voice.channel.members.filter(m => !m.user.bot).size === 0) {
				const vcName = oldState.guild.me.voice.channel.name;
				await delay(180000);

				// times up check if bot is still by themselves in VC (exluding bots)
				const vcMembers = oldState.guild.voice.channel.members.size;
				if (!vcMembers || vcMembers === 1) {
					const newPlayer = this.client.manager.players.get(newState.guild.id);
					(newPlayer) ? player.destroy() : oldState.guild.voice.channel.leave();
					const embed = new MessageEmbed()
					// eslint-disable-next-line no-inline-comments
						.setDescription(`He salido de 🔉 **${vcName}** porque estuve mucho tiempo sin sonar nada..`); // If you are a [Premium](${bot.config.websiteURL}/premium) member, you can disable this by typing ${settings.prefix}24/7.`);
					try {
						const c = this.client.channels.cache.get(player.textChannel);
						if (c) c.send(embed).then(m => m.timedDelete({ timeout: 60000 }));
					} catch (err) {
						console.log(err)
					}
				}
			}
		}*/

	}
}