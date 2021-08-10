const Command = require('../../structures/Command');
const config = require('../../config.json');
const Canvas = require('canvas')
const Discord = require('discord.js')
const path = require('path')
const Level = require('../../packages/Levels/models/levels')
const levelModel = require('../../database/schemas/levelsSystem');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'rank',
      description: ``,
      category: 'Niveles',
      cooldown: 3,
    });
  }

  async run(message, args, client = message.client) {

  const Levels = await levelModel.findOne({ guildId: message.guild.id })

  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

  ////////////// Obtención de los datos //////////////
  const nuser = await Level.find({ guildID: message.guild.id }).sort([ ['countXp', 'descending'] ]);
  const user = nuser.find(x => x.userID === member.user.id)
  if(!user) return message.channel.send('nao')

  let rank;
//for(let key of nuser){
//rank = nuser.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1
  for (let i = 0; i < nuser.length; i++){
//leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1)
    if(nuser[i].userID === member.user.id) rank = i;
  }

  let userxp = user.xp
  let pos = rank + 1
  let needxp = (12 * (user.level ** 2) + 50 * user.level + 100);
  let userlvl = user.level
  ////////////// Obtención de los datos //////////////

  Canvas.registerFont('assets/fonts/VanillaExtractRegular.ttf', { family: 'Vanilla'})
  const canvas = Canvas.createCanvas(843, 220)
  const ctx = canvas.getContext('2d')
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png', size: 1024}))
  ctx.drawImage(avatar, 45, 20, 150, 160)
  const bg = await Canvas.loadImage(path.join(__dirname, '../../assets/images/rank.png'))
  ctx.drawImage(bg, 0, 0)
  ///////// Nombre /////////
  ctx.font = '30px "Vanilla"'
  ctx.fillStyle = '#F48A4E'
  ctx.fillText(member.user.username.length > 13 ? `${member.user.username.slice(0, 13)}...` : member.user.username, 223, 65)
  ///////// Tag /////////
  ctx.font = '18px "Vanilla"'
  ctx.fillStyle = '#DCDCDC'
  ctx.fillText(`#${member.user.discriminator}`, 455, 65)
  ///////// Rank /////////
  ctx.font = '20px "Vanilla"'
  ctx.fillStyle = '#F48A4E'
  ctx.fillText(pos, 245, 155)
  ///////// Boost /////////
  ctx.font = '20px "Vanilla"'
  ctx.fillStyle = '#F48A4E'
  ctx.fillText(Levels.multiplier, 378, 155)
  ///////// Level /////////
  if(user.level >= 10){
    ctx.font = '18px "Vanilla"'
    ctx.testAlign = 'center'
    ctx.fillStyle = '#F48A4E'
    ctx.fillText(userlvl, 672, 76.5)
  } else if (user.level >= 100){
    ctx.font = '18px "Vanilla"'
    ctx.testAlign = 'center'
    ctx.fillStyle = '#F48A4E'
    ctx.fillText(userlvl, 672, 76.5)
  } else {
    ctx.font = '18px "Vanilla"'
    ctx.testAlign = 'center'
    ctx.fillStyle = '#F48A4E'
    ctx.fillText(userlvl, 676, 76.5)
  }
  ///////// Xp /////////
  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${userxp} `, 678, 158)
  ///////// Xp Necesitada /////////
  ctx.font = '14px "Vanilla"'
  ctx.textAlign = 'left';
  ctx.fillStyle = '#C4C4C4';
  ctx.fillText(`/ ${needxp}`, 682, 158)
  ///////// Barra xp /////////
   let tamano = 843
  let vol = user.xp
  let max = (12 * (user.level ** 2) + 50 * user.level + 100);
  let size = vol / max
  let progreso = Math.floor(size * tamano)
  const barraxp = await Canvas.loadImage(path.join(__dirname, '../../assets/images/barraxp.png'))
  ctx.drawImage(barraxp, 0, 205, progreso, 15)

  message.channel.send({
      files: [
        {
          attachment: canvas.toBuffer(),
          name: `rank_${message.author.id}.png`
        }
      ]
    })

  }
};
