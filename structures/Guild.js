const { Structures } = require('discord.js'),
	Guild = require('../database/schemas/Guild'),
	{ Collection } = require('discord.js');

module.exports = Object.defineProperties(Guild.prototype, {
	fetchSettings: {
		value: async function() {
			this.settings = await Guild.findOne({ guildId: this.id });
			return this.settings;
		},
	},
	settings: {
		value: {},
		writable: true,
	},
	premium: {
		value: false,
		writable: true,
	},
});