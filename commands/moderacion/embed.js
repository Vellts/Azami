const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require('../../database/schemas/Guild');
const embedModel = require('../../database/schemas/embedSettings.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'embed',
			aliases: ['embedify', 'embedbuilder'],
			description: `Make a custom embed builder with Pogy!`,
			category: 'Utility',
			guildOnly: true,
			cooldown: 5,
      userPermission: ["MANAGE_MESSAGES"]
		});
	}

	async run(message, args, client = message.client) {
		let channel = message.mentions.channels.first();
		const guildDB = await Guild.findOne({
			guildId: message.guild.id
		});

		let option = args[0]
    if(!option){
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${client.emote.rabbitHappy} ¿Como crear un embed?`)
            .setDescription(`
            *Un embed está compuesto de diferentes parametros los cuales podrás configurar a gusto propio, Azami te ofrece un basto apartado de opciones con los cuales configurarás a tu gusto todos los apartados.*
            \n${client.emote.stars2} **Crea, elimina e inspecciona tus embeds. En simples pasos.**
            \n${client.emote.pinkarrow2} \`-embed create [name]\`
${client.emote.pinkarrow2} \`-embed delete [name]\`
${client.emote.pinkarrow2} \`-embed edit [name]\`
${client.emote.pinkarrow2} \`-embed show [name]\`
${client.emote.pinkarrow2} \`-embed list\`
            \n${client.emote.pinkBunny} **Parametros con los cuales puedes personalizar tus embeds:**
            \n${client.emote.pinkarrow2} \`-embed edit [embedname] author [contenido]\`
${client.emote.pinkarrow2} \`-embed edit [embedname] title [contenido]\`
${client.emote.pinkarrow2} \`-embed edit [embedname] description [contenido]\`
${client.emote.pinkarrow2} \`-embed edit [embedname] thumbnail [link]\`
${client.emote.pinkarrow2} \`-embed edit [embedname] image [link]\`
${client.emote.pinkarrow2} \`-embed edit [embedname] footer [contenido]\`
${client.emote.pinkarrow2} \`-embed edit [embedname] color [#color-hexadecimal]\`
${client.emote.pinkarrow2} \`-embed edit [embedname] timestamp [true/false]\`
            \n${client.emote.BananaCat} **¿Qué variables puedo utilizar?**
            \n${client.emote.pinkarrow2} *Utiliza \`-variables\` para conocer las interacciones con el usuario y el servidor, y así utilizar un sistema mas amigable al usuario.*
            `)
            .setImage(`https://cdn.discordapp.com/attachments/819724275169755156/840415173798002709/unknown.png`)
        )
    }

    if(option.toLowerCase() === 'create'){
        let nameEmb = args[1]
        if(!nameEmb) return message.channel.send(`**¡Ooops ${client.emote.kawaiiPig}!** *Te has saltado un paso importante, asegurate de haber escrito el nombre del embed para que quede registrado.*\n\n${client.emote.pinkarrow} **Sintaxis:** \`-embed\``)

        let dbEm = await embedModel.findOne({ guildId: message.guild.id, name: nameEmb })
        if (!dbEm) {
            try {
                let db = await new embedModel({ guildId: message.guild.id, name: nameEmb, title: '', description: '', image: '', footer: '', thumbnail: '', author: '', timestamp: false, color: '' })
                let dbMb = await db.save()
                 message.channel.send(`${client.emote.stars1} **¡Genial! Has creado un nuevo embed llamado \`${nameEmb}\`. Usa \`-embed view ${nameEmb}\` para ver lo nuevo en tu embed.**

*Hasta ahora no luce para nada bien... ¿Cómo podré personalizarlo a mi gusto? ${client.emote.bunnyconfused}*
${client.emote.pinkarrow} **Con estos parametros, podras editar el embed a tu gusto:** \`Author\`, \`Title\`, \`Description\`, \`Image\` y \`Thumbnail\`, \`Footer\`, \`Color\`, \`Timestamp\`.
        `)
        message.channel.send(new MessageEmbed()
            .setDescription('⠀')
        )
            } catch (err) {
                console.log(err);
            }
        } else {
            return message.channel.send(`${client.emote.rabbitReally} **¡Hey hey! Ese nombre ya está siendo utilizado, si deseas borrar el embed ejecuta:**\n\n${client.emote.pinkarrow} \`-embed delete [name].\``)
        }
    } else if (option.toLowerCase() === 'edit'){
        let nameEmb = args[1]
        if(!nameEmb) return message.channel.send(`${client.emote.rabbitConfused} **Un error ha ocurrido.** *Es posible que te hayas saltado una parte de la sintaxis.*\n\n${client.emote.pinkarrow} **Sintaxis:** \`-embed\`.`)
        let parametro = args[2]
        if(!parametro) return message.channel.send(`${client.emote.rabbitConfused} **Un error ha ocurrido.** *Es posible que te hayas saltado una parte de la sintaxis.*\n\n${client.emote.pinkarrow} **Sintaxis:** \`-embed\`.`)
        let texto = args.slice(3).join(" ")
        if(!texto) return message.channel.send(`${client.emote.rabbitConfused} **Un error ha ocurrido.** *Es posible que te hayas saltado una parte de la sintaxis.*\n\n${client.emote.pinkarrow} **Sintaxis:** \`-embed\`.`)

        let data = await embedModel.findOne({ guildId: message.guild.id, name: nameEmb })
        if(data){
            switch(parametro.toLowerCase()){
                case 'author':
                    if(texto.toLowerCase() === 'default'){
                        await data.updateOne({ author: '' })
                        message.channel.send(`${client.emote.crayons} ***Me encuentro a toda marcha para eliminar la opción...***`)
                        .then((msg) => { 
                        setTimeout(function() {

                        let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                        msg.edit(`${client.emote.cuteBee} ***Seguramente te equivocaste en algo o ya no lo querías, por eso me he encargado de eliminar la opción \`Author\` del embed \`${nameEmb}\`.***`, embed)
                        }, 4000)
                        })
                    } else {
                        await data.updateOne({ author: texto })
                        await message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                        .then((msg) => {
                            setTimeout(function() { 
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                            msg.edit(`${client.emote.cuteBee} ***¡Todo en orden! Se ha modificado la opción author del embed \`${nameEmb}\`.***`, embed)
                            }, 4000)
                        })
                    }
                    break;
                case 'title':
                    if(texto.toLowerCase() === 'default'){
                        await data.updateOne({ title: '' })
                        message.channel.send(`${client.emote.crayons} ***¡A todo vapor! La opción se está eliminando...***`)
                        .then((msg) => { 
                        setTimeout(function() {
 
                        let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                        msg.edit(`${client.emote.cuteBee} ***Seguramente te equivocaste en algo o ya no lo querías, por eso me he encargado de eliminar la opción \`Título\` del embed \`${nameEmb}\`.***`, embed)
                        }, 4000)
                        })
                    } else {
                        await data.updateOne({ title: texto })
                        message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                        .then((msg) => {
                            setTimeout(function() { 
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                            msg.edit(`${client.emote.carrotWiggle} ***¡Un cambio novedoso! Has modificado el título del embed \`${nameEmb}\`.***`, embed)
                            }, 4000)
                        })
                    }
                    break;
                case 'description':
                    if(texto.toLowerCase() === 'default'){
                        await data.updateOne({ description: '' })
                        message.channel.send(`${client.emote.crayons} ***Vaya, parece que ya no quieres éste apartado, lo eliminaré en unos instantes...***`)
                        .then((msg) => { 
                        setTimeout(function() {

                        let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                        msg.edit(`${client.emote.cuteBee} ***Seguramente te equivocaste en algo o ya no lo querías, por eso me he encargado de eliminar la opción \`Description\` del embed \`${nameEmb}\`.***`, embed)
                        }, 4000)
                        })
                    } else {
                        await data.updateOne({ description: texto })
                        message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                        .then((msg) => {
                            setTimeout(function() { 
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                            msg.edit(`${client.emote.happyChick} ***¡Enhorabuena! La modificación de la descripción se ha hecho exitosamente para el embed \`${nameEmb}\`.***`, embed)
                            }, 4000)
                        })
                    }
                    break;
                case 'image':
                    if(texto.toLowerCase() === 'default'){
                        await data.updateOne({ image: '' })
                        message.channel.send(`${client.emote.crayons} ***Vaya, parece que ya no quieres éste apartado, lo eliminaré en unos instantes...***`)
                        .then((msg) => { 
                            setTimeout(function() {
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                            msg.edit(`${client.emote.cuteBee} ***Seguramente te equivocaste en algo o ya no lo querías, por eso me he encargado de eliminar la opción \`Image\` del embed \`${nameEmb}\`.***`, embed)
                            }, 4000)
                        })
                    } else {
                        let match = texto.match(/(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|)(?:$|[^\s]+))/i)
                        if(match){
                            await data.updateOne({ image: texto })
                            message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                            .then((msg) => {
                                setTimeout(function() {
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                                    msg.edit( `${client.emote.cat100} ***¡To the moon! Ahora hay una nueva maravillosa imagen para el embed \`${nameEmb}\`.***`, embed)
                                }, 4000)
                            })
                        } else {
                            message.channel.send(`${client.emote.bunnyconfused} ***Whoups! Algo ha salido mal. El enlace que has enviado no es compatible.***\n\n${client.emote.pinkarrow2} **Enlaces compatibles:** \`.jpeg, .jpg, .png y .gif\`.`)
                        }
                    }
                    break;
                case 'thumbnail':
                    if(texto.toLowerCase() === 'default'){
                        await data.updateOne({ thumbnail: '' })
                        message.channel.send(`${client.emote.crayons} ***Vaya, parece que ya no quieres éste apartado, lo eliminaré en unos instantes...***`)
                        .then((msg) => { 
                            setTimeout(function() {
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(texto.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(texto)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                            msg.edit(`${client.emote.cuteBee} ***Seguramente te equivocaste en algo o ya no lo querías, por eso me he encargado de eliminar la opción \`Thumbnail\` del embed \`${nameEmb}\`.***`, embed)
                            }, 4000)
                        })
                    } else {
                        let match = texto.match(/(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|)(?:$|[^\s]+))/i)
                        if(match){
                            await data.updateOne({ thumbnail: texto })
                            message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                            .then((msg) => {
                                setTimeout(function() {
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(texto.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(texto)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')

                                    msg.edit(`${client.emote.sweetpiano} ***¡Estreno de nueva miniatura! El thumbnail del embed \`${nameEmb}\` ha sido cambiado.***`, embed)
                                }, 4000)
                            })
                        } else if (texto === '{user_avatar}'){
                            await data.updateOne({ thumbnail: texto })
                            message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                            .then((msg) => {
                                setTimeout(function() {
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(texto.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(texto)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                                    msg.edit(`${client.emote.sweetpiano} ***¡Estreno de nueva miniatura! El thumbnail del embed \`${nameEmb}\` ha sido cambiado.***`, embed)
                                }, 4000)
                            })
                        } else {
                            return message.channel.send(`${client.emote.bunnyconfused} ***Whoups! Algo ha salido mal. El enlace que has enviado no es compatible.***\n\n${client.emote.pinkarrow2} **Enlaces compatibles:** \`.jpeg, .jpg, .png y .gif\`.`)
                        }
                    }
                    break;
                case 'footer':
                    if(texto.toLowerCase() === 'default'){
                        await data.updateOne({ footer: '' })
                        message.channel.send(`${client.emote.crayons} ***Vaya, parece que ya no quieres éste apartado, lo eliminaré en unos instantes...***`)
                        .then((msg) => { 
                        setTimeout(function() {
                        let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(texto.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(texto)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                        msg.edit(`${client.emote.cuteBee} ***Seguramente te equivocaste en algo o ya no lo querías, por eso me he encargado de eliminar la opción \`Footer\` del embed \`${nameEmb}\`.***`, embed)
                        }, 4000)
                        })
                    } else {
                        await data.updateOne({ footer: texto })
                        message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                        .then((msg) => {
                            setTimeout(function() { 
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(texto.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(texto)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                            msg.edit(`${client.emote.pinkBunny} ***Footer el embed \`${nameEmb}\` ha sido cambiado. Le ha quedado expectacular.***`, embed)
                            }, 4000)
                        })
                    }
                    break;
                case 'timestamp':
                    if(texto.toLowerCase() === 'true'){
                        await data.updateOne({ timestamp: true })
                        message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                        .then((msg) => {
                            setTimeout(function() {
                                let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                                msg.edit(`${client.emote.rocketPink} ***¡En marcha! Ahora quedará registrada la fecha en el embed \`${nameEmb}\`.***`, embed)
                            }, 4000)
                        })
                    } else if (texto.toLowerCase() === 'false') {
                        await data.updateOne({ timestamp: false })
                        message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                        .then((msg) => {
                            setTimeout(function() {
                                let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                                msg.edit(`${client.emote.rocketPink} ***Whoops, se ha desactivado la fecha en el embed \`${nameEmb}\`.***`, embed)
                            }, 4000)
                        })
                    }
                    break;
                case 'color':
                    if(texto.toLowerCase() === 'default'){
                        await data.updateOne({ color: '' })
                        message.channel.send(`${client.emote.crayons} ***Vaya, parece que ya no quieres éste apartado, lo eliminaré en unos instantes...***`)
                        .then((msg) => { 
                        setTimeout(function() {

                        let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                        msg.edit(`${client.emote.cuteBee} ***Seguramente te equivocaste en algo o ya no lo querías, por eso me he encargado de eliminar la opción \`Footer\` del embed \`${nameEmb}\`.***`, embed)
                        }, 4000)
                        })
                    } else {
                        await data.updateOne({ color: texto })
                        message.channel.send(`${client.emote.rocketPink} *Estamos con toda para que llegue los datos a la nube...*`)
                        .then((msg) => {
                            setTimeout(function() { 
                            let embed = new MessageEmbed()
                            let author = data.author
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let title = data.title
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let description = data.description
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)
                            let footer = data.footer
                                .replace(/{user}/g, message.author)
                                .replace(/{user_username}/g, message.author.username)
                                .replace(/{user_ID}/g, message.author.id)
                                .replace(/{guild_name}/g, message.guild.name)
                                .replace(/{memberCount}/g, message.guild.memberCount)

                            if(data.thumbnail === '{user_avatar}') {
                                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setThumbnail(data.thumbnail)
                            }
                            if(data.image === '{user_avatar}') {
                                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setImage(data.image)
                            }
                            if(data.footer.includes('{user_avatar}')) {
                                embed.setFooter(data.footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setFooter(data.footer)
                            }
                            if(data.author.includes('{user_avatar}')) {
                                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
                            } else {
                                embed.setAuthor(author)
                            }
                            if(data.description) embed.setDescription(description)
                            if(data.title) embed.setDescription(title)
                            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
                            embed.setColor(data.color ? data.color : '#71A1DF')
                            msg.edit(`${client.emote.pinkBunny} ***Color el embed \`${nameEmb}\` ha sido cambiado. Le ha quedado expectacular.***`, embed)
                            }, 4000)
                        })
                    }
                    break;
                }
        } else {
            return message.channel.send(`${client.emote.rabbitConfused} ***Whoops! He detectado un embed fantasma. Fijate si el nombre está bien escrito. x.x***\n\n${client.emote.bunnyconfused} *¿Cómo creo embeds?*\n${client.emote.pinkarrow} **Ingresa:** \`-embed\`.`)
        }
    } else if (option.toLowerCase() === 'view'){
        let nameEmb = args[1]
        let data = await embedModel.findOne({ guildId: message.guild.id, name: nameEmb })
        

        if(data){
            let embed = new MessageEmbed()
            let author = data.author
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)
            let title = data.title
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)
            let description = data.description
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)
            let footer = data.footer
                .replace(/{user}/g, message.author)
                .replace(/{user_username}/g, message.author.username)
                .replace(/{user_ID}/g, message.author.id)
                .replace(/{guild_name}/g, message.guild.name)
                .replace(/{memberCount}/g, message.guild.memberCount)

            if(data.thumbnail === '{user_avatar}') {
                embed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setThumbnail(data.thumbnail)
            }
            if(data.image === '{user_avatar}') {
                embed.setImage(message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setImage(data.image)
            }
            if(footer.includes('{user_avatar}')) {
               embed.setFooter(footer.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setFooter(footer)
            }
            if(data.author.includes('{user_avatar}')) {
                embed.setAuthor(author.replace('{user_avatar}', ''), message.author.displayAvatarURL({dynamic: true}))
            } else {
                embed.setAuthor(author)
            }
            if(data.description) embed.setDescription(description)
            if(data.title) embed.setDescription(title)
            embed.setTimestamp(data.timestamp ? message.author.createdTimestamp : false)
            embed.setColor(data.color ? data.color : '#71A1DF')
            message.channel.send(embed)
        } else {
            return message.channel.send(`${client.emote.rabbitConfused} ***Whoops! He detectado un embed fantasma. Fijate si el nombre está bien escrito. x.x***\n\n${client.emote.bunnyconfused} *¿Cómo creo embeds?*\n${client.emote.pinkarrow} **Ingresa:** \`-embed\`.`)
        }
    } else if (option.toLowerCase() === 'delete'){
        let nameEmb = args[1]
        if(!nameEmb) return message.channel.send(`No has mencionado el nombre del embed.`)
        let data = await embedModel.findOne({ guildId: message.guild.id, name: nameEmb })

        if(data){
            await embedModel.findOneAndDelete({ guildId: message.guild.id, name: nameEmb })
            message.channel.send(`${client.emote.redLoading} ***Estoy buscando entre mis inmensos datos tu embed, espera un poco...***`)
            .then((msg) => {
                setTimeout(function() {
                    msg.edit(`${client.emote.rabbitHappy} ***¡Bingo! He encontrado el embed y lo he eliminado, ahora tienes una ranura libre.***`)
                }, 4000)
            })
        } else {
            message.channel.send(`${client.emote.rabbitConfused} ***Whoops! He detectado un embed fantasma. Fijate si el nombre está bien escrito. x.x***\n\n${client.emote.bunnyconfused} *¿Cómo creo embeds?*\n${client.emote.pinkarrow} **Ingresa:** \`-embed\`.`)
        }
    } else if (option.toLowerCase() === 'list'){
        let data  = await embedModel.find({ guildId: message.guild.id });
        let a = data.map((nm, i) => `**${i+1})** ${nm.name}.`)

        if(data){
            message.channel.send(
                new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`Embeds de la guild ${message.guild.name}`)
                    .setDescription(a)
            )
        } else {
            return message.channel.send(`${client.emote.rabbitConfused} ***¡He tenido una busqueda exhaustiva en mi sistemas pero no he encontrado embeds..***\n\n*${client.emote.bunnyconfused} ¿Cómo creo embeds?*\n${client.emote.pinkarrow} **Ingresa:** \`-embed\`.`);
        }
    }
	}
};