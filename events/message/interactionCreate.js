const Event = require('../../structures/Event')
const { Permissions, Collection } = require("discord.js");
const permissions = require('../../permissions.json');
const moment = require('moment')

module.exports = class Interaction extends Event {
	constructor(...args) {
		super(...args)
		 this.impliedPermissions = new Permissions([
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "ADD_REACTIONS"
    ]);
	this.ratelimits = new Collection();
	}

	// run event
	async run(interaction) {
		if(interaction.isCommand()){
			await this.client.application?.commands.fetch()
			const guild = this.client.guilds.cache.get(interaction.guildId)
			const cmd = this.client.slashCommands.get(interaction.commandName)
			const channel = this.client.channels.cache.get(interaction.channelId)
			const member = this.client.users.cache.get(interaction.user.id)
			const guildMember = await guild.members.fetch(interaction.user.id);
			
			/////////////////

			if(cmd.nsfwOnly){
				if(!channel.nsfw) return interaction.reply({content: 'puerko', ephemeral: true})
			}

			if(cmd.voiceOnly){
				if(!guildMember.voice.channel) return interaction.reply({content: 'nostas en voz', ephemeral: true})
			}

			if(cmd.botPermission){
				const missingPermissions = channel.permissionsFor(interaction.applicationId).missing(cmd.botPermission).map(p => permissions[p]);
          		if (missingPermissions.length !== 0) return interaction.reply({content: `No tengo permiso:)\n\nRequiere los siguientes permisos: **${missingPermissions.map(p => `${p}`).join('\n')}**`, ephemeral: true})
			}

			if (cmd.userPermission) {
          		const missingPermissions = channel.permissionsFor(member).missing(cmd.userPermission).map(p => permissions[p]);
          		if (missingPermissions.length !== 0) return interaction.reply({content: `No tienes permiso:)\n\nRequiere los siguientes permisos: **${missingPermissions.map(p => `${p}`).join('\n')}`, ephemeral: true})
        	}
        	const rateLimit = this.ratelimit(interaction, cmd);
        	if (typeof rateLimit === "string") return interaction.reply({content: `${member.username}, espera **${rateLimit}** antes de volver a ejecutar **${cmd.name}**.`, ephemeral: true});

			//let cmd = this.client.slashCommands.get(interaction.commandName)
			if(interaction.commandName === cmd.name){
				await cmd.run(interaction, guild, interaction.options)
			}
		}
	}
	ratelimit(interaction, cmd) {
		try{
			const cmd = this.client.slashCommands.get(interaction.commandName)
			const cooldown = cmd.cooldown * 1000
			const ratelimits = this.ratelimits.get(interaction.user.id) || {};
			if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown;
			const difference = Date.now() - ratelimits[cmd.name];
			if (difference < cooldown) {
          		return moment.duration(cooldown - difference).format("D [dias], H [horas], m [minutos], s [segundos]", 1);
       		} else {
          		ratelimits[cmd.name] = Date.now();
          		this.ratelimits.set(interaction.user.id, ratelimits);
          		return true;
        	}
		} catch(e) {
			console.log(e)
		}
	}
}