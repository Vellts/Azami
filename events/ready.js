const Event = require('../structures/Event');
const config = require('../config.json');
const dash = require('../config.js')

module.exports = class extends Event {
    async run() {

    /*if(this.client.application?.owner) await this.client.application?.fetch()
    let slash = []
    this.client.slashCommands.forEach(e => {
        slash.push({
            name: e.name,
            description: e.description,
            options: e.options
        })
    })
    this.client.guilds.cache.forEach(async guild => {
        await this.client.guilds.cache.get(guild.id)?.commands.set(slash).catch(err => console.log(err))
    })*/
    /*this.client.slashCommands.forEach(e => {
        slash.push({
            name: e.name,
            description: e.description,
            options: e.options
        })
        this.client.application?.commands.set(slash).catch(err => console.log(err))
    })*/

    // ready interval 
    let servers = this.client.guilds.cache.size;
    let usersCount = this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    let status = [
    `@Azami help`,
    `Estoy en ${servers} servidores`,
    `Mirando ${usersCount} usuarios`,
    `¡Invitame! azamibot.xyz/invitar`,
    `azamibot.xyz`
    ]
     
    let i = 0
    
    setInterval(() => {
      if(i === status.length) i = 0
      const estado = status[i]
      this.client.user.setActivity(estado)
      i++
    }, 30000)

    this.client.manager.init(this.client.user.id);

    let v;
    if(config.dashboard === "true"){
        v = `La dashboard está activa en el puerto ${dash.port}.`
    } else {
        v = 'La dashboard no está activa.'
    }

    log([{
        name: "Cliente",
        value: [`Conectada como ${this.client.user.tag}`]
    }, {
        name: "Datos de servidores",
        value: [
            `Estoy en ${servers} servidores`,
            `Mirando ${usersCount} usuarios`,
            `${this.client.channels.cache.size} canales`,
            ] // values
    }, {
        name: "Dashboard",
        value: [
            v,
            ]
    }, {
        name: "Base de datos",
        value: ["Conectada a MongoDb"]
    }], 68, { end: true })
  }
}

function log(data, size = 68, options = { start: true, end: true, justValue: false }) {

    const { start = true, end = true, justValue = false } = options

    if (justValue) {
        data[0].value.forEach(val => {
            console.log(`║${(" > " + resume(val, size)).padEnd(size)}║`) 
        })

        if (end) console.log(`╚${"═".repeat(size)}╝`)
        return;
    }
    if (start) {
    helper(data[0].name, size, true)
    data[0].value.forEach(val => {
        console.log(`║${(" > " + resume(val, size)).padEnd(size)}║`) 
    })
    data.shift()
}

    for (const text of data) {
        helper(text.name, size)
        text.value.forEach(val => {
            console.log(`║${(" > " + resume(val, size)).padEnd(size)}║`) 
        })
    } 
    if (end) console.log(`╚${"═".repeat(size)}╝`)
}

/**
 * 
 * @param {string} text The text
 * @param {number} size Size of the text
 * @param {boolean} start If it starts or not
 * @returns {void}
 */

function helper(text, size = 68, start = false) {

    text = ` ( ${text} ) `;
    if (start) console.log(`╔${text.padStart(size / 2 + text.length / 2, "═").padEnd(size, "═")}╗`)
    else console.log(`╠${text.padStart(size / 2 + text.length / 2, "═").padEnd(size, "═")}╣`)
}

/**
 * 
 * @param {string} text the text to resume
 * @param {number} number the max size
 * @returns {string} text resumed
 */

function resume(text, number) {
    let str = '';
    if(text.length > number) {
        str += text.substring(0, number)
        str = str.slice(0, number - 6) + '...'
        return str
    } else {
    str += text
    return str
    }
  }