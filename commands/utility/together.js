const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js')
const animeList = require('../../models/animelist')
const Canvas = require('canvas')
const fetch = require('node-fetch')
const path = require('path')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'together',
        description: 'Has que no vuelvan los malechores.',
        category: 'Moderacion',
        usage: ['<miembro>'],
        example: ['ban @Azami'],
        cooldown: 3,
        guildOnly: true
      }); 
    }

    async run(message, args) {

  /*'youtube':   '755600276941176913', // Note : Thanks to Snowflake thanks to whom I got YouTube ID
    'poker':     '755827207812677713',
    'betrayal':  '773336526917861400',
    'fishing':   '814288819477020702',
    'chess':     '832012586023256104'*/
    const channel = message.member.voice.channel
    if(!channel) return;
    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913",
                target_type: 2,
                temporary : false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${this.client.config.token}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(invite => {
            if(!invite.code) return message.channel.send({content: 'error'})
            message.channel.send({content: `https://discord.com/invite/${invite.code}`})
        })
   /*try {
                await fetch(`https://discord.com/api/v8/channels/${message.member.voice.channel.id}/invites`, {
                    method: 'POST',
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: '755600276941176913',
                        target_type: 2,
                        temporary: false,
                        validate: null
                    }), 
                    headers: {
                        'Authorization': `Bot ${this.client.config.token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .then(invite => {
                        if (invite.error || !invite.code) {
                            message.channel.send('An error occured while retrieving data !');
                        };
                        message.channel.send(`https://discord.com/invite/${invite.code}`)
                    })
            } catch (err) {
                message.channel.send('An error occured while starting Youtube together !');
                console.error(err)
            }*/
    }
};
