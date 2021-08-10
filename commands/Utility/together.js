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
        category: 'Utilidad',
        usage: ['<miembro>'],
        example: ['ban @Azami'],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    if(!args[0]) return message.reply({content: `${this.client.emote.bunnyBubble} ***¿En qué deseas pasar el tiempo?***\n\n> ${this.client.emote.pinkarrow2} *Opciones: \`Youtube\`, \`Poker\`, \`Betrayal\`, \`Fishing\`, \`Chess\`.*`, allowedMentions: { repliedUser: false }})
    const channel = message.member.voice.channel
    if(!channel) return message.reply({content: `${this.client.emote.bunnyPoke} ***¡Hey!** No puedes empezar una actividad sin estar en el canal de voz. u.u*`, allowedMentions: { repliedUser: false }});
    switch (args[0].toLowerCase()) {
      case 'youtube':
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
            "Authorization": `Bot ${this.client.config.main_token}`,
            "Content-Type": "application/json"
          }
        }).then(res => res.json()).then(invite => {
          if(!invite.code) return message.channel.send({content: 'error'})
          message.reply({embeds: [{
              title: `¡La marea ha llegado a ${message.guild.name}!`,
              description: `> ${this.client.emote.bunnyPompom} *¡Utiliza el siguiente codigo y comienza a pasarla bien con tus amigos!*\n\n***${this.client.emote.pinkarrow2} https://discord.com/invite/${invite.code}***`,
              footer: { text: `Youtube together`, icon_url: message.guild.iconURL({dynamic: true})},
              timestamp: new Date()
            }], allowedMentions: { repliedUser: false }})
        })
        break;
      case 'poker':
      fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "755827207812677713",
          target_type: 2,
          temporary : false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${this.client.config.main_token}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(invite => {
        if(!invite.code) return message.channel.send({content: 'error'})
        message.reply({embeds: [{
            title: `¡La marea ha llegado a ${message.guild.name}!`,
            description: `> ${this.client.emote.bunnyPompom} *¡Utiliza el siguiente codigo y comienza a pasarla bien con tus amigos!*\n\n***${this.client.emote.pinkarrow2} https://discord.com/invite/${invite.code}***`,
            footer: { text: `Poker together`, icon_url: message.guild.iconURL({dynamic: true})},
            timestamp: new Date()
          }], allowedMentions: { repliedUser: false }})
      })
        break;
      case 'betrayal':
      fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "773336526917861400",
          target_type: 2,
          temporary : false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${this.client.config.main_token}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(invite => {
        if(!invite.code) return message.channel.send({content: 'error'})
        message.reply({embeds: [{
            title: `¡La marea ha llegado a ${message.guild.name}!`,
            description: `> ${this.client.emote.bunnyPompom} *¡Utiliza el siguiente codigo y comienza a pasarla bien con tus amigos!*\n\n***${this.client.emote.pinkarrow2} https://discord.com/invite/${invite.code}***`,
            footer: { text: `Betrayal together`, icon_url: message.guild.iconURL({dynamic: true})},
            timestamp: new Date()
          }], allowedMentions: { repliedUser: false }})

      })
      break;
      case 'fishing':
      fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "814288819477020702",
          target_type: 2,
          temporary : false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${this.client.config.main_token}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(invite => {
        if(!invite.code) return message.channel.send({content: 'error'})
        message.reply({embeds: [{
            title: `¡La marea ha llegado a ${message.guild.name}!`,
            description: `> ${this.client.emote.bunnyPompom} *¡Utiliza el siguiente codigo y comienza a pasarla bien con tus amigos!*\n\n***${this.client.emote.pinkarrow2} https://discord.com/invite/${invite.code}***`,
            footer: { text: `Fishing together`, icon_url: message.guild.iconURL({dynamic: true})},
            timestamp: new Date()
          }], allowedMentions: { repliedUser: false }})
      })
      break;
      case 'chess':
      fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0, 
          target_application_id: "832012586023256104",
          target_type: 2,
          temporary : false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${this.client.config.main_token}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(invite => {
        if(!invite.code) return message.channel.send({content: 'error'})
        message.reply({embeds: [{
            title: `¡La marea ha llegado a ${message.guild.name}!`,
            description: `> ${this.client.emote.bunnyPompom} *¡Utiliza el siguiente codigo y comienza a pasarla bien con tus amigos!*\n\n***${this.client.emote.pinkarrow2} https://discord.com/invite/${invite.code}***`,
            footer: { text: `Chess together`, icon_url: message.guild.iconURL({dynamic: true})},
            timestamp: new Date()
          }], allowedMentions: { repliedUser: false }})
      })
      break;
    }
    }
};
