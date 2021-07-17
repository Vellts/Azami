const { Message } = require('discord.js')

module.exports = Object.defineProperties(Message.prototype, {
	deleteTimed: {
		value: function(obj) {
			setTimeout(() => {
				this.delete();
			}, obj.timeout || 3000);
		},
	},
})	