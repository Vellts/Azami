const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'clear',
        aliases: ['cc', 'clean'],
        description: 'Elimina la cantidad de mensajes que deseas, con un máximo de 800.',
        category: 'Moderation',
        userPermission: ['MANAGE_MESSAGES'],
        botPermission: ['MANAGE_MESSAGES'],
        usage: ['<cantidad>', '<cantidad> <miembro>'],
        examples: ['clear 100', 'clear 400', 'clear 50 @Nero.'],
        cooldown: 3,
      });
    }

    async run(message, args) {

    const settings = await Guild.findOne({
        guildId: message.guild.id,
    }, (err, guild) => {
        if (err) console.log(err)
    });
    const lang = require(`../../data/language/${settings.language}.js`)

    const cantidad = args[0]
    if(!cantidad) return message.channel.send(`${this.client.emote.bunnyPoke} ***Se te ha olvidad agregar la cantidad de mensajes a borrar. u.u***`)
    if(isNaN(cantidad) || cantidad < 1 || cantidad > 800) return message.channel.send(`${this.client.emote.interdasting} ***No has agregado una cantidad correcta.\n\n${this.client.emote.pinkarrow2} Maxímo: \`800\`.\n${this.client.emote.pinkarrow2} Minimo: \`1\`.***`)
    if(cantidad > 300 && !message.guild.premium) return message.channel.send('guild no premium')

    if(cantidad >= 100){
        let msg = await message.channel.send(`${this.client.emote.bunnyconfused} ***¿Deseas borrar \`${cantidad}\` mensajes? Una vez borrados no se podrán recuperar.***`)
        await msg.react('✅')
        await msg.react('❎')

        const filter = (reaction, user) => ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id
        msg.awaitReactions({ filter, max: 1, time: 5000 })
        .then(async (cc) => {
            const rr = cc.first()
            if(rr.emoji.name === '✅'){
                await message.channel.send(`${this.client.emote.stars2} ***Borrando \`${cantidad}\` mensajes, la acción puede tomar \`${Math.ceil(cantidad/100) * 5}\` segundos.***`)
                await this.client.delay(5000)

                let x = 0, y = 0;
                const z = cantidad
                while(x !== Math.ceil(cantidad/100)){
                    try{
                        let messages = await message.channel.messages.fetch({ limit: z > 100 ? 100 : z })

                        if(args[1]){
                            const member = message.mentions.member.first()
                            messages = messages.filter(m => m.author.id === member.user.id)
                        }

                        const deleted = await message.channel.bulkDelete(messages, true).catch(e => console.log(`El comando ${this.name} tiene el error: ${e}`))
                        y += deleted.size;
                        x++;
                        await this.client.delay(5000)
                    } catch(e){
                        x = Math.ceil(amount / 100);
                    }
                }
                message.channel.send(`${this.client.emote.cat100} ***¡Bien! Se han borrado exitosamente \`${cantidad}\` mensajes.***`).then(x => x.deleteTimed({timeout: 5000}))
            } else if(rr.emoji.name === '❎') {
                await msg.edit(`${this.client.emote.puppySlap} ***Cancelando la limpieza...***`).then(x => x.deleteTimed({ timeout: 3000 }))
                await msg.reactions.removeAll()
            }
        }).catch(async () => {
            await msg.edit(`${this.client.emote.rabbitSleeping} ***Parece que se ha acabado el tiempo, asegurate de ejecutar la acción antes de los 15 segundos.***`).then(x => x.deleteTimed({ timeout: 3000}))
            await msg.reactions.removeAll()
        })
    } else {
        await message.channel.messages.fetch({ limit: cantidad }).then(async messages => {
                if (args[1]) {
                    const member = message.mentions.members.first();
                    messages = messages.filter((m) => m.author.id == member.user.id);
                }

                // delete the message
                await message.channel.bulkDelete(messages, true).catch(e => console.log(`El comando ${this.name} tiene el error: ${e}`));
                message.channel.send(`${this.client.emote.cat100} ***¡Bien! Se han borrado exitosamente \`${cantidad}\` mensajes.***`).then(m => m.deleteTimed({ timeout: 5000 }));
            });
        }
    }
};
