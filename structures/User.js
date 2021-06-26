const { Structures } = require('discord.js');

module.exports = Structures.extend('User', User => {
	class CustomUser extends User {
		constructor(client, data) {
			super(client, data);
			this.premium = false;
		}
	}
	return CustomUser;
});