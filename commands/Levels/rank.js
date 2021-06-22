const Command = require('../../structures/Command');
const config = require('../../config.json');
const Canvas = require('canvas')
const Discord = require('discord.js')
const path = require('path')
const Level = require('../../packages/Levels/index')

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'rank',
      aliases: ["ping", "latency"],
      description: `Display\'s ${config.bot_name || 'Bot'}\'s Ping Latency.`,
      category: 'info',
      cooldown: 3,
    });
  }

  async run(message, args, client = message.client) {

  const member = message.mentions.users.first() || this.client.users.cache.find(user => user.id == args.join(' ')) || message.author
  var name;
  if(member.username.length > 13){
    var name = `${member.username.slice(0, 13)}...`
  } else {
    var name = member.username
  }
  //console.log(member.discriminator)

  //////////////////////// Niveles ////////////////////////

  const user = await Level.fetch(member.id, message.guild.id, true)
  if(!user) return message.channel.send('nao nao')
  const nextLVL = Math.floor(user.level + 1)
  const needxp = Level.xpFor(parseInt(user.level) + 1);
  const pos = user.position

  //////////////////////// Canvas ////////////////////////

  Canvas.registerFont('assets/fonts/VanillaExtractRegular.ttf', { family: 'Vanilla'})
  const canvas = Canvas.createCanvas(843, 220)
  const ctx = canvas.getContext('2d')
  const avatar = await Canvas.loadImage(member.displayAvatarURL({format: 'png', size: 1024}))
  ctx.drawImage(avatar, 45, 20, 150, 160)
  const bg = await Canvas.loadImage(path.join(__dirname, '../../assets/images/rank.png'))
  ctx.drawImage(bg, 0, 0)
  ///////// Nombre /////////
  ctx.font = '30px "Vanilla"'
  ctx.fillStyle = '#F48A4E'
  ctx.fillText(name, 223, 65)
  ///////// Tag /////////
  ctx.font = '18px "Vanilla"'
  ctx.fillStyle = '#DCDCDC'
  ctx.fillText(`#${member.discriminator}`, 455, 65)
  ///////// Rank /////////
  ctx.font = '20px "Vanilla"'
  ctx.fillStyle = '#F48A4E'
  ctx.fillText(pos, 245, 155)
  ///////// Boost /////////
  ctx.font = '20px "Vanilla"'
  ctx.fillStyle = '#F48A4E'
  ctx.fillText('0', 378, 155)
  ///////// Level /////////
  if(user.level >= 10){
    ctx.font = '18px "Vanilla"'
    ctx.testAlign = 'center'
    ctx.fillStyle = '#F48A4E'
    ctx.fillText(user.level, 672, 76.5)
  } else if (user.level >= 100){
    ctx.font = '18px "Vanilla"'
    ctx.testAlign = 'center'
    ctx.fillStyle = '#F48A4E'
    ctx.fillText(user.level, 672, 76.5)
  } else {
    ctx.font = '18px "Vanilla"'
    ctx.testAlign = 'center'
    ctx.fillStyle = '#F48A4E'
    ctx.fillText(user.level, 676, 76.5)
  }
  ///////// Xp /////////
  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${user.xp} `, 678, 158)
  ///////// Xp Necesitada /////////
  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#C4C4C4';
  ctx.fillText(`/ ${needxp}`, 682, 158)
  ///////// Barra xp /////////
   let tamano = 843
  let vol = Level.xpFor(user.level) - user.xp
  let max = Level.xpFor(user.level) - Level.xpFor(parseInt(user.level) + 1)
  let size = vol / max
  let progreso = Math.floor(size * tamano)
  const barraxp = await Canvas.loadImage(path.join(__dirname, '../../assets/images/barraxp.png'))
  ctx.drawImage(barraxp, 0, 205, progreso, 15)

  let att = new Discord.MessageAttachment(canvas.toBuffer(), `rank_${message.author.id}.png`)
  message.channel.send(att)

  }
};