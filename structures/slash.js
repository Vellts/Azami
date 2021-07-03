const fs = require("fs");
exports.slash = async function (client) {
	const commandFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`../slash/${file}`);
			// dev server
			/*await client.guilds.cache.get("815213544218951740") ?.commands.create({
				name: command.name,
				description: command.description,
				options:command.options || []
			})
			//bcs 
			await client.guilds.cache.get("801839309073678346") ?.commands.create({
				name: command.name,
				description: command.description,
				options:command.options || []
			})*/

			// all
			await client.application?.commands.create({
				name: command.name,
				description: command.description,
				options:command.options || []
			})
			client.slashCommands.set(command.name, command)
	}
	createinteractionevent(client)
}

function createinteractionevent(client){
	client.on('interaction', async interaction => {
		if (interaction.isCommand()){
			interaction.author = interaction.user
			const cmd = await searchcommand(interaction)
		   if(cmd){
			   await cmd.interaction(interaction)
		   }
		}/*else if (interaction.isButton()){
			const btn = await searchbutton(interaction)
			if(btn){
				await btn.interaction(interaction)
			}
		}*/
	});
}

function searchcommand(interaction){
	const commandFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`../slash/${file}`);
		if(command.name === interaction.commandName){
			return command
		}
	}
	return false
}