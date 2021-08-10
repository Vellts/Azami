const Command = require('../../structures/Command');
const moment = require("moment")
const champions = require("../../Util/LoL/champions")
const queueList = require("../../Util/LoL/queueList")
const { Constants, Queues, Tiers, Divisions } = require("twisted")
/*const apiLoL = new LolapiLoL({
  rateLimitRetry: true,
  rateLimitRetryAttempts: 1,
  concurrency: undefined,
  key: 'RGapiLoL-61a8d0d4-8a1e-4c4a-ae61-517bb9873990',
  debug: {
    logTime: false,
    logUrls: false,
    logRatelimit: false
  }
})*/

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'lolprofile',
      aliases: ['profilelol'],
      description: 'Obtén información de cualquier usuario en las distintas regiones de League of Legends.',
      category: 'League of Legends',
      usage: ['lolprofile <región> <summoner>'],
      examples: ['lolprofile lan Very Easy', 'lolprofile kr Hide on bush'],
      cooldown: 10,
    });
  }

  async run(message, args) {

  let regiones = {
    br: Constants.Regions.BRAZIL,
    eun: Constants.Regions.EU_EAST,
    euw: Constants.Regions.EU_WEST,
    kr: Constants.Regions.KOREA,
    lan: Constants.Regions.LAT_NORTH,
    las: Constants.Regions.LAT_SOUTH,
    na: Constants.Regions.AMERICA_NORTH,
    oc: Constants.Regions.OCEANIA,
    tr: Constants.Regions.TURKEY,
    ru: Constants.Regions.RUSSIA,
    jp: Constants.Regions.JAPAN,
    pbe: Constants.Regions.PBE,
  }

  let region = regiones[args[0]]
  if(!region) return message.reply({content: "region no valida", allowedMentions: { repliedUser: false }})
  let summoner = args.slice(1).join(" ")
  try{
    const a = await this.client.apiLoL.Summoner.getByName(summoner, region)

    ////// Maestría con Campeones //////

    let e = await this.client.apiLoL.Champion.masteryBySummoner(a.response.id, region)
    let c = e.response.map(x => x.championPoints)
    if(c[0]) var mastery1 = e.response.filter(x => x.championPoints === c[0])
    if(c[1]) var mastery2 = e.response.filter(x => x.championPoints === c[1])
    if(c[2]) var mastery3 = e.response.filter(x => x.championPoints === c[2])

    ////// Ranked //////

    let queue = await this.client.apiLoL.League.bySummoner(a.response.id, region)
    let soloqueue = queue.response.filter(x => x.queueType === 'RANKED_SOLO_5x5')
    let flexqueue = queue.response.filter(x => x.queueType === 'RANKED_FLEX_SR')

    let rankeds = {
      CHALLENGER: 'RETADOR',
      GRANDMASTER: 'GRAN MASESTRO',
      MASTER: 'MAESTRO',
      DIAMOND: 'DIAMANTE',
      PLATINUM: 'PLATINO',
      GOLD: 'ORO',
      SILVER: 'PLATA',
      BRONZE: 'BRONCE',
      IRON: 'HIERRO'
    }
    let brr = parseInt(soloqueue.map(x=> x.wins)) + parseInt(soloqueue.map(x=> x.losses))
    let brr2 = parseInt(flexqueue.map(x=> x.wins)) + parseInt(flexqueue.map(x=> x.losses))
    let percento = Math.floor(soloqueue.map(x=> x.wins) * 100 / brr)
    let percento2 = Math.floor(flexqueue.map(x=> x.wins) * 100 / brr2)

    let infosolo = soloqueue.length ? `
Tier: ${champions[soloqueue.map(x=> x.tier)]} \`${rankeds[soloqueue.map(x=> x.tier)]} ${soloqueue.map(x=> x.rank)}\`
**W${soloqueue.map(x=> x.wins)}** / **L${soloqueue.map(x=> x.losses)}** \`${soloqueue.map(x=> x.leaguePoints)}LP\` \n\`${percento}% WR\`
    ` : "Solo/Dúo: No tine registro."
    let infoflex = flexqueue.length ? `
**Tier:** ${champions[flexqueue.map(x=> x.tier)]} \`${rankeds[flexqueue.map(x=> x.tier)]} ${flexqueue.map(x=> x.rank)}\`
**W${flexqueue.map(x=> x.wins)}** / **L${flexqueue.map(x=> x.losses)}** \`${flexqueue.map(x=> x.leaguePoints)}LP\` \n\`${percento2}% WR\`
    ` : "Fléxible: No tine registro."

    ////// Porcentaje partidas //////

    const { response: { matches } } = await this.client.apiLoL.Match.list(a.response.accountId, region)
    const { gameId } = matches[0]
    const match = await this.client.apiLoL.Match.get(gameId, region)

    let resObject = match.response.participants
    let resObject2 = match.response.participantIdentities
    let resChamp = resObject.map(x => x.participantId)
    let resChamp2 = resObject2.map(x => x.participantId)

    let summoner1 = resObject2.filter(x => x.participantId === resChamp2[0]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[0]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[0]).map(n => n.player.summonerName)
    let summoner2 = resObject2.filter(x => x.participantId === resChamp2[1]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[1]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[1]).map(n => n.player.summonerName)
    let summoner3 = resObject2.filter(x => x.participantId === resChamp2[2]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[2]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[2]).map(n => n.player.summonerName)
    let summoner4 = resObject2.filter(x => x.participantId === resChamp2[3]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[3]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[3]).map(n => n.player.summonerName)
    let summoner5 = resObject2.filter(x => x.participantId === resChamp2[4]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[4]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[4]).map(n => n.player.summonerName)
    let summoner6 = resObject2.filter(x => x.participantId === resChamp2[5]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[5]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[5]).map(n => n.player.summonerName)
    let summoner7 = resObject2.filter(x => x.participantId === resChamp2[6]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[6]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[6]).map(n => n.player.summonerName)
    let summoner8 = resObject2.filter(x => x.participantId === resChamp2[7]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[7]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[7]).map(n => n.player.summonerName)
    let summoner9 = resObject2.filter(x => x.participantId === resChamp2[8]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[8]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[8]).map(n => n.player.summonerName)
    let summoner10 = resObject2.filter(x => x.participantId === resChamp2[9]).map(e => e.player.accountId).toString() === '0' ? `Bot ${resObject2.filter(x => x.participantId === resChamp2[9]).map(n => n.player.summonerName)}` : resObject2.filter(x => x.participantId === resChamp2[9]).map(n => n.player.summonerName)

    let resTeam = {
      100: "1",
      200: "2"
    }

    let winTeam = {
      false: "Perdió",
      true: "Ganó"
    }

    //////////////////////////////////////////////////////

    message.reply({
      embeds: [
        {
          title: `Perfil de ${a.response.name}`,
          fields: [
            {
              name: `Nivel`,
              value: 
              `
              \n\`${a.response.summonerLevel}\`
              `,
              inline: true
            },
            {
              name: `Posición Clasificatoria Solo/Dúo`,
              value: `
              ${infosolo}
              `,
              inline: true
            },
            {
              name: 'Posición Clasificatoria Fléxible',
              value: `${infoflex}`,
              inline: true
            },
            {
              name: `Campeones con más maestria`,
              value: `
${mastery1 ? `${champions[mastery1.map(x => x.championId)].code} **${champions[mastery1.map(x => x.championId)].champ}** - ${mastery1.map(x => x.championPoints.toLocaleString())} \`[${mastery1.map(x => x.championLevel)}]\`` : '\u200b'}
${mastery2 ? `${champions[mastery2.map(x => x.championId)].code} **${champions[mastery2.map(x => x.championId)].champ}** - ${mastery2.map(x => x.championPoints.toLocaleString())} \`[${mastery2.map(x => x.championLevel)}]\`` : '\u200b'}
${mastery3 ? `${champions[mastery3.map(x => x.championId)].code} **${champions[mastery3.map(x => x.championId)].champ}** - ${mastery3.map(x => x.championPoints.toLocaleString())} \`[${mastery3.map(x => x.championLevel)}]\`` : '\u200b'}
              `,
 
            },
            {
              name: `Información de la última partida:`,
              value: `
              \`\`\`js
Duración: ${moment.utc(match.response.gameDuration * 1000).format("HH:mm:ss")}
Modo de juego: ${queueList[match.response.queueId]}
\`\`\``
            },
            {
              name: `Team ${resTeam[resObject.filter(x => x.participantId === resChamp[0]).map(x => x.teamId)]} [${winTeam[resObject.filter(x => x.participantId === resChamp[0]).map(x => x.stats.win)]}]`,
              value: `
              ${champions[resObject.filter(x => x.participantId === resChamp[0]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[0]).map(x => x.championId)].code} **[${summoner1}]** - **\`${resObject.filter(x => x.participantId === resChamp[0]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[0]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[0]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[0]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[1]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[1]).map(x => x.championId)].code} **[${summoner2}]** - **\`${resObject.filter(x => x.participantId === resChamp[1]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[1]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[1]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[1]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[2]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[2]).map(x => x.championId)].code} **[${summoner3}]** - **\`${resObject.filter(x => x.participantId === resChamp[2]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[2]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[2]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[2]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[3]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[3]).map(x => x.championId)].code} **[${summoner4}]** - **\`${resObject.filter(x => x.participantId === resChamp[3]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[3]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[3]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[3]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[4]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[4]).map(x => x.championId)].code} **[${summoner5}]** - **\`${resObject.filter(x => x.participantId === resChamp[4]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[4]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[4]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[4]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
              `
            },
            {
              name: `Team ${resTeam[resObject.filter(x => x.participantId === resChamp[5]).map(x => x.teamId)]} [${winTeam[resObject.filter(x => x.participantId === resChamp[5]).map(x => x.stats.win)]}]`,
              value: `
              ${champions[resObject.filter(x => x.participantId === resChamp[5]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[5]).map(x => x.championId)].code} **[${summoner6}]** - **\`${resObject.filter(x => x.participantId === resChamp[5]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[5]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[5]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[5]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[6]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[6]).map(x => x.championId)].code} **[${summoner7}]** - **\`${resObject.filter(x => x.participantId === resChamp[6]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[6]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[6]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[6]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[7]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[7]).map(x => x.championId)].code} **[${summoner8}]** - **\`${resObject.filter(x => x.participantId === resChamp[7]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[7]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[7]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[7]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[8]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[8]).map(x => x.championId)].code} **[${summoner9}]** - **\`${resObject.filter(x => x.participantId === resChamp[8]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[8]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[8]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[8]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
${champions[resObject.filter(x => x.participantId === resChamp[9]).map(x => x.timeline.lane)]}  ${champions[resObject.filter(x => x.participantId === resChamp[9]).map(x => x.championId)].code} **[${summoner10}]** - **\`${resObject.filter(x => x.participantId === resChamp[9]).map(x => x.stats.kills)}/${resObject.filter(x => x.participantId === resChamp[9]).map(x => x.stats.deaths)}/${resObject.filter(x => x.participantId === resChamp[9]).map(x => x.stats.assists)}\`** - \`${resObject.filter(x => x.participantId === resChamp[9]).map(x => x.stats.totalMinionsKilled + x.stats.neutralMinionsKilled)} CS\`
              `
              }
            ],
            thumbnail: { url: `https://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${a.response.profileIconId}.png` }
          }
        ], allowedMentions: { repliedUser: false }
      })
    } catch(e) {
      console.log(e)
      return message.reply({content: "summoner no encontrado", allowedMentions: { repliedUser: false }})
    }
  }
};