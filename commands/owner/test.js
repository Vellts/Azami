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
        name: 'test',
        description: 'Has que no vuelvan los malechores.',
        category: 'Moderacion',
        usage: ['<miembro>'],
        example: ['ban @Azami'],
        cooldown: 3,
        guildOnly: true
      });
    }

    async run(message, args) {

    let msg = await message.channel.send({content: 'asdasd', components: 
        [
        new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setCustomId('a')
            .setLabel('a')
            .setStyle('PRIMARY')
            )
        ]
    })

    const filter = (interaction) => interaction.customId === 'a' && interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
    collector.on("collect", async (collected) => {
        if (collected.customID === "a"){
           await msg.edit({content: 'jajant'})
           collected.deferUpdate({
    fetchReply: true,
  });
        }

    });

 /* const canvas = Canvas.createCanvas(600, 260) //Creamos el lienzo
    const ctx = canvas.getContext('2d') //Definimos el parametro para lienzos 2d

    const image = await Canvas.loadImage(path.join(__dirname, '../../assets/images/frame1.png')) //Requerimos la imagen, si usaran imagen local deberán usar la libreria Path.
    ctx.drawImage(image, 0, 0)//Definimos el tamaño, en este caso (image, 0, 0) será el default para utilizar todo el tamaño del lienzo

    ////// texto //////

    ctx.font = '18px Arial' //Definimos el tamaño y la fuente de la letra
    ctx.textAlign = 'center'
    ctx.fillText(message.author.username, 600/2, 260/2)//Definimos el contenido que habra en el texto, en este caso el nombre del autor del mensaje, y la posición en al que estará.

    message.channel.send({
      files: [
        {
          attachment: canvas.toBuffer(),
          name: 'canvas.png'
        }
      ]
    })*/
    }
};
