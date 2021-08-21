const Command = require('../../structures/Command');
const Canvas = require('canvas')
const Discord = require('discord.js')
const path = require('path')
const Level = require('../../packages/Levels/models/levels')
const levelModel = require('../../database/schemas/levelsSystem');

const ordinal = (num) => `${num.toLocaleString('en-US')}${[, 'st', 'nd', 'rd'][(num / 10) % 10 ^ 1 && num % 10] || 'th'}`;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'leaderboard',
      aliases: ['lb'],
      description: `ae`,
      category: 'Niveles',
      cooldown: 3,
    });
  }

  async run(message, args) {

  const Levels = await Level.find({ guildID: message.guild.id }).sort([['countXp', 'descending']])
  let user = Levels.slice(0, 10)
  let arr = []
  for(const key of user){
    const nick = await message.guild.members.fetch(key.userID) || {}
    arr.push({
      guildID: key.guildID,
      userID: key.userID,
      xp: key.xp,
      level: key.level,
      position: (user.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
      username: nick.user.username,
      discriminator: nick.user.discriminator
    })
  }

  let leadr = arr.filter(x => x.position != '1' && x.position != '2' && x.position != '3').map(x => `${x.username.toString().length > 10 ? x.username.slice(0,10) : x.username}#${x.discriminator} ∷  LVL: ${x.level}`).join("\n\n")

  /////// Canvas ///////

  Canvas.registerFont('assets/fonts/VanillaExtractRegular.ttf', { family: 'Vanilla'})
  const canvas = Canvas.createCanvas(400, 550)
  const ctx = canvas.getContext('2d')
  const bg = await Canvas.loadImage(path.join(__dirname, '../../assets/images/leaderboard.png'))
  //const bg2 = await Canvas.loadImage(path.join(__dirname, '../../assets/images/leaderboardtest.png'))

  // Posición 1 y Bg //

  let pos1Name = arr.filter(x => x.position == '1').map(u => `${u.username}`)
  let pos1Tag = arr.filter(x => x.position == '1').map(u => `${u.discriminator}`)
  let pos1Level = arr.filter(x => x.position == '1').map(u => `${u.level}`)
  let pos1Xp = arr.filter(x => x.position == '1').map(u => `${u.xp}`)
  let pos1Id = arr.filter(x => x.position == '1').map(u => `${u.userID}`)
  let member = message.guild.members.cache.get(pos1Id.toString())
  //return console.log(pos1Id.toString())

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png', size: 1024}))
  const corona = await Canvas.loadImage(path.join(__dirname, '../../assets/images/coronaRank.png'))

  ctx.drawImage(avatar, 24, 48, 110, 120)
  ctx.drawImage(bg, 0, 0)
  ctx.drawImage(corona, 15, 32, 55, 55)
  ////////////////// x, y, ancho, largo 

  ctx.font = '24px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#F48A4E';
  ctx.fillText(pos1Name.toString().length > 10 ? `${pos1Name.slice(0, 10)}...` : pos1Name, 152, 86)

  ctx.font = '12px "Vanilla"'
  ctx.textAlign = 'right';
  ctx.fillStyle = '#B6B6B6';
  ctx.fillText(`#${pos1Tag}`, 376, 86)

  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F48A4E';
  ctx.fillText(pos1Level, 284, 155)

  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F48A4E';
  ctx.fillText(pos1Xp.toString().length > 3 ? `${pos1Xp.slice(0, -3)}k` : pos1Xp, 355, 155)

  // Posición 1 //

  // Posición 2 //

  let pos2 = arr.filter(x => x.position == '2').map(u => `${u.username.toString().length > 10 ? u.username.slice(0,10) : u.username}#${u.discriminator} ∷  LVL: ${u.level}`)
  //let pos2Tag = arr.filter(x => x.position == '2').map(u => u.discriminator)
  //let pos2Level = arr.filter(x => x.position == '2').map(u => u.level)

  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.fillText(pos2, 70, 254)

  /*ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.fillText(pos2Tag, 70, 254)

  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.fillText(pos2Level, 70, 254)*/

  // Posición 2 //

  // Posición 3 //

  let pos3 = arr.filter(x => x.position == '3').map(u => `${u.username.toString().length > 10 ? u.username.slice(0,10) : u.username}#${u.discriminator} ∷  LVL: ${u.level}`)
  /*let pos3Tag = arr.filter(x => x.position == '3').map(u => u.discriminator)
  let pos3Level = arr.filter(x => x.position == '3').map(u => u.level)*/

  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.fillText(pos3, 70, 286)

  /*ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#B6B6B6';
  ctx.fillText(`#${pos3Tag}`, 70*2, 286)

  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.fillText(pos3Level, 70, 286)*/
  
  // Posición 3 //

  // Posición 4-10 //

  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.fillText(leadr, 70, 318)

  // Posición 4-10 //

  //////////////////////////////////////////

  message.channel.send({
    files: [
      {
        attachment: canvas.toBuffer(),
        name: `leaderboard_${message.guild.id}.png`
      }
    ]
  })

  /*message.channel.send({embeds: [
      {
          title: `Leaderboard de ${message.guild.name}`,
          description: leadr,
          footer: {0
            text: message.guild.name,
            icon_url: message.guild.iconURL({dynamic: true})
          }
      }
    ]
  })*/

  }
};