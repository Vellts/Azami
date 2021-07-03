const { Structures } = require('discord.js'),
	{ GuildPremium } = require('../database/schemas'),
	{ Collection } = require('discord.js'),

module.exports = Structures.extend('Guild', Guild => {
	class CustomGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.client = client
			// This for caching server settings
			this.settings = {};

			// premium guild or not
			this.premium = false;

			// slash commands
			this.interactions = new Collection();
		}

		// Fetch guild settings (only on ready event)
		async fetchGuildConfig() {
			const data = await GuildPremium.findOne({ guildId: this.id });
			this.settings = data;
		}

		// update guild settings
		async updateGuild(settings) {
			console.log(`Guild: [${this.id}] updated settings: ${Object.keys(settings)}`);
			return GuildSchema.findOneAndUpdate({ guildId: this.id }, settings).then(async () => await this.fetchGuildConfig());
		}
	}
	return CustomGuild;
});